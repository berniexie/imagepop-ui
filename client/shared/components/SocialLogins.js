//Reusable component for social logins
import React, { PropTypes, Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import styles from '../../../public/css/socialLogins.css';

export default class SocialLogins extends Component{
  responseFacebook = (response) => {
    console.log(response);
  }
  
  responseGoogle = (response) => {
    console.log(response);
  }
  
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
          callback={this.responseGoogle}
          offline={false}
          cssClass="login-btn google-btn" />
      </div>
    );
  }
}