/**
 * Created by BernardXie on 2/19/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

var Router = require('react-router').Router;
var Route = require('react-router').Route;

var landingPage = require('./index/components/landing_component.jsx');

ReactDOM.render(
  <Router>
    <Route path="/" component={landingPage} />
  </Router>,
  document.getElementById('app')
);

