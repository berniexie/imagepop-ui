//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/logout.css';
import request from 'superagent-bluebird-promise';
import Config from 'Config';
import {Auth, AUTH_HEADER} from '../../login/auth';

export default class LogoutContent extends Component {

  state = {failedAttempt: false};

  componentDidMount = () =>{
    const token = Auth.getToken();
    Auth.setToken(null);
    var promise = request
      .post(Config.apiHost + '/api/users/logout')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set(AUTH_HEADER, token)
      .promise()
      .then((res) =>{
        console.log(res);
        PubSub.publish('LOGIN', false);
        this.setState({failedAttempt: false});
      })
      .catch((error) =>{
        console.log(error);
        this.setState({failedAttempt: true});
      });
  }

  render(){
    return(
      <PageTemplate title="Logout" subtitle={this.state.failedAttempt ? "Logout failed." : "You have been successfully logged out."}>
        <Button href="/login" className="loginBtn" bsStyle="primary">LOGIN</Button>
      </PageTemplate>
    );
  }
}