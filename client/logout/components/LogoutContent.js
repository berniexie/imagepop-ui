//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/logout.css';
import request from 'superagent-bluebird-promise';

export default class LogoutContent extends Component {

  state = {failedAttempt: false};

  componentDidMount = () =>{
    var promise = request
      .post('/api/logout')
      .set('Accept', 'application/json')
      .promise()
      .then((res) =>{
        let resJson = JSON.parse(res.text);
        PubSub.publish('LOGIN', false);
        this.setState({failedAttempt: false});
      })
      .catch((error) =>{
        let resJson = JSON.parse(error.res.text);
        console.log(resJson.message);
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