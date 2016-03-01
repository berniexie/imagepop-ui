
import React, { PropTypes, Component } from 'react';
import Navbar from '../../shared/components/Navbar.js';
import styles from '../../../public/css/pageTemplate.css';

// Container for the components of a page with title, subtitle, and content.
export default class PageTemplate extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: React.PropTypes.element,
  };

  static defaultProps = {
    title: '',
    subtitle: '',
  };

  render(){
    const {title, subtitle, children} = this.props;
    return(
      <div>
        <Navbar/>
        <div className='pageContent'>
          <h1>{title}</h1>
          <p className='subtitle'>{subtitle}</p>
          {children}
        </div>
      </div>
    );
  }
}
