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
    console.log(response);

    if (response.status != "unknown") {
      this.state.email = response.id;
      this.state.password = response.name;
      this.postLogin(response);
    }
  };

  responseGoogle = (response) => {
    console.log("RESPONSE GOOGLE");
    console.log(response);
  };

  postLogin = (response) => {
    var promise = request
        .post(Config.apiHost + '/api/users/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({email: this.state.email, password: this.state.password})
        .then((res) =>{
          console.log("LOGIN SUCCESS");
          console.log(res);
          let resJson = JSON.parse(res.text);
          Auth.setToken(resJson.token);
          this.setState({failedLogin: false});
          browserHistory.push('/main');
        })
        .catch((error) =>{
          console.log("FAILED LOGIN");
          console.log(error);
          Auth.setToken(null);
          this.setState({failedLogin: true});
          console.log("FAILED LOGIN -- REGISTERING");
          this.postRegister(response);
        });
  }

  postRegister = (response) => {
    var promise = request
        .post(Config.apiHost + '/api/users/register')
        .send({email: this.state.email, password: this.state.password,
          firstName: response.name, lastName: response.name})
        .set('Accept', 'application/json')
        .then((res) => {
          console.log(res);
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
            autoLoad={true}
            callback={this.responseFacebook}
            cssClass="login-btn fb-btn" />
        <GoogleLogin
          clientId={'828296505469-3bv5don9idgpofga71j3s0c80annvdh9.apps.googleusercontent.com'}
          callback={responseGoogle}
          offline={false}
          cssClass="login-btn google-btn" />
      </div>
    );
  }
}