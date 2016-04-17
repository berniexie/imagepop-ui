import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../../../public/css/main.css';
import Slider from 'react-slider';
import PageTemplate from '../../shared/components/PageTemplate.js';
import { Modal, Grid, Row, Col, Button } from 'react-bootstrap';
import request from 'superagent-bluebird-promise';
import Config from 'Config';
import SplitPane from 'react-split-pane';
import DrawableCanvas from 'react-drawable-canvas';
import {Auth, AUTH_HEADER} from '../../login/auth';
import {browserHistory} from 'react-router';

export class ImageControlArea extends Component {
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
               onClick={() => this.onListElementClick(file)}>
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
    this.state = {imageId: 0}
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
              <FileListElement file={file} key={file.imageId}
                  selected={this.props.selectedFile != null &&
                    this.props.selectedFile.imageId == file.imageId}
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
  constructor(file, imageId) {
    this.rawFile = file;
    this.name = file.name;
    this.preview = file.preview;
    this.size = file.size;
    this.imageId = imageId;
    this.status = 'UPLOADING';
    this.uploadedUrl = null;
    this.progress = 0;
  }
}

export class ImageTableRow extends Component {
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
    const { file } = this.props;
    var size = file.size / 1024;
    if (size >= 1024) {
      size = (Math.round(size / 1024 * 100) / 100) + ' MB';
    } else {
      size = (Math.round(size * 100) / 100) + ' KB';
    }
    return (
      <tr onClick={this.onListElementClick.bind(this, file)} className='imageTableRow'>
        <td className='imageTableRowName'>
          <img className='imageTableRowIcon' src={file.preview}/>{file.name}
        </td>
        <td className='imageTableRowSize'>{size}</td>
      </tr>
    );
  };

};

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brushColor: '#800909',
      lineWidth: 4,
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'none',
      },
      clear: false
    };
  }

  static propTypes = {
    file: PropTypes.object,
  };

  handleSlider = (value) => {
    console.log(value);
  };

  handleOnClickReset = () => {
    this.setState({
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'none',
      },
      clear: true
    });
  };

  handleOnClickTouchUp = () => {
    this.setState({
      brushColor: '#CCCCCC',
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'auto',
      },
      clear: false
    });
  };

  render = () => {
    const {file} = this.props;
    return file == undefined ? (<div className='editor'>Select an image</div>) : (
      <div className='editor'>
        <div className='editorContainer'>
          <div className='editorImageContainer'>
            <img src={file.preview} className='editorImage'/>
          </div>
          <div className='canvasContainer'>
            <DrawableCanvas {...this.state}/>
          </div>
        </div>
        <div className='toolbox'>
          <Button onClick={this.handleOnClickTouchUp}>Touch Up</Button>
          <Button onClick={this.handleOnClickReset}>Reset</Button>
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
      </div>
    );
  };
ti
};

export class ImagesTable extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    files: React.PropTypes.array,
    onOpenClick: React.PropTypes.func,
    onListElementClick: React.PropTypes.func
  };

  static defaultProps = {
    files: [],
  };

  render = () => {
    return (
    <div style={{overflowY: 'auto', maxHeight: 'calc(100vh - 50px)'}}>
      <table className='imagesTable'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody className='imagesTableBody'>
        {this.props.files.map((file) =>
          <ImageTableRow file={file} key={file.imageId}
            selected={this.props.selectedFile != null &&
              this.props.selectedFile.imageId == file.imageId}
            onListElementClick={this.props.onListElementClick}
            uploaded={file.progress == 1}
            progress={file.progress} />)
        }
        </tbody>
      </table>
    </div>
      );
  };

};

export class MainPageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {files: [], selectedFile: null}
  }

  componentDidMount = () => {
    if (Auth.getToken() == null)
      browserHistory.push('/login');
  }


  onDrop = (rawFiles) => {
    let files = [];
    rawFiles.forEach((rawFile) => {
      let promise = request
        .post(Config.apiHost + '/com/imagepop/fileupload/start')
        .set('Accept', 'application/json')
        .set(AUTH_HEADER, Auth.getToken())
        .promise()
        .then((res) => {
          console.log(res);
          let resJson = JSON.parse(res.text);
          let file = new File(rawFile, resJson.imageId);
          file.progress = 1;
          this.setState({files: this.state.files.concat([file])});

          let promise = request
            .post(Config.apiHost + '/com/imagepop/fileupload/upload')
            .set('Accept', 'application/json')
            .set(AUTH_HEADER, Auth.getToken())
            .field('imageId', file.imageId)
            .field('fileName', file.name)
            .attach('image', rawFile)
            .on('progress', (p) => {
              file.progress = p.loaded / p.total;
              console.log(p);
              // this.setState(function(prevState, currProps) {
              //   return {files: prevState.files};
              // });
            })
            .promise()
            .then((res) => {
              console.log(res);
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
        <div className='dropzoneOverlay'>
          <h1 className='dropzoneOverlayText'>
            Drop File to Upload!
          </h1>
        </div>
        <SplitPane split='vertical' defaultSize={'30%'}>
          <ImagesTable selectedFile={this.state.selectedFile} files={this.state.files}
            onOpenClick={this.onOpenClick} onListElementClick={this.onListElementClick} />
          <Editor file={this.state.selectedFile}/>
        </SplitPane>
      </Dropzone>
    );
  };
};

export default class Main extends Component {
  render = () => {
    return (
      <PageTemplate>
        <MainPageContent/>
      </PageTemplate>
    );
  };
}
