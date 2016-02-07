import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: '/api/upload_image'
};

var djsConfig = {
  addRmoveLinks: true,
  params: {

  }
}

export default class Slider extends Component {
  static propTypes = {};
  static defaultProps = {};
};

export default class ImageUploadArea extends Component {
  static propTypes = {};
  static defaultProps = {};

  state = {
    uploadState : 'INITIAL'
  };

  getUploadStateText = function(uploadState) {
    switch (uploadState) {
      case 'INITIAL': {
        return 'Upload an image!';
      }
      case 'POPPING': {
        return 'Popping your image now...';
      }
      case 'FINISHED': {
        return 'Done popping!';
      }
      default: {
        return 'Unknown state. Please refresh the page.';
      }
    }
  };

  render() {
    return (
      <div>
        <div>{this.getUploadStateText(this.state.uploadState)}</div>
        <DropzoneComponent config={componentConfig} djsConfig={djsConfig} />
        <button>Click to Pop!</button>
      </div>
    );
  }
}

ReactDOM.render(
  <ImageUploadArea />,
  document.getElementById('app')
);
