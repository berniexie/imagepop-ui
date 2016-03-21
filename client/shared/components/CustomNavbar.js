//Reusable component for navbar on all pages

import React, { PropTypes, Component } from 'react';
import { Navbar, Nav, NavItem, Modal, Button, Input } 
  from 'react-bootstrap';
import styles from '../../../public/css/navbar.css';

export default class CustomNavbar extends Component {

  state = {showModal:false};
  close = () =>  {
    this.setState({ showModal: false });
  };

  handleClick = () => {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">image | pop</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={1} href="/about">about</NavItem>
              <NavItem eventKey={2} href="/demo">gallery</NavItem>
              <NavItem eventKey={3} href="/main">upload</NavItem>
              <NavItem eventKey={4} onClick={this.handleClick}>login</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Body>
            <Input
              type="text"
              value={this.state.value}
              placeholder="Enter email"
              label="Email" />
            <Input
              type="text"
              value={this.state.value}
              placeholder="Enter password"
              label="Password" />
            <Button>Login</Button>
            <Button>Register</Button>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}