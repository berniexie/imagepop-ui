//container for all of the components of the register page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/register.css';

export default class LoginContent extends Component {

  render(){
    return(
      <PageTemplate title="Register" subtitle="Register for an account.">
        <div className="registerWrapper">
          <p>Name:</p>
          <Input
            type="text"
            placeholder="Enter name"/>
          <div className="clear"/>
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
          <p>Verify Password:</p>
          <Input
            type="text"
            placeholder="Re-enter password"/>
          <div className="clear"/>
          <Button bsStyle="primary" className="registerBtn">REGISTER</Button>
        </div>
      </PageTemplate>
    );
  }
}