import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: '/api/upload_image'
};

var djsConfig = {
  addRmoveLinks: false,
  uploadMultiple: false,
  params: {

  }
}

export default class Slider extends Component {
  static propTypes = {};
  static defaultProps = {};
};

export default class ImageUploadArea extends Component {
  static propTypes = {

  };
  static defaultProps = {};

  getUploadStateText = function(uploadState) {
    switch (uploadState) {
      case 'INITIAL': {
        return 'Upload an image to pop!';
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

  state = {
    uploadState : 'INITIAL',
    styleMap : {
      centered: {
        margin: '0 auto',
        textAlign: 'center'
      },
      uploadState: {
        fontSize: '24px'
      }
    }
  };

  render() {
    var styles = this.state.styleMap;
    return (
      <div>
        <div style={Object.assign({},
            styles.centered, styles.uploadState)}>{this.getUploadStateText(this.state.uploadState)}</div>
        <DropzoneComponent config={componentConfig} djsConfig={djsConfig} />
        <div style={styles.centered}><button>Click to Pop!</button></div>
      </div>
    );
  }
}

ReactDOM.render(
  <ImageUploadArea />,
  document.getElementById('app')
);
