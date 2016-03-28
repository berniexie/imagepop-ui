//component for landing page

import React, { PropTypes, Component } from 'react';
import CustomNavbar from '../../shared/components/CustomNavbar.js';
import styles from '../../../public/css/landing.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

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
                <Link to="/demo"><Button bsStyle="primary">VIEW OUR GALLERY</Button></Link>
                <Link to="/main"><Button>UPLOAD NOW</Button></Link>
            </div>
        </div>
      </div>
    );
  }
}