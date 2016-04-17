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

export class UploadedFile {
  constructor(original, name, preview, size, imageId) {
    this.original = original;
    this.name = name;
    this.preview = preview;
    this.size = size;
    this.imageId = imageId;
    this.status = 'UPLOADED';
    this.progress = 1;
  }
}

export class UploadingFile {
  constructor(file, imageId) {
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
    let size = file.size / 1024;
    if (size >= 1024) {
      size = (Math.round(size / 1024 * 100) / 100) + ' MB';
    } else {
      size = (Math.round(size * 100) / 100) + ' KB';
    }

    let className = 'imageTableRow' + (this.props.selected ? ' selected' : '');
    
    return (
      <tr onClick={this.onListElementClick.bind(this, file)} className={className}>
        <td className='imageTableRowName'>
          <img className='imageTableRowIcon'
               src={(file instanceof UploadedFile ? 'data:image/jpeg;base64, ' : '') + file.preview}/>
          {file.name}
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
    if (file == undefined) {
      return (<div className='editor'>Select an image</div>);
    } else if (file instanceof UploadingFile) {
      return (<div className='editor'>File is uploading...</div>);
    } else {
      return (
        <div className='editor'>
          <div className='editorContainer'>
            <div className='editorImageContainer'>
              <img src={'data:image/jpeg;base64, ' + file.original}className='editorImage'/>
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

    }
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
            uploaded={file.status == 'UPLOADED'}
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
    if (Auth.getToken() == null) {
      browserHistory.push('/login');
    } else {
      let promise = request
        .post(Config.apiHost + '/com/imagepop/fileupload/get_images')
        .set('Accept', 'application/json')
        .set(AUTH_HEADER, Auth.getToken())
        .promise()
        .then((res) => {
          let files = [];
          let uploadedFiles = JSON.parse(res.text);
          for (let i = 0; i < uploadedFiles.length; ++i) {
            let f = uploadedFiles[i];
            files.push(new UploadedFile(f.original, f.name, f.preview, f.size,
                                        f.imageId));
          }
          this.setState({files: files, selectedFile: files[0]});
        });
    }
  }


  onDrop = (rawFiles) => {
    let files = [];
    rawFiles.forEach((rawFile) => {
      let promise = request
        .post(Config.apiHost + '/com/imagepop/fileupload/start')
        .set('Accept', 'application/json')
        .set(AUTH_HEADER, Auth.getToken())
        .field('name', rawFile.name)
        .promise()
        .then((res) => {
          let resJson = JSON.parse(res.text);
          let file = new UploadingFile(rawFile, resJson.imageId);
          this.setState({files: this.state.files.concat([file])});

          let promise = request
            .post(Config.apiHost + '/com/imagepop/fileupload/upload')
            .set('Accept', 'application/json')
            .set(AUTH_HEADER, Auth.getToken())
            .field('imageId', file.imageId)
            .attach('image', rawFile)
            .on('progress', (p) => {
              file.progress = p.percent / 100.0;
              this.setState(function(prevState, currProps) {
                return {files: prevState.files};
              });
            })
            .promise()
            .then((res) => {
              let f = JSON.parse(res.text);
              let pos = 0;
              for (let i = 0; i < this.state.files.length; ++i) {
                if (this.state.files[i].imageId == f.imageId) {
                  let newFiles = this.state.files.slice()
                  newFiles[i] = new UploadedFile(f.original, f.name, f.preview,
                                                 f.size, f.imageId);
                  this.setState((prevState, currProps) => {
                    return {files: newFiles};
                  });
                  break;
                }
              }
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
