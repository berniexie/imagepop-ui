//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import { Input, Button } from 'react-bootstrap';
import PageTemplate from '../../shared/components/PageTemplate.js';
import styles from '../../../public/css/logout.css';

export default class LogoutContent extends Component {

  render(){
    return(
      <PageTemplate title="About" subtitle="Image | pop is a web application that allows 
          users to enhance the overall feel of their images.">
      </PageTemplate>
    );
  }
}