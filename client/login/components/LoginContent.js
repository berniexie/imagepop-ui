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

export default class LoginContent extends Component {
  state = {email: '', password: '', failedAttempt: false};

  onLogin = () => {
    var promise = request
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({email: this.state.email, password: this.state.password})
      .promise()
      .then((res) =>{
        let resJson = JSON.parse(res.text);
        PubSub.publish('LOGIN', true);
        this.setState({failedAttempt: false});
        browserHistory.push('/main');
      })
      .catch((error) =>{
        let resJson = JSON.parse(error.res.text);
        console.log(resJson.message);
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