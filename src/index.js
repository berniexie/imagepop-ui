import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class ImageStatus extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  static defaultProps = {
    state: 'INITIAL'
  };

  render() {
    const { state} = this.props;
    return (
      <h1>{state}</h1>
    );
  }
}

export default class ImageUpload extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  static defaultProps = {
    state: 'INITIAL'
  };

  render() {
    return (
      <div></div>
    );
  }
}

export default class ImageControlArea extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  static defaultProps = {
    state: 'INITIAL'
  };

  render() {
    return <div></div>
  }
}


export default class ImageUploadArea extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  static defaultProps = {
    state: 'INITIAL'
  };

  render() {
    return (
      <div>
        <ImageStatus/>
        <ImageUpload/>
        <ImageControlArea/>
      </div>
    );
  }
}


ReactDOM.render(
  <ImageUploadArea/>,
  document.getElementById('app')
);

