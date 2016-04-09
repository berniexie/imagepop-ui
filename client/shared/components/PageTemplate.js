
import React, { PropTypes, Component } from 'react';
import CustomNavbar from '../../shared/components/CustomNavbar.js';
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
        <CustomNavbar/>
        <div className='pageContent'>
          {title != '' ? (<h1>{title}</h1>) : null}
          {subtitle != '' ? (<p className='subtitle'>{subtitle}</p>) : null}
          {children}
        </div>
      </div>
    );
  }
}
