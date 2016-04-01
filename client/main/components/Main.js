import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../../../public/css/main.css';
import PageTemplate from '../../shared/components/PageTemplate.js';
import { Modal, Grid, Row, Col, Button } from 'react-bootstrap';
import request from 'superagent-bluebird-promise';
import Config from 'Config';
import Slick from 'react-slick';
import Slider from 'react-slider';

export class ImageControlArea extends Component {
  constructor(props) {
    super(props);
  }

  handleSlider = (value) => {
    console.log(value);
  };

  handleDownload = () => {

  };

  static propTypes = {
    file: PropTypes.object
  };

  render = () => {
    const {file} = this.props;
    return file == undefined ? (
      <div className='imageControlArea'>
      </div>
    ) : (
      <div className='imageControlArea'>
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
    this.state = {
      selected: false,
    };
  }

  static propTypes = {
    file: PropTypes.object,
    selected: PropTypes.bool,
    uploaded: PropTypes.bool,
    progress: PropTypes.number,
  };


  onListElementClick = (file) => {
    if (this.props.uploaded) {
      this.props.onListElementClick(file);
      this.setState({
        selected: true
      });
    }
  };

  render = () => {
    const {file, selected} = this.props;
    var className = 'fileListElement';
    if (selected) {
      className += ' selected';
    }
    if (!this.props.uploaded) {
      className += ' uploading';
    }
    return (
      <Row>
        <Col sm={12}>
          <div className={className}
               onClick={this.onListElementClick.bind(this, file)}>
            {!this.props.uploaded ?
            <div className='uploadingOverlay' style={{opacity: 0.5 * (1 - this.props.progress)}}>
            </div> : null }
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
    files: React.PropTypes.array,
    onOpenClick: React.PropTypes.func,
    onListElementClick: React.PropTypes.func
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
                    onListElementClick={onListElementClick}
                    uploaded={file.progress == 1}
                    progress={file.progress} />)
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
    this.progress = 0;
  }
};

export class FileSliderElement extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    file: React.PropTypes.object
  }

  render = () => {
    return (
        <div {...this.props}>
          <img src={this.props.file.preview}/>
        </div>
      );
  }

};

export class ImageSliderArea extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    files: React.PropTypes.array,
    onSliderCenterChange: React.PropTypes.func,
  }

  onSliderCenterChange = (i) => {
   this.props.onSliderCenterChange(this.props.files[i]);
  }

  render = () => {
    var settings = {
      infinite: false,
      variableWidth: true,
      className: 'imageSlider',
      slidesToShow: 1,
      draggable: false,
      centerMode: true,
      afterChange: this.onSliderCenterChange,
    };
    return this.props.files.length > 0 ? (
      <Slick {...settings}>
        {
          this.props.files.map(
            (f) =>
              (<FileSliderElement file={f} key={f.fileId}/>)
          )
        }
      </Slick>
      ) : (<div></div>);
  }
};

export class MainPageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {files: [], selectedFile: null, uploadProgress: [], totalProgress: [0, 0]}
  }

  onDrop = (raw_files) => {
    var self = this;
    raw_files.forEach(function(raw_file) {
      var promise = request
        .post(Config.apiHost + '/com/imagepop/fileupload/start')
        .set('Accept', 'application/json')
        .promise()
        .then(function(res) {
          let resJson = JSON.parse(res.text);
          let file = new File(raw_file, resJson.fileId);

          var promise = request
            .post(Config.apiHost + '/com/imagepop/fileupload/upload')
            .set('Accept', 'application/json')
            .field('fileId', file.fileId)
            .attach('image', raw_file)
            .on('progress', function (p) {
                console.log(p);
                if (p.target instanceof XMLHttpRequestUpload) {
                  var uploadProgress = self.state.uploadProgress.slice();
                  var totalProgress = self.state.totalProgress.slice();
                  if (!self.state.uploadProgress[file.fileId]) {
                    var uploadProgress = self.state.uploadProgress.slice();
                    var totalProgress = self.state.totalProgress.slice();
                    uploadProgress[file.fileId] = [p.loaded, p.total];
                    totalProgress[0] += p.loaded;
                    totalProgress[1] += p.total;
                  } else {
                    totalProgress[0] = totalProgress[0] - uploadProgress[file.fileId][0] + p.loaded;
                    uploadProgress[file.fileId][0] = p.loaded;
                  }
                  self.setState({
                    uploadProgress: uploadProgress,
                    totalProgress: totalProgress,
                  });
                }
            })
            .promise()
            .then(function(res) {
                var files = self.state.files.slice();
                var filesLen = files.length;
                files.push(file);
                self.setState({files: files});
                if (filesLen == 0) {
                  self.onSliderCenterChange(0);
                }
            });
        });
    }, this);
  };

  onSliderCenterChange = (file) => {
    this.setState({selectedFile: file});
  }

  onListElementClick = (file) => {
    this.setState(function(prevState, currProps) {
      return {selectedFile: file};
    });
  };

  onOpenClick = () => {
    this.refs.dropzone.open();
  };

  render = () => {
    var progress = this.state.totalProgress[0] / this.state.totalProgress[1] * 100;
    return (
      <Dropzone className='container-fluid' activeClassName='dropzoneArea dropzoneAreaActive'
                ref='dropzone' onDrop={this.onDrop} disableClick={true}
                accept={"image/gif,image/jpeg,image/png"}>
        <div className='dropzoneOverlay'>
          <h1 className='dropzoneOverlayText'>
            Drop File to Upload!
          </h1>
        </div>
        <Row>
          <Col sm={12}>
            <Button className='uploadButton' onClick={this.onOpenClick}>
              Upload
            </Button>
            <br/>
            {isNaN(progress) || progress == 100 ? <div style={{height: '32px'}}></div> :
              (<div className='progressContainer'>
                <div className='progressBar' style={{width: progress + '%'}}>
                  <strong>{Math.round(progress)}%</strong>
                </div>
              </div>)}
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <ImageSliderArea files={this.state.files} onSliderCenterChange={this.onSliderCenterChange}/>
          </Col>
        </Row>
        {this.state.selectedFile != null ?
        (<Row>
          <Col sm={12}>
            <ImageControlArea file={this.state.selectedFile}/>
          </Col>
        </Row>) : null}
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
