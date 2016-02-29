/**
 * Created by BernardXie on 2/20/16.
 */

import React, { PropTypes, Component } from 'react';

export default class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <ul>
          <li>
            <a href="/login">login</a>
          </li>
          <li>
            <a href="/upload">upload</a>
          </li>
          <li>
            <a href="/demo">gallery</a>
          </li>
          <li>
            <a href="/about">about</a>
          </li>
        </ul>
      </div>
    );
  }
}

module.exports = Navbar;
