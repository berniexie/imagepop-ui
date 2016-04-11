//container for all of the components of the register page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/register.css';
import request from 'superagent-bluebird-promise';
import {browserHistory} from 'react-router';
import SocialLogins from '../../shared/components/SocialLogins.js';
import Config from 'Config';

export default class RegisterContent extends Component {
  state = {email: '', password: '', failedText: '', firstName:'', lastName:''};

  handleClick = () => {
    console.log(Config.apiHost + '/api/users/register');
    var promise = request
        .post(Config.apiHost + '/api/users/register')
        .send({email: this.state.email, password: this.state.password,
              firstName: this.state.firstName, lastName: this.state.lastName})
        .set('Accept', 'application/json')
        .promise()
        .then((res) => {
          console.log(res);
          this.setState({failedText: ''});
          browserHistory.push('/main');
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
  }

  setEmail = (e) => {
    this.setState({email:e.target.value});
  }

  setPassword = (p) => {
    this.setState({password:p.target.value});
  }

  setFirstName = (n) => {
    this.setState({firstName:n.target.value});
  }

  setLastName = (n) => {
    this.setState({lastName:n.target.value});
  }

  render(){
    return(
      <PageTemplate title="Register" subtitle="Register for an account.">
        <div className="registerWrapper">
          <Input
            type="text"
            label="First Name:"
            placeholder="Enter first name"
            onChange={this.setFirstName}/>
          <Input
            type="text"
            label="Last Name:"
            placeholder="Enter last name"
            onChange={this.setLastName}/>
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
          <SocialLogins />
        </div>
      </PageTemplate>
    );
  }
}