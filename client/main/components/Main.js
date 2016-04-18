import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import styles from '../../../public/css/main.css';
import Slider from 'react-slider';
import PageTemplate from '../../shared/components/PageTemplate.js';
import {ButtonGroup, Modal, Grid, Row, Col, Button } from 'react-bootstrap';
import request from 'superagent-bluebird-promise';
import Config from 'Config';
import SplitPane from 'react-split-pane';
import DrawableCanvas from 'react-drawable-canvas';
import {Auth, AUTH_HEADER} from '../../login/auth';
import {browserHistory} from 'react-router';

export class File {
  constructor(imageId, name, status, preview, original, popped, enhancement,
      size) {
    this.imageId = imageId;
    this.name = name;
    this.status = status;
    this.preview = preview;
    this.original = original;
    this.popped = popped;
    this.enhancement = enhancement;
    this.size = size;
  }
};

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
               src={'data:image/png;base64,'+file.preview}/>
          {file.name}
        </td>
        <td className='imageTableRowSize'>{size}</td>
      </tr>
    );
  };
};

export class EditorCanvas extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    file: PropTypes.object,
  };

  componentDidMount = () => {
    let drawableCanvas = document.getElementById('drawableCanvas');
    drawableCanvas.style.width = '100%';
    drawableCanvas.style.height = '100%';
    drawableCanvas.width = drawableCanvas.offsetWidth;
    drawableCanvas.height = drawableCanvas.offsetHeight;
    let drawableContext = drawableCanvas.getContext('2d');

    let imageCanvas = document.getElementById('imageCanvas');
    imageCanvas.style.width = '100%';
    imageCanvas.style.height = '100%';
    imageCanvas.width = imageCanvas.offsetWidth;
    imageCanvas.height = imageCanvas.offsetHeight;
    let imageContext = imageCanvas.getContext('2d');

    let originalImg = new Image();
    originalImg.src = this.props.file.original;

    imageContext.drawImage(originalImg, 0, 0);

    this.setState({
      drawableCanvas: drawableCanvas,
      drawableContext: drawableContext,
      imageCanvas: imageCanvas,
      imageContext: imageContext,
      originalImg: originalImg
    });
  };

  render = () => {
    const { file } = this.props;
    return (
      <div className={'editorCanvas'}>
        <canvas id={'drawableCanvas'}></canvas>
        <canvas id={'imageCanvas'}></canvas>
      </div>
    );
  };
};

