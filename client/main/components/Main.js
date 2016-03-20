import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../../../public/css/main.css';
import Slider from 'react-slider';
import PageTemplate from '../../shared/components/PageTemplate.js';
import { Modal, Grid, Row, Col, Button } from 'react-bootstrap';
import request from 'superagent-bluebird-promise';

export class ImageControlArea extends Component {
  handleSlider = (value) => {
    console.log(value);
  };

  handleDownload = () => {

  }

  render = () => {
    const {file} = this.props;
    return file == undefined ? (
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
        <Button onClick={this.handleDownload}>Download</Button>
      </div>
    );
  };
}

export class SelectedImageArea extends Component {
  static propTypes = {
    file: PropTypes.object,
  };

  render = () => {
    const {file} = this.props;
    return (
      <div className='selectedImageArea'>
        <div className='centered selectedImageAreaHeader'>
        {file == undefined ?
          <h3>Upload images to view more options!</h3> :
          <h3>{file.name}</h3>
        }
        </div>
        <ImageControlArea file={file}/>
      </div>
    );
  };
};

export class FileListElement extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: false};
  }

  static propTypes = {
    file: PropTypes.object,
    selected: PropTypes.bool,
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
      <Row>
        <Col sm={12}>
          <div className={className}
               onClick={this.onListElementClick.bind(this, file)}>
            <img className='listElementIcon' src={file.preview} />
            <div className='listElementInfo'>
              <div className='listElementName'>{file.name}</div>
            </div>
            <div className='listElementOptions'></div>
          </div>
        </Col>
      </Row>
    );
  };
};

export class ImageListArea extends Component {
  constructor(props) {
    super(props);
    this.state = {fileId: 0}
  }

  static propTypes = {
    fileId: PropTypes.number,
  };

  render = () => {
    const {files, onOpenClick, onListElementClick} = this.props;

    return (
      <div className='imageListArea'>
        <div className='centered imageListAreaHeader'>
          <h1 className='centered'>My Images</h1>
          Drag and drop images anywhere to upload or <br />
          <Button onClick={onOpenClick}>
            Click Here!
          </Button>
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

export class File {
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

export class MainPageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {files: [], selectedFile: null}
  }

  onDrop = (raw_files) => {
    var self = this;
    var files = [];
    console.log(raw_files);
    raw_files.forEach(function(raw_file) {
      var promise = request
        .post('/api/fileupload/start')
        .set('Accept', 'application/json')
        .promise()
        .then(function(res) {
          let resJson = JSON.parse(res.text);
          let file = new File(raw_file, resJson.fileId);
          files.push(file);

          self.setState(function(prevState, currProps) {
            return {files: prevState.files.concat(files)};
          });

          var promise = request
            .post('/api/fileupload/upload')
            .set('Accept', 'application/json')
            .field('fileId', file.fileId)
            .attach('image', raw_file)
            .on('progress', function (p) {
              // TODO(amohan95): Get progress update from backend
            })
            .promise()
            .then(function(res) {
              // TODO(amohan95): Fill this in once API is finalized
            });
        });
    }, this);
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
        <Row>
          <div className='dropzoneOverlay'>
            <h1 className='dropzoneOverlayText'>
              Drop File to Upload!
            </h1>
          </div>
          <Col sm-={4}>
            <ImageListArea selectedFile={this.state.selectedFile} files={this.state.files}
                onOpenClick={this.onOpenClick} onListElementClick={this.onListElementClick} />
          </Col>
          <Col sm={8}>
            <SelectedImageArea file={this.state.selectedFile}/>
          </Col>
        </Row>
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
