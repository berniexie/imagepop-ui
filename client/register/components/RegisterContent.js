//container for all of the components of the register page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/register.css';
import request from 'superagent-bluebird-promise';

export default class RegisterContent extends Component {

  handleClick = () => {
    var promise = request
        .post('/api/register')
        .field('email', this.refs.email.getInputDOMNode().value)
        .field('password', this.refs.password.getInputDOMNode().value)
        .set('Accept', 'application/json')
        .promise()
        .then(function(res) {
          console.log(res);
          let resJson = JSON.parse(res.text);
          let success = resJson.success;
          console.log(success);
        });
  }

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
            placeholder="Enter email"
            ref="email"/>
          <div className="clear"/>
          <p>Password:</p>
          <Input
            type="text"
            placeholder="Enter password"
            ref="password"/>
          <div className="clear"/>
          <p>Verify Password:</p>
          <Input
            type="text"
            placeholder="Re-enter password"/>
          <div className="clear"/>
          <Button bsStyle="primary" className="registerBtn" onClick={this.handleClick}>REGISTER</Button>
        </div>
      </PageTemplate>
    );
  }
}