import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../css/main-page/mainPage.css';

export default class ImageViewArea extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    file: PropTypes.object,
  }

  defaultProps = {
    file: null,
  };

  render = () => {
    const {file} = this.props;
    return (
      <div className='imageViewArea'>
        {file == null ?
          <div>Upload images to view more options!</div> :
          <img className='fullImageView' src={file.preview} />
        }
      </div>
    );
  }
};

export default class FileListElement extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: false};
  }

  static propTypes = {
    file: PropTypes.object,
  };

  onListElementClick = (file) => {
    this.props.onListElementClick(file);
    this.setState({
      selected: true
    });
  }

  render = () => {
    const {file} = this.props;
    return (
      <div className='fileListElement' onClick={this.onListElementClick.bind(this, file)}>

          <div className='listElementIconWrapper'>
            <img className='listElementIcon' src={file.preview} />
          </div>
          <div className='listElementName'>{file.name}</div>
      </div>
    );
  }
};

export default class ImageListArea extends Component {
  constructor(props) {
    super(props);
    this.state = {fileId: 0}
  }

  render = () => {
    const {files, onOpenClick, onListElementClick} = this.props;

    return (
      <div className='imageListArea'>
        <div className='centered imageListAreaHeader'>
          <h1 className='centered'>My Images</h1>
          Drag and drop images anywhere to upload or <br />
          <button type='button' onClick={onOpenClick}>
            Click Here!
          </button>
        </div>
        <div className='imageList'>
          {files.map((file) =>
              <FileListElement file={file} key={file.fileId}
                               onListElementClick={onListElementClick} />)
          }
        </div>
      </div>
    );
  }
};

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {files: [], selectedFile: null}
  }

  fileId = 0;

  onDrop = (files) => {
    files.forEach(function(file) {
      file.fileId = this.fileId++;
    }, this);

    this.setState(function(prevState, currProps) {
      return {files: prevState.files.concat(files)};
    });
  }

  onListElementClick = (file) => {
    this.setState(function(prevState, currProps) {
      return {selectedFile: file};
    });
  }

  onOpenClick = () => {
    this.refs.dropzone.open();
  }

  render = () => {
    return (
      <Dropzone className='dropzoneArea' activeClassName='dropzoneArea dropzoneAreaActive'
                ref='dropzone' onDrop={this.onDrop} disableClick={true}
                accept={"image/gif,image/jpeg,image/png"}>
        <div className='dropzoneOverlay'>
          <h1 className='dropzoneOverlayText'>
            Drop File to Upload!
          </h1>
        </div>
        <ImageListArea files={this.state.files} onOpenClick={this.onOpenClick}
                       onListElementClick={this.onListElementClick} />
        <ImageViewArea file={this.state.selectedFile}/>
      </Dropzone>
    );
  }
};


ReactDOM.render(
  <MainPage />,
  document.getElementById('app')
);
