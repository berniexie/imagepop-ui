//rendering of landing page

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Landing from "./components/Landing.js";
import {Router, Route, hashHistory} from 'react-router';
import Demo from "../demo/demo.js";

let routes = (  
  <Route name="app" path="/" component={Landing}>
    <Route name="demo" path="demo" component={Demo}/>
  </Route>
);

ReactDOM.render(<Router routes={routes} history={hashHistory}/>, document.getElementById('app') );
