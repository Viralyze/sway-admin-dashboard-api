import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Twit from 'twit';

// Firebase Init
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyBWNb4qsOVe6rIPv1CmKvI44anyq4xs1oY",
    authDomain: "test-142d6.firebaseapp.com",
    databaseURL: "https://test-142d6.firebaseio.com",
};
firebase.initializeApp(config);

var Queue = require('bull');

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
  	res.json({ version });
	});

  api.get('/updateQueueAndStartTrading', (req, res) => {
    updateQueueAndStartTrading();
	});

  api.get('/createAccount', (req, res) => {
    createAccount();
	});

  api.get('/setAccountTradeLists', (req, res) => {
    setAccountTradeLists();
	});

  /**
   * Updates and starts trading the queues
   * @return {[type]} void
   */
  function updateQueueAndStartTrading() {
    Promise.all([getActiveTrades()])
    .then(function(snapshot) {
      var tradeListsInCategory = snapshot[0].val();

      for (var accountKey in tradeListsInCategory) {
        var spotsInActiveTrades = tradeListsInCategory[accountKey].spots;

        var tradeQueue = Queue(accountKey, 6379, '127.0.0.1');

        tradeQueue.process(function(jobData, done) {
          // Extract Tweet IDs from URLs
          var adUrl = jobData.data.adUrl;
          var regOneUrl = jobData.data.regOneUrl;
          var regTwoUrl = jobData.data.regTwoUrl;

          var adUrlArr = adUrl.split("/");
          var regOneUrlArr = regOneUrl.split("/");
          var regTwoUrlArr = regTwoUrl.split("/");

          var adId = adUrlArr[adUrlArr.length-1];
          var regOneId = regOneUrlArr[regOneUrlArr.length-1];
          var regTwoId = regTwoUrlArr[regTwoUrlArr.length-1];

          // Do some work
          var T = new Twit({
            consumer_key: 'wBosAFst8M9CI7OPoVGshtKsm',
            consumer_secret: 'GcAWRMpKl2VKkQhSeeO0vFVHbPuqiIOqQl99dsk6UdSyYIbz1F',
            access_token: jobData.data.accOAuth.accessToken,
            access_token_secret: jobData.data.accOAuth.accessTokenSecret
          });

          // Reg spot #1
          T.post('statuses/retweet/:id', { id: regOneId }, function (err, data, response) {
            if (err) {
              console.log(err.message + " reg spot 1");
            } else {
              console.log('retweeted spot 1');
              jobData.progress(16);
              // Reg spot #2
              T.post('statuses/retweet/:id', { id: regTwoId }, function (err, data, response) {
                if (err) {
                  console.log(err.message + " reg spot 2");
                } else {
                  console.log('retweeted spot 2');
                  jobData.progress(32);
                  // Ad spot
                  T.post('statuses/retweet/:id', { id: adId }, function (err, data, response) {
                    if (err) {
                      console.log(err.message + " ad spot");
                    } else {
                      console.log('retweeted ad');
                      jobData.progress(48);
                    }
                  });
                }
              });
            }
          });

          // Finish the task asynchronously
          setTimeout(function() {
            // Unretweet everything before moving to next task
            // Reg spot #1
            T.post('statuses/unretweet/:id', { id: regOneId }, function (err, data, response) {
              if (err) {
                console.log(err.message + " reg spot 1");
              } else {
                console.log('unretweeted spot 1');
                jobData.progress(64);
              }
            });

            // Reg spot #2
            T.post('statuses/unretweet/:id', { id: regTwoId }, function (err, data, response) {
              if (err) {
                console.log(err.message + " reg spot 2");
              } else {
                console.log('unretweeted spot 2');
                jobData.progress(80);
              }
            });

            // Ad spot
            T.post('statuses/unretweet/:id', { id: adId }, function (err, data, response) {
              if (err) {
                console.log(err.message + " ad spot");
              } else {
                console.log('unretweeted ad');
                jobData.progress(100);
              }
            });

            jobData.progress(100);
            done();
          }, 1000 * 60 * 20); // 19 mins
        });

        var jobTimeStart = -1200000;
        for (var spotKey in spotsInActiveTrades) {
          spotsInActiveTrades[spotKey]['accOAuth'] = tradeListsInCategory[accountKey].accOAuth;

          var jobData = spotsInActiveTrades[spotKey];

          jobTimeStart += 1200000;
          var options = {
            'attempts' : 2,
            'timeout' : 1000 * 60 * 25, // 20 mins
            // 'jobId' : spotKey,
            'delay' : jobTimeStart,
            'removeOnComplete' : true
          };
          tradeQueue.add(jobData, options);
        }
      }
    });
  }

  /**
   * Queries firebase to get the tasks in the queue
   * @return {[type]} json object
   */
  function getQueueData() {
    var ref = firebase.database().ref("queue");
    return ref.once("value", function(snapshot) {
      return snapshot.val();
    });
  }

  /**
   * Queries firebase to get active trades
   * @return {[type]} json object
   */
  function getActiveTrades() {
    var ref = firebase.database().ref("activeTrades");
    return ref.orderByChild("accCategory").equalTo("Lifestyle").once("value", function(snapshot) {
      return snapshot.val();
    });
  }

  /**
   * Queries firebase to get a specified spot's info
   * @param  {[type]} spotKey [key of a specified spot]
   * @return {[type]}         [json object]
   */
  function getPendingSpotInfo(spotKey) {
    spotKey = '-KSr9eAScRzK9M_UIXJq';
    var ref = firebase.database().ref("spots/" + spotKey);
    return ref.once("value", function(snapshot) {
      return snapshot.val();
    });
  }

  /**
   * Function will add a spot to the trade list of accounts,
   * will need to execute for each spot
   */
  function setAccountTradeLists() {
    Promise.all([getPendingSpotInfo(), getActiveTrades()])
      .then(function(snapshots) {
        var spotInfo = snapshots[0].val();
        var tradeListsInCategory = snapshots[1].val();

        for (var accountKey in tradeListsInCategory) {
          if (tradeListsInCategory.hasOwnProperty(accountKey)) {
            if (accountKey != spotInfo.accountKey) {

              var updates = {};
              var spotKey = spotInfo.spotKey;
              updates['/activeTrades/' + accountKey + '/spots/' + spotKey] = spotInfo;

              firebase.database().ref().update(updates);
            }
          }
        }
      });
    }

    /**
     * Dummy function to create an account and info into activeTrades table
     * @return {[type]} [description]
     */
    function createAccount() {
      // var accInfo = {
      //   "accCategory" : "Lifestyle",
      //   "accType" : "Twitter",
      //   "handle" : "@alexviralyze",
      //   "image" : "https://pbs.twimg.com/profile_images/657988179828604928/pS97oW_f_normal.jpg",
      //   "name" : "Alexander Nguyen",
      //   "accOAuth" : {
      //     "consumerKey" : "5WvOznkglrwslowIgE0DPxCkH",
      //     "consumerSecret" : "592Dffopxly02EUkwiQ1UV0zFSmnqI5kA9sdVDFROtpW1VXmJl",
      //     "accessToken" : "787010409328889856-pZTosja1sjEz94Pv08nMzAXLs8nvupT",
      //     "accessTokenSecret" : "0HEAI6GnvwTDkW3w2n900HfhqozUXKi8AuvzNztzwsAqw"
      //   }
      // };
      // var accKey = 'alexviralyze-Twitter';

      // var accInfo = {
      //   "accCategory" : "Lifestyle",
      //   "accType" : "Twitter",
      //   "handle" : "@alxdrnguyen",
      //   "image" : "https://pbs.twimg.com/profile_images/578311525263282176/1mVSW9vX_normal.jpeg",
      //   "name" : "Alexander N",
      //   "accOAuth" : {
      //     "consumerKey" : "wBosAFst8M9CI7OPoVGshtKsm",
      //     "consumerSecret" : "GcAWRMpKl2VKkQhSeeO0vFVHbPuqiIOqQl99dsk6UdSyYIbz1F",
      //     "accessToken" : "140631605-v9EXXYJHAAiTzYuo2L2jHS3FIeE8HTMP2WsUKwEO",
      //     "accessTokenSecret" : "hwngnDKxR3IVY0G7IOHDScacGIVxmSnY6x4T1YX03h9FC"
      //   }
      // };
      // var accKey = 'alxdrnguyen-Twitter';

      // var accInfo = {
      //   "accCategory" : "Lifestyle",
      //   "accType" : "Twitter",
      //   "handle" : "@mycoollifestyle",
      //   "image" : "https://pbs.twimg.com/profile_images/777592386473988096/Lc0fcmPs_normal.jpg",
      //   "name" : "MyLifestyle",
      //  "accOAuth" : {
      //    "consumerKey" : "1c84SXh6SQNn1seShWNf29nCL",
      //    "consumerSecret" : "bdeSnI1LAdnyFG5f1J98G6qO91xBTwPfKtT5HxxARstM6eHkiv",
      //    "accessToken" : "787011363369463808-oLSYLvcahycSd1mGdcuyUdg7L8cFA6O",
      //    "accessTokenSecret" : "7Sej0r3gKgv8iHdjBUEVZDlShNkt3DgcyjW0BSfzVTwvD"
      //  }
      // };
      // var accKey = 'mycoollifestyle-Twitter';

      var updates = {};
      var accInfoForTrades = {
        "accCategory" : accInfo.accCategory,
        "accOAuth" : accInfo.accOAuth
      }
      updates['/activeTrades/' + accKey] = accInfoForTrades;

      firebase.database().ref().update(updates);
    }

	return api;
}
//
