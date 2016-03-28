//component for landing page

import React, { PropTypes, Component } from 'react';
import CustomNavbar from '../../shared/components/CustomNavbar.js';
import styles from '../../../public/css/landing.css';
import { Button } from 'react-bootstrap';
import {Link} from 'react-router';

export default class Landing extends Component {
  static propTypes = {
    user: PropTypes.string
  };

  render () {
    return (
      <div className="index">
        <CustomNavbar />
        <div className="landing">
            <div className="content">
                <h1>image | pop</h1>
                <p> Make your photos standout with ImagePop. <br/>
                  A photo enhancer that will make your images pop! 
                </p>
                <div>
                  <Button href="/demo" bsStyle="primary">VIEW OUR GALLERY</Button>
                  <Button href="/main">UPLOAD NOW</Button>
                </div>
            </div>
        </div>
      </div>
    );
  }
}