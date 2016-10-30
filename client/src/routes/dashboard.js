import React from 'react';
import * as firebase from 'firebase';

import {
  Row,
  Tab,
  Col,
  Nav,
  Icon,
  Grid,
  Form,
  Table,
  Label,
  Panel,
  Button,
  NavItem,
  Checkbox,
  Progress,
  PanelBody,
  FormGroup,
  PanelLeft,
  isBrowser,
  InputGroup,
  LoremIpsum,
  PanelRight,
  PanelHeader,
  FormControl,
  PanelContainer,
  PanelTabContainer,
} from '@sketchpixy/rubix';

// class Contact extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       invited: this.props.invited ? true : false,
//       invitedText: this.props.invited ? 'invited' : 'invite'
//     };
//   }
//   handleClick(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.setState({
//       invited: !this.state.invited,
//       invitedText: (!this.state.invited) ? 'invited': 'invite'
//     });
//   }
//   render() {
//     return (
//       <tr>
//         <td style={{verticalAlign: 'middle', borderTop: this.props.noBorder ? 'none': null}}>
//           <img src={`/imgs/app/avatars/${this.props.avatar}.png`} />
//         </td>
//         <td style={{verticalAlign: 'middle', borderTop: this.props.noBorder ? 'none': null}}>
//           {this.props.name}
//         </td>
//         <td style={{verticalAlign: 'middle', borderTop: this.props.noBorder ? 'none': null}} className='text-right'>
//           <Button onlyOnHover bsStyle='orange' active={this.state.invited} onClick={::this.handleClick}>
//             {this.state.invitedText}
//           </Button>
//         </td>
//       </tr>
//     );
//   }
// }
//

class MainChart extends React.Component {
  componentDidMount() {
    var chart = new Rubix('#main-chart', {
      width: '100%',
      height: 300,
      title: 'Chart of Total Users',
      titleColor: '#2EB398',
      subtitle: 'Period: 2004 and 2008',
      subtitleColor: '#2EB398',
      axis: {
        x: {
          type: 'datetime',
          tickCount: 3,
          label: 'Time',
          labelColor: '#2EB398'
        },
        y: {
          type: 'linear',
          tickFormat: 'd',
          tickCount: 2,
          labelColor: '#2EB398'
        }
      },
      tooltip: {
        color: '#55C9A6',
        format: {
          y: '.0f',
          x: '%x'
        }
      },
      margin: {
        top: 25,
        left: 50,
        right: 25
      },
      interpolate: 'linear',
      master_detail: true
    });

    var total_users = chart.area_series({
      name: 'Total Users',
      color: '#2EB398',
      marker: 'circle',
      fillopacity: 0.7,
      noshadow: true
    });

    chart.extent = [1297110663*850+(86400000*20*(.35*40)), 1297110663*850+(86400000*20*(.66*40))];

    var t = 1297110663*850;
    var v = [5, 10, 2, 20, 40, 35, 30, 20, 25, 10, 20, 10, 20, 15, 25, 20, 30, 25, 30, 25, 30, 35, 40, 20, 15, 20, 10, 25, 15, 20, 10, 25, 30, 30, 25, 20, 10, 50, 60, 30];

    var getValue = function() {
      var val = v.shift();
      v.push(val);
      return val;
    }

    var data = d3.range(40).map(function() {
      return {
        x: (t+=(86400000*20)),
        y: getValue()
      };
    });

    total_users.addData(data);
  }
  render() {
    return (
      <PanelBody style={{paddingTop: 5}}>
        <div id='main-chart'></div>
      </PanelBody>
    );
  }
}

class DatabaseStatsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numSpots: 0,
      numAccounts: 0
    };
  }

  componentDidMount() {
    // Querying total number of spots
    this.spotsRef = firebase.database().ref("spots");
    this.spotsRef.on("value", function(dataSnapshot) {
      var numSpots = dataSnapshot.numChildren();
      this.setState({
        numSpots: numSpots
      });
    }.bind(this));

    // Querying total number of accounts
    this.accountsRef = firebase.database().ref("accounts");
    this.accountsRef.on("value", function(dataSnapshot) {
      var numAccounts = dataSnapshot.numChildren();
      this.setState({
        numAccounts: numAccounts
      });
    }.bind(this));
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={3} className='text-center'>
            <br/>
            <div>
              <h2>Total Users</h2>
              <h1 className='fg-green visible-xs visible-md visible-lg'>0</h1>
              <h2 className='fg-green visible-sm'>0</h2>
            </div>
            <br/>
          </Col>
          <Col xs={3} className='text-center'>
            <br/>
            <div>
              <h2>Total Social Accounts</h2>
              <h1 className='fg-green visible-xs visible-md visible-lg'>{ this.state.numAccounts }</h1>
              <h2 className='fg-green visible-sm'>{ this.state.numAccounts }</h2>
            </div>
            <br/>
          </Col>
          <Col xs={3} className='text-center'>
            <br/>
            <div>
              <h2>Total Spots</h2>
              <h1 className='fg-green visible-xs visible-md visible-lg'>{ this.state.numSpots }</h1>
              <h2 className='fg-green visible-sm'>{ this.state.numSpots }</h2>
            </div>
            <br/>
          </Col>
          <Col xs={3} className='text-center'>
            <br/>
            <div>
              <h2>Total Active Trades</h2>
              <h1 className='fg-green visible-xs visible-md visible-lg'>0</h1>
              <h2 className='fg-green visible-sm'>0</h2>
            </div>
            <br/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class TradingPanel extends React.Component {
  startTrading() {
    fetch("http://localhost:5100/api/updateQueueAndStartTrading", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    });
  }

  render() {
    return (
      <PanelContainer>
        <Panel className='bg-brown50 fg-white' style={{verticalAlign: 'middle'}}>
          <Grid>
            <Row>
              <Col xs={12}>
                <div className='text-center'>
                  <Icon glyph='climacon rain cloud' style={{fontSize: '800%', lineHeight: 0}} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className='text-center'>
                  <Button onClick={() => this.startTrading()} lg inverse outlined style={{marginBottom: 5, marginTop: 5}} bsStyle='default'>Start Trading</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className='text-center'>
                <h5>Thundershower</h5>
                <h6>Wind: 9 km/h | Humidity: 91%</h6>
              </Col>
            </Row>
          </Grid>
        </Panel>
      </PanelContainer>
    );
  }
}


export default class Dashboard extends React.Component {
  render() {
    return (
      <div className='dashboard'>
        <Row>
          <Col sm={12}>
            <PanelTabContainer id='dashboard-main' defaultActiveKey="demographics">
              <Panel>
                <DatabaseStatsPanel />
              </Panel>
            </PanelTabContainer>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <TradingPanel />
          </Col>
        </Row>
      </div>
    );
  }
}
