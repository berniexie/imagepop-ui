import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../../../public/css/main.css';
import Slider from 'react-slider';
import PageTemplate from '../../shared/components/pageTemplate.js';

export default class ImageControlArea extends Component {
  constructor(props) {
    super(props);
  }

  handleSlider = (value) => {
    console.log(value);
  };

  render = () => {
    const {file} = this.props;
    return (
      <div className='imageControlArea'>
        <h2>{file.name}</h2>
        <img className='fullImageView' src={file.preview} />
        <div className='sliderWrapper'>
          <Slider defaultValue={6} min={1} max={10} step={1} withBars 
              onChange={this.handleSlider.bind(this)}>
            <div className='handle'/>
          </Slider>
        </div>
      </div>
    );
  };
}

export default class SelectedImageArea extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    file: PropTypes.object,
  };

  defaultProps = {
    file: null,
  };

  render = () => {
    const {file} = this.props;
    return (
      <div className='selectedImageArea centered'>
        {file == null ?
          <div>Upload images to view more options!</div> :
          (<ImageControlArea file={file} />)
        }
      </div>
    );
  };
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
  };

  render = () => {
    const {file} = this.props;
    return (
      <div className='fileListElement'
           onClick={this.onListElementClick.bind(this, file)}>
        <div className='fileListElementWrapper'>
          <div className='listElementIconWrapper'>
            <img className='listElementIcon' src={file.preview} />
          </div>
          <div className='listElementInfo'>
            <div className='listElementName'>{file.name}</div>
            <div className='listElementFilesize'>{Math.floor(file.size / 1024)} KB</div>
          </div>
          <div className='listElementOptions'></div>
        </div>
      </div>
    );
  };
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
  };
};

export default class File {
  constructor(file, fileId) {
    this.raw_file = file;
    this.name = file.name;
    this.preview = file.preview;
    this.size = file.size;
    this.fileId = fileId;
    this.status = 'UPLOADING';
    this.uploadedUrl = null;
  }
}

export default class MainPageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {files: [], selectedFile: null}
  }

  fileId = 0;

  onDrop = (raw_files) => {
    var files = [];
    raw_files.forEach(function(raw_file) {
      let file = new File(raw_file, this.fileId++);
      files.push(file);
    }, this);

    this.setState(function(prevState, currProps) {
      return {files: prevState.files.concat(files)};
    });
  };

  onListElementClick = (file) => {
    this.setState(function(prevState, currProps) {
      return {selectedFile: file};
    });
  };

  onOpenClick = () => {
    this.refs.dropzone.open();
  };

  render = () => {
    console.log(this.state.files);
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
        <SelectedImageArea file={this.state.selectedFile}/>
      </Dropzone>
    );
  };
};


ReactDOM.render(
  <PageTemplate title="Main" subtitle="Upload an image for popping.">
    <MainPageContent/>
  </PageTemplate>,
  document.getElementById('app'),
);
