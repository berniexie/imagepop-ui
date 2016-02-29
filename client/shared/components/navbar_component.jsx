import React, { PropTypes, Component } from 'react';
import styles from '../../../public/css/navbar.css';

export default class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <ul>
          <li><a href="/login">login</a></li>
          <li><a href="/main">upload</a></li>
          <li><a href="/demo">gallery</a></li>
          <li><a href="/about">about</a></li>
          <li className="logo"><a href="/">image | pop</a></li>
        </ul>
      </div>
    );
  }
}

module.exports = Navbar;
