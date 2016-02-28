import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class Hello extends Component {
  static propTypes = {
    user: PropTypes.string
  };

  static defaultProps = {
    user: 'World'
  };

  render() {
    const { user } = this.props;
    return (<h1>Hello {user}</h1>);
  }
}


ReactDOM.render(
  <Hello user="World"/>,
  document.getElementById('app')
);
