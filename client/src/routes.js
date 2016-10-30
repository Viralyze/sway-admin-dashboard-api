import React from 'react';
import * as firebase from 'firebase';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

import Dashboard from './routes/dashboard';
import Tables from './routes/tables';

// Firebase config
var config = {
  apiKey: "AIzaSyBWNb4qsOVe6rIPv1CmKvI44anyq4xs1oY",
  authDomain: "test-142d6.firebaseapp.com",
  databaseURL: "https://test-142d6.firebaseio.com",
  storageBucket: "test-142d6.appspot.com"
};
firebase.initializeApp(config);

class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }
}

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Dashboard} />
    <Route path='/tables' component={Tables} />
  </Route>
);
