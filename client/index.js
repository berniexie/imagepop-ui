//rendering of landing page

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import Landing from "./landing/components/Landing.js";
import Demo from "./demo/components/Demo.js";
import Main from "./main/components/Main.js";
import Login from "./login/components/LoginContent.js";
import Logout from "./logout/components/LogoutContent.js";
import Register from "./register/components/RegisterContent.js";
import About from "./about/components/AboutContent.js";

ReactDOM.render((
	<Router history={browserHistory}>
		<Route name="app" path="/" component={Landing}/>
    	<Route name="demo" path="/demo" component={Demo}/>
    	<Route name="main" path="/main" component={Main}/>
    	<Route name="login" path="/login" component={Login}/>
    	<Route name="logout" path="/logout" component={Logout}/>
    	<Route name="register" path="/register" component={Register}/>
    	<Route name="about" path="/about" component={About}/>
	</Router>
), document.getElementById('app') );
