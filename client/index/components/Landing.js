//component for landing page

import React, { PropTypes, Component } from 'react';
import Navbar from '../../shared/components/Navbar.js';
import styles from '../../../public/css/index.css';

export default class Landing extends Component {
  static propTypes = {
    user: PropTypes.string
  };

  render () {
    return (
      <div className="index">
        <Navbar />
        <div className="landing">
            <div className="content">
                <h1>image | pop</h1>
                <p> Make your photos standout with ImagePop. <br/>
                  A photo enhancer that will make your images pop! 
                </p>
                <div>
                  <a href="/demo" className="landingButton galleryButton">VIEW OUR GALLERY</a>
                  <a href="/main" className="landingButton uploadButton">UPLOAD NOW</a>
                </div>
            </div>
        </div>
      </div>
    );
  }
}