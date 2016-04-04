//container for all of the components of the register page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/register.css';
import request from 'superagent-bluebird-promise';
import {browserHistory} from 'react-router';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

export default class RegisterContent extends Component {
  state = {email: '', password: '', failedText: ''};

  handleClick = () => {
    var promise = request
        .post('/api/register/')
        .send({email: this.state.email, password: this.state.password})
        .set('Accept', 'application/json')
        .promise()
        .then((res) => {
          let resJson = JSON.parse(res.text);
          this.setState({failedText: ''});
          browserHistory.push('/main');
        })
        .catch((error) => {
          let resJson = JSON.parse(error.res.text);
          switch (error.status) {
            case 400: // Email or password blank
              this.setState({failedText: "Please make sure to complete all fields."});
              break;
            case 406: // Email already has account
              this.setState({failedText: "Sorry, that e-mail already has an account."});
              break;
          }
        });
  }

  setEmail = (e) => {
    this.setState({email:e.target.value});
  }

  setPassword = (e) => {
    this.setState({password:e.target.value});
  }

  responseFacebook = (response) => {
    console.log(response);
  }
  
  responseGoogle = (response) => {
    console.log(response);
  }

  render(){
    return(
      <PageTemplate title="Register" subtitle="Register for an account.">
        <div className="registerWrapper">
          <Input
            type="text"
            label="Name:"
            placeholder="Enter name"/>
          <Input
            type="text"
            label="Email:"
            placeholder="Enter email"
            onChange={this.setEmail}/>
          <Input
            type="password"
            label="Password:"
            placeholder="Enter password"
            onChange={this.setPassword}/>
          <Input
            type="password"
            label="Verify Password:"
            placeholder="Re-enter password"/>
          <Button bsStyle="primary" className="registerBtn" onClick={this.handleClick}>REGISTER</Button>
          <div className="failLabel"> {this.state.failedText}</div>
          <FacebookLogin
            appId="1118444891540927"
            autoLoad={true}
            callback={this.responseFacebook}
            cssClass="login-btn fb-btn" />
          <GoogleLogin
            clientId={'828296505469-3bv5don9idgpofga71j3s0c80annvdh9.apps.googleusercontent.com'}
            callback={this.responseGoogle}
            offline={false}
            cssClass="login-btn google-btn" />
        </div>
      </PageTemplate>
    );
  }
}