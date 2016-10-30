import React from 'react';
import * as firebase from 'firebase';

import {
  Row,
  Col,
  Grid,
  Panel,
  Button,
  Table,
  PanelBody,
  PanelHeader,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix';

export default class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      spots: []
    };
  }

  componentDidMount() {
    // Querying unapproved spots data
    this.spotsRef = firebase.database().ref("spots").orderByChild("approved").equalTo(false);
    this.spotsRef.on("value", function(dataSnapshot) {
      var spots = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        spots.push(childData);
      });
      this.setState({
        spots: spots
      });
    }.bind(this));

    // Querying unapproved accounts data
    this.accountsRef = firebase.database().ref("accounts").orderByChild("approved").equalTo(false);
    this.accountsRef.on("value", function(dataSnapshot) {
      var accounts = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        accounts.push(childData);
      });
      this.setState({
        accounts: accounts
      });
    }.bind(this));
  }

  addToTrades(spot) {
    fetch("http://localhost:5100/api/addSpotToTrades", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spot)
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    });
  }

  render() {
    const accountItems = this.state.accounts.map((account) =>
      <tr key={account.handle}>
        <td>{account.handle}</td>
        <td>{account.name}</td>
        <td>{account.accCategory}</td>
        <td>{account.accType}</td>
        <td><Button bsSize='sm' bsStyle="success">Approve</Button></td>
        <td><Button bsSize='sm' bsStyle="danger">Reject</Button></td>
      </tr>
    );

    const spotItems = this.state.spots.map((spot) =>
      <tr key={spot.spotKey}>
        <td>{spot.handle}</td>
        <td><a href={spot.adUrl} target='_blank'>Ad Spot</a></td>
        <td><a href={spot.regOneUrl} target='_blank'>Reg #1 Spot</a></td>
        <td><a href={spot.regTwoUrl} target='_blank'>Reg #2 Spot</a></td>
        <td>{spot.accCategory}</td>
        <td>{spot.accType}</td>
        <td><Button onClick={() => this.addToTrades(spot)} bsSize='sm' bsStyle="success">Add to Trades</Button></td>
        <td><Button bsSize='sm' bsStyle="danger">Reject</Button></td>
      </tr>
    );

    return (
      <div>
        <Row>
          <Col xs={12}>
            <PanelContainer>
              <Panel>
                <PanelBody>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <h4 style={{marginTop: 0}}>Accounts Pending Approval</h4>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Handle</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Type</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            { accountItems }
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelContainer>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <PanelContainer>
              <Panel>
                <PanelBody>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <h4 style={{marginTop: 0}}>Spots Pending Approval</h4>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Handle</th>
                              <th>Ad URL</th>
                              <th>Reg #1 URL</th>
                              <th>Reg #2 URL</th>
                              <th>Category</th>
                              <th>Type</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            { spotItems }
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelContainer>
          </Col>
        </Row>
      </div>
    );
  }
}
