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
    return file == null ? (
      <div className='imageControlArea'>
      </div>
    ) : (
      <div className='imageControlArea'>
          <img className='fullImageView' src={file.preview} />
          <div className='sliderWrapper'>
            <Slider defaultValue={2} min={1} max={3} step={1} withBars
                onChange={this.handleSlider}>
              <div className='handle'/>
            </Slider>
            <div className='label labelLeft'>low</div>
            <div className='label'>med</div>
            <div className='label labelRight'>high</div>
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
      <div className='selectedImageArea'>
        <div className='centered selectedImageAreaHeader'>
        {file == null ?
          <h3>Upload images to view more options!</h3> :
          <h3>{file.name}</h3>
        }
        </div>
        <ImageControlArea file={file}/>
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
    const {file, selected} = this.props;
    var className = 'fileListElement';
    if (selected) {
      className += ' selected';
    }
    return (
      <div className='row'>
        <div className='col-sm-12'>
          <div className={className}
               onClick={this.onListElementClick.bind(this, file)}>
            <img className='listElementIcon' src={file.preview} />
            <div className='listElementInfo'>
              <div className='listElementName'>{file.name}</div>
            </div>
            <div className='listElementOptions'></div>
          </div>
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
                  selected={this.props.selectedFile != null &&
                    this.props.selectedFile.fileId == file.fileId}
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
    return (
      <Dropzone className='container-fluid' activeClassName='dropzoneArea dropzoneAreaActive'
                ref='dropzone' onDrop={this.onDrop} disableClick={true}
                accept={"image/gif,image/jpeg,image/png"}>
        <div className='row'>
          <div className='dropzoneOverlay'>
            <h1 className='dropzoneOverlayText'>
              Drop File to Upload!
            </h1>
          </div>
          <div className='col-sm-4'>
            <ImageListArea selectedFile={this.state.selectedFile} files={this.state.files}
                onOpenClick={this.onOpenClick} onListElementClick={this.onListElementClick} />
          </div>
          <div className='col-sm-8'>
            <SelectedImageArea file={this.state.selectedFile}/>
          </div>
        </div>
      </Dropzone>
    );
  };
};

export default class Main extends Component {
  render = () => {
    return (
      <PageTemplate title="Main" subtitle="Upload an image for popping.">
        <MainPageContent/>
      </PageTemplate>
    );
  };
}
