import React, { PropTypes, Component } from 'react';
import Navbar from '../../shared/components/navbar_component.jsx';

export default class Landing extends Component {
  static propTypes = {
    user: PropTypes.string
  };

  static defaultProps = {
    user: 'World'
  };

  render() {
    const { user } = this.props;
    return (
      <div className="landing-page">
        <Navbar />
        <h1>Hello {user}</h1>
      </div>
    );
  }
}

ReactDOM.render(
  <Landing />,
  document.getElementById('app')
);
