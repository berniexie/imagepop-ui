import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../css/mainPage.css';

export default class ImageViewArea extends Component {
  constructor(props) {
    super(props);
    this.state = {imageUrl: props.imageUrl};
  }

  static propTypes = {
    imageUrl: PropTypes.string,
  }

  defaultProps = {
    imageUrl: null,
  };
};

export default class FileListElement extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    file: PropTypes.object,
  };

  render = () => {
    const {file} = this.props;
    return (
      <div className='fileListElement'>
        <div className='listElementIconWrapper'>
          <img className='listElementIcon' src={file.preview} />
        </div>
        <div className='listElementName'>{file.name}</div>
      </div>
    );
  }
};

export default class DropzoneListArea extends Component {
  constructor(props) {
    super(props);
    this.state = {files: []};
  }

  render = () => {
    return (
      <div id='dropzoneListArea'>
        <div className='centered'>
          <h1 className='centered'>My Images</h1>
          <div>
            Drag and drop images anywhere to upload or
            <button type='button' onClick={this.props.onOpenClick}>
              Click Here!
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default class MainPageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {files: []}
  }

  onDrop = (files) => {
    this.setState({
      files: files
    });
    console.log(files);
  };

  onOpenClick = () => {
    this.refs.dropzone.open();
  }

  render = () => {
    return (
      <Dropzone className='dropzoneArea' ref='dropzone' onDrop={this.onDrop}
                disableClick={true} accept={"image/gif,image/jpeg,image/png"}>
        <DropzoneListArea files={this.state.files} onOpenClick={this.onOpenClick}/>
      </Dropzone>
    );
  }
};


ReactDOM.render(
  <MainPageArea />,
  document.getElementById('app')
);
