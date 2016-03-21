//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import request from 'superagent-bluebird-promise';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/login.css';

export default class LoginContent extends Component {
  state = {email: '', password: ''};

  onLogin = () => {
    console.log("sending request");
    var promise = request
      .post('/api/login/')
      .set('Accept', 'application/json')
      .field('email', this.state.email)
      .field('password', this.state.password)
      .promise()
      .then(function(res) {
        console.log(res);
        //let resJson = JSON.parse(res.text);
        // TODO(rwillard): Parse response and account for valid/invalid authentication.
        console.log("response");
      });
  }

  setEmail = () => {
    this.setState({email:this.refs.email.getValue()});
  }

  setPassword = () => {
    this.setState({password:this.refs.password.getValue()});
  }

  render(){
    return(
      <PageTemplate title="Login" subtitle="Login to your account.">
        <div className="loginWrapper">
          <p>Email:</p>
          <Input
            type="text"
            ref="email"
            placeholder="Enter email"
            onChange={this.setEmail}/>
          <div className="clear"/>
          <p>Password:</p>
          <Input
            type="text"
            ref="password"
            placeholder="Enter password"
            onChange={this.setPassword}/>
          <div className="clear"/>
          <Button className="loginBtn" bsStyle="primary" onClick={this.onLogin}>LOGIN</Button>
          <Button href="/register" className="registerBtn">REGISTER</Button>
        </div>
      </PageTemplate>
    );
  }
}