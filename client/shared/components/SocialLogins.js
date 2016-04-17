//Reusable component for social logins
'use strict';

import React, { PropTypes, Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import styles from '../../../public/css/socialLogins.css';
import request from 'superagent-bluebird-promise';
import Config from 'Config';
import {browserHistory} from 'react-router';
import {Auth} from '../../login/auth';




export default class SocialLogins extends Component{
  state = {email: '', password: '', failedLogin: false};

  responseFacebook = (response) => {
    if (response.status != "unknown") {
      this.state.email = response.id;
      this.state.password = response.name;
      this.postLogin(response,  response.name, response.name);
    }
  };

  responseGoogle = (response) => {
    this.state.email = response.wc.hg;
    this.state.password = response.El;
    this.postLogin(response, response.wc.Za, response.wc.Na);
  };

  postLogin = (response, first, last) => {
    var promise = request
        .post(Config.apiHost + '/api/users/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({email: this.state.email, password: this.state.password})
        .then((res) =>{
          let resJson = JSON.parse(res.text);
          Auth.setToken(resJson.token);
          this.setState({failedLogin: false});
          browserHistory.push('/main');
        })
        .catch((error) =>{
          Auth.setToken(null);
          this.setState({failedLogin: true});
          this.postRegister(response, first, last);
        });
  }

  postRegister = (response, first, last) => {
    var promise = request
        .post(Config.apiHost + '/api/users/register')
        .send({email: this.state.email, password: this.state.password,
          firstName: first, lastName: last})
        .set('Accept', 'application/json')
        .then((res) => {
          this.setState({failedText: ''});
          this.postLogin();
          promise.cancel();
        })
        .catch((error) => {
          console.log(error);
          switch (error.status) {
            case 400: // Email or password blank
              this.setState({failedText: "Please make sure to complete all fields."});
              break;
            case 406: // Email already has account
              this.setState({failedText: "Sorry, that e-mail already has an account."});
              break;
          }
        });
  };

  render() {
    return (
      <div>
        <FacebookLogin
            appId="1118444891540927"
            callback={this.responseFacebook}
            cssClass="login-btn fb-btn" />
        <GoogleLogin
          clientId={'828296505469-3bv5don9idgpofga71j3s0c80annvdh9.apps.googleusercontent.com'}
          callback={this.responseGoogle}
          offline={false}
          cssClass="login-btn google-btn" />
      </div>
    );
  }
}