export class ImageCanvas extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    id: PropTypes.string
  };

  draw = () => {
    let domNode = ReactDOM.findDOMNode(this);
    domNode.width = domNode.parentNode.offsetWidth;
    domNode.height = domNode.parentNode.offsetHeight;
    let ctx = domNode.getContext('2d');

    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;

    ctx.drawImage(this.props.image, 0, 0, domNode.width, domNode.height);
  };

  componentDidUpdate = () => {
    this.draw();
  };

  componentDidMount = () => {
    this.draw();
  };

  render = () => {
    return (
        <canvas id={this.props.id} />
        );
  };

};

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brushColor: 'rgba(128, 128, 128, 1)',
      lineWidth: 4,
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'none',
      },
      clear: false,
      poppedSlider: 1,
      showOriginal: false,
      showEnhancement: false,
    };
  }

  static propTypes = {
    file: PropTypes.object,
  };

  getCurrentImage = () => {
    if (this.state.showOriginal) {
      return this.state.currentImages.original;
    } else if (this.state.showEnhancement) {
      return this.state.currentImages.enhancement;
    } else {
      return this.state.currentImages.popped[this.state.poppedSlider];
    }
  };

  handleSlider = (value) => {
    this.setState({poppedSlider: value - 1});
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

  showOriginal = () => {
    this.setState({showOriginal: true});
  };

  showPopped = () => {
    this.setState({showOriginal: false});
  };

  showEnhancement = () => {
    this.setState({showEnhancement: !this.state.showEnhancement});
  };

  handleKeydown = (e) => {
    if (e.keyCode == 17) { // CTRL
      this.setState({showEnhancement: true});
    }
  };

  handleKeyup = (e) => {
    if (e.keyCode == 17) {
      this.setState({showEnhancement: false});
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.state.lastImageId != nextProps.file.imageId) {
      let currentImages = {
        original: new Image(),
        popped: [new Image(), new Image(), new Image()],
        enhancement: new Image(),
      };
      currentImages.original.src = 'data:image/png;base64,' + nextProps.file.original;
      currentImages.popped[0].src = 'data:image/png;base64,' + nextProps.file.popped[0];
      currentImages.popped[1].src = 'data:image/png;base64,' + nextProps.file.popped[1];
      currentImages.popped[2].src = 'data:image/png;base64,' + nextProps.file.popped[2];
      currentImages.enhancement.src = 'data:image/png;base64,' + nextProps.file.enhancement;
      this.setState({lastImageId: nextProps.file.imageId, currentImages: currentImages});
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return true;
    //return nextState.lastImageId == nextProps.file.imageId;
  };

  componentDidMount = () => {
    window.document.addEventListener('keydown', this.handleKeydown);
    window.document.addEventListener('keyup', this.handleKeyup);
  };

  componentWillUnmount = () => {
    window.document.removeEventListener('keydown', this.handleKeydown);
    window.document.removeEventListener('keyup', this.handleKeyup);
  };

  render = () => {
    const {file} = this.props;
    if (file == undefined) {
      return (<div className='editor'>Select an image</div>);
    } else if (file.status == 'UPLOADING') {
      return (<div className='editor'>File is uploading...</div>);
    } else {
      let currentImage = this.getCurrentImage();
      let origBtnClass = !this.state.showOriginal ? 'toggleBtn' :
        'toggleBtnClicked';
      let popBtnClass = this.state.showOriginal ? 'toggleBtn' :
        'toggleBtnClicked';
      let enhBtnClass = !this.state.showEnhancement ? 'toggleBtn' :
        'toggleBtnClicked';
      return (
        <div className='editor'>
        <div className='editorContainer'>
            <div className='editorImageContainer'>
              <ImageCanvas id='editorImage' image={currentImage}/>
            </div>
            <div className='canvasContainer'>
              <DrawableCanvas {...this.state}/>
            </div>
          </div>
          <div className='toolbox'>
            <Button onClick={this.handleOnClickTouchUp}
              disabled={this.state.showOriginal}>Touch Up</Button>
            <br/>
            <Button onClick={this.handleOnClickReset}
              disabled={this.state.showOriginal}>Reset</Button>
            <div className='sliderWrapper'>
              <Slider defaultValue={2} min={1} max={3} step={1} withBars
                onChange={this.handleSlider} disabled={this.state.showOriginal}>
                <div className='handle'/>
              </Slider>
              <div className='label labelLeft'>low</div>
              <div className='label'>med</div>
              <div className='label labelRight'>high</div>
            </div>
            <ButtonGroup>
              <Button className={origBtnClass} onClick={this.showOriginal}>Original</Button>
              <Button className={popBtnClass} onClick={this.showPopped}>Popped</Button>
            </ButtonGroup>
            <Button className={enhBtnClass} onClick={this.showEnhancement}
              disabled={this.state.showOriginal}>
              Show Enhancement
            </Button>
          </div>
        </div>
      );
    }
  };
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
            uploaded={file.status == 'UPLOADED' || file.status == 'POPPED'}
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
            files.push(new File(f.imageId, f.name, f.status, f.preview,
                  f.original, f.popped, f.enhancement, f.size));
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
          let file = new File(resJson.imageId, rawFile.name, 'UPLOADING', rawFile.preview,
                    rawFile.preview, null, null, rawFile.size);
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
                  newFiles[i] = new File(f.imageId, f.name, f.status, f.preview,
                    f.original, f.popped, f.enhancement, f.size);
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
        <div style={{width: '30%', 'float': 'left'}}>
          <h3><Button onClick={this.onOpenClick}>Upload</Button></h3>
          <ImagesTable selectedFile={this.state.selectedFile} files={this.state.files}
            onOpenClick={this.onOpenClick} onListElementClick={this.onListElementClick} />
        </div>
        <div style={{width: '70%', 'float': 'left'}}>
          <Editor file={this.state.selectedFile}/>
        </div>
        <div style={{clear: 'both'}}></div>
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
