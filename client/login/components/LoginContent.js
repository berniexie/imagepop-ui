//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/login.css';

export default class LoginContent extends Component {

  render(){
    return(
      <PageTemplate title="Login" subtitle="Login to your account.">
        <div className="loginWrapper">
          <p>Email:</p>
          <Input
            type="text"
            placeholder="Enter email"/>
          <div className="clear"/>
          <p>Password:</p>
          <Input
            type="text"
            placeholder="Enter password"/>
          <div className="clear"/>
          <Button className="loginBtn" bsStyle="primary">LOGIN</Button>
          <Button href="/register" className="registerBtn">REGISTER</Button>
        </div>
      </PageTemplate>
    );
  }
}