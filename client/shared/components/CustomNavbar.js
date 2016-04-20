//Reusable component for navbar on all pages

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import styles from '../../../public/css/navbar.css';
import {Auth} from '../../login/auth.js';

export default class CustomNavbar extends Component {
  render() {
    var logIn = (Auth.getToken() != null);
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">image | pop</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <li><Link to="/about">about</Link></li>
            <li><Link to="/demo">gallery</Link></li>
            <li><Link to="/main">editor</Link></li>
            { !logIn ? <li><Link to="/login">login</Link></li> : 
                <li><Link to="/logout">logout</Link></li> }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}