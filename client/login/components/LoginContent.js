//container for all of the components of the login page
import React, { PropTypes, Component } from 'react';
import { Input, Button, Grid, Row } from 'react-bootstrap';
import { Link } from 'react-router';
import request from 'superagent-bluebird-promise';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/login.css';
import PubSub from 'pubsub-js';
import {browserHistory} from 'react-router';
import SocialLogins from '../../shared/components/SocialLogins.js';
import Config from 'Config';
import {Auth} from '../auth';

export default class LoginContent extends Component {
  state = {email: '', password: '', failedAttempt: false};

  onLogin = () => {
    var promise = request
      .post(Config.apiHost + '/api/users/login')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({email: this.state.email, password: this.state.password})
      .promise()
      .then((res) =>{
        console.log(res);
        let resJson = JSON.parse(res.text);
        Auth.setToken(resJson.token);
        PubSub.publish('LOGIN', true);
        this.setState({failedAttempt: false});
        browserHistory.push('/main');
      })
      .catch((error) =>{
        console.log(error);
        Auth.setToken(null);
        this.setState({failedAttempt: true});
      });
  }

  setEmail = (e) => {
    this.setState({email:e.target.value});
  }

  setPassword = (e) => {
    this.setState({password:e.target.value});
  }

  render(){
    return(
      <PageTemplate title="Login" subtitle= "Login to your account.">
        <div className="loginWrapper">
          <Input 
            type="text"
            placeholder="Enter email"
            label="Email:"
            onChange={this.setEmail}/>
          <Input
            type="password"
            placeholder="Enter password"
            label="Password:"
            onChange={this.setPassword}/>
          <Button className="loginBtn" bsStyle="primary" onClick={this.onLogin}>LOGIN</Button>
          <Link to="/register"><Button className="registerBtn">REGISTER</Button></Link>
          {this.state.failedAttempt ? <div className="failLabel"> Sorry, either your email or password was incorrect. 
              Please try again. </div> : null}
          <SocialLogins />
        </div>
      </PageTemplate>
    );
  }
}