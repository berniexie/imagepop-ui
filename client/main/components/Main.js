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

// Edited class from
// https://github.com/jonhni/react-drawable-canvas/blob/master/lib/index.jsx
// to allow us to call function when the user stops drawing.
export class NewDrawableCanvas extends Component {
  static propTypes = {
    brushColor: PropTypes.string,
    lineWidth: PropTypes.number,
    canvasStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
      cursor: PropTypes.string
    }),
    clear: PropTypes.bool,
    id: PropTypes.string,
    updateImageEnhancement: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = {
    brushColor: '#000000',
    lineWidth: 4,
    canvasStyle: {
      backgroundColor: '#FFFFFF',
      cursor: 'pointer'
    },
    clear: false
  };

  static initialState = {
    canvas: null,
    context: null,
    drawing: false,
    lastX: 0,
    lastY: 0,
    history: []
  };

  componentDidMount = () => {
    let canvas = ReactDOM.findDOMNode(this);

    canvas.width = this.props.width;
    canvas.height = this.props.height;

    let ctx = canvas.getContext('2d');

    this.setState({
      canvas: canvas,
      context: ctx
    });
  };
  
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.clear){
      this.resetCanvas();
    }
  };

  handleOnMouseDown = (e) => {
    let rect = this.state.canvas.getBoundingClientRect();
    this.state.context.beginPath();
    if(this.isMobile()){
      this.setState({
        lastX: e.targetTouches[0].pageX - rect.left,
        lastY: e.targetTouches[0].pageY - rect.top
      });
    }
    else {
      this.setState({
        lastX: e.clientX - rect.left,
        lastY: e.clientY - rect.top
      });
    }

    this.setState({
      drawing: true
    });
  };

  handleOnMouseMove = (e) => {
    if(this.state.drawing){
      let rect = this.state.canvas.getBoundingClientRect();
      let lastX = this.state.lastX;
      let lastY = this.state.lastY;
      let currentX;
      let currentY;
      if(this.isMobile()){
        currentX =  e.targetTouches[0].pageX - rect.left;
        currentY = e.targetTouches[0].pageY - rect.top;
      }
      else{
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;
      }

      this.draw(lastX, lastY, currentX, currentY);
      this.setState({
        lastX: currentX,
        lastY: currentY
      });
    }
  };

  handleonMouseUp = () => {
    this.setState({
      drawing: false
    });
    this.props.updateImageEnhancement();
  };

  draw = (lX, lY, cX, cY) => {
    this.state.context.strokeStyle = this.props.brushColor;
    this.state.context.lineWidth = this.props.lineWidth;
    this.state.context.moveTo(lX,lY);
    this.state.context.lineTo(cX,cY);
    this.state.context.stroke();
  };

  resetCanvas = () => {
    let width = this.state.context.canvas.width;
    let height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
  };

  getDefaultStyle = () => {
    return {
      backgroundColor: '#FFFFFF',
      cursor: 'url(./img/eraser-cursor.png), auto'
    };
  };

  canvasStyle = () => {
    let defaults =  this.getDefaultStyle();
    let custom = this.props.canvasStyle;
    return Object.assign({}, defaults, custom);
  };

  isMobile = () => {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }
    return false;
  };

  render = () => {
    return (
      <canvas id={this.props.id} style = {this.canvasStyle()}
        onMouseDown = {this.handleOnMouseDown}
        onTouchStart = {this.handleOnMouseDown}
        onMouseMove = {this.handleOnMouseMove}
        onTouchMove = {this.handleOnMouseMove}
        onMouseUp = {this.handleonMouseUp}
        onTouchEnd = {this.handleonMouseUp}
        width = {Math.floor(this.props.width)}
        height = {Math.floor(this.props.height)}
      >
      </canvas>
    );
  }
};

export class ImageCanvas extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    image: PropTypes.object,
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
  };

  draw = () => {
    let canvas = this.state.canvas;
    let ctx = this.state.ctx;
    
    canvas.width = this.props.width;
    canvas.height = this.props.height;

    try {
      ctx.drawImage(this.props.image, 0, 0, canvas.width, canvas.height);
    } catch (err) { }
  };

  componentDidUpdate = () => {
    this.draw();
  };

  componentDidMount = () => {
    let canvas = ReactDOM.findDOMNode(this);
    let ctx = canvas.getContext('2d');

    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;

    this.setState({canvas: canvas, ctx: ctx});
    this.forceUpdate(() => {
      this.draw();
    });
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
      lineWidth: 8,
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'none',
      },
      clear: false,
      poppedSlider: 1,
      showOriginal: true,
      showPopped: false,
      showEnhancement: false,
    };
  }

  static propTypes = {
    file: PropTypes.object
  };

  getCurrentImage = () => {
    if (this.state.showOriginal) {
      return this.state.currentImages.original;
    } else {
      return this.state.currentImages.popped[this.state.poppedSlider];
    }
  };

  handleSlider = (value) => {
    this.setState({poppedSlider: value - 1});
  };

  handleOnClickReset = () => {
    let currentImages = Object.assign({}, this.state.currentImages);
    currentImages.enhancement.src = currentImages.enhancementBlank.src;
    currentImages.popped[0].src = currentImages.poppedBlank[0].src;
    currentImages.popped[1].src = currentImages.poppedBlank[1].src;
    currentImages.popped[2].src = currentImages.poppedBlank[2].src;
    this.setState({
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'none',
      },
      clear: true,
      currentImages: currentImages,
    });
  };

  handleOnClickTouchUp = () => {
    this.setState({
      canvasStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointerEvents: 'auto',
      },
      clear: false
    });
  };

  toggleOriginal = () => {
    this.setState({showOriginal: !this.state.showOriginal});
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
    if (nextProps.file != undefined && this.state.lastImageId != nextProps.file.imageId) {
      let currentImages = {
        original: new Image(),
        popped: [new Image(), new Image(), new Image()],
        poppedBlank: [new Image(), new Image(), new Image()],
        enhancement: new Image(),
        enhancementBlank: new Image(),
      };

      currentImages.original.src = 'data:image/png;base64,' + nextProps.file.original;
      currentImages.popped[0].src = 'data:image/png;base64,' + nextProps.file.popped[0];
      currentImages.popped[1].src = 'data:image/png;base64,' + nextProps.file.popped[1];
      currentImages.popped[2].src = 'data:image/png;base64,' + nextProps.file.popped[2];
      currentImages.poppedBlank[0].src = 'data:image/png;base64,' + nextProps.file.popped[0];
      currentImages.poppedBlank[1].src = 'data:image/png;base64,' + nextProps.file.popped[1];
      currentImages.poppedBlank[2].src = 'data:image/png;base64,' + nextProps.file.popped[2];
      currentImages.enhancement.src = 'data:image/png;base64,' + nextProps.file.enhancement;
      currentImages.enhancementBlank.src = currentImages.enhancement.src;
      this.setState({lastImageId: nextProps.file.imageId, currentImages: currentImages});
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return true;
  };

  componentDidMount = () => {
    window.document.addEventListener('keydown', this.handleKeydown);
    window.document.addEventListener('keyup', this.handleKeyup);
  };

  componentWillUnmount = () => {
    window.document.removeEventListener('keydown', this.handleKeydown);
    window.document.removeEventListener('keyup', this.handleKeyup);
  };

  downloadImage = () => {
    let imageCanvas = document.getElementById('imageCanvas');
    let downloadBtn = document.querySelector('.downloadBtn');
    downloadBtn.href = (imageCanvas ? imageCanvas.toDataURL('image/png') : '');
  };

  updateImageEnhancement = () => {
    let imageCanvas = document.getElementById('imageCanvas');
    let drawableCanvas = document.getElementById('drawableCanvas');
    let enhCanvas = document.getElementById('enhancementCanvas');
  
    let imageContext = imageCanvas.getContext('2d');
    let drawableContext = drawableCanvas.getContext('2d');
    let enhContext = enhCanvas.getContext('2d');
    
    let imageData = imageContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    let drawData = drawableContext.getImageData(0, 0, drawableCanvas.width, drawableCanvas.height);
    let enhData = enhContext.getImageData(0, 0, drawableCanvas.width, drawableCanvas.height);

    for (let i = 3; i < drawData.data.length; i += 4) {
      if (drawData.data[i] != 0) {
        imageData.data[i - 1] += 128 - enhData.data[i - 1];
        imageData.data[i - 2] += 128 - enhData.data[i - 2];
        imageData.data[i - 3] += 128 - enhData.data[i - 3];

        enhData.data[i - 1] = 128;
        enhData.data[i - 2] = 128;
        enhData.data[i - 3] = 128;
      }
    }

    imageContext.putImageData(imageData, 0, 0);
    enhContext.putImageData(enhData, 0, 0);

    let currentImages = Object.assign({}, this.state.currentImages);
    currentImages.popped[this.state.poppedSlider].src = imageCanvas.toDataURL('image/png');
    currentImages.enhancement.src = enhCanvas.toDataURL('image/png');

    this.setState({ clear: true });
  };

  render = () => {
    const {file} = this.props;
    if (file == undefined) {
      return (<div className='editor'>Select an image</div>);
    } else if (file.status == 'UPLOADING') {
      return (
        <div className='editor'>
          <img src='./img/loading.gif' />
          File is uploading...
        </div>
      );
    } else {
      let currentImage = this.getCurrentImage();
      let origBtnClass = this.state.showOriginal ? 'toggleBtn' :
        'toggleBtnClicked';
      let origBtnLabel = this.state.showOriginal ? 'Original' :
        'Popped';
      let enhBtnClass = this.state.showOriginal || !this.state.showEnhancement ? 'toggleBtn' :
        'toggleBtnClicked';

      let imgZIndex = (this.state.showOriginal || this.state.showPopped) ? 1 : 0;
      let enhZIndex = (!this.state.showOriginal && this.state.showEnhancement) ? 1 : 0;
      
      let width, height = 0;
      let parentNode = document.querySelector('.editorImageContainer');
      if ( parentNode != undefined ) {
        if (currentImage.naturalWidth > currentImage.naturalHeight && currentImage.naturalHeight / currentImage.naturalWidth * parentNode.offsetWidth <= parentNode.offsetHeight) {
          height = currentImage.naturalHeight / currentImage.naturalWidth * parentNode.offsetWidth * .98;
          width = parentNode.offsetWidth * .98;
        } else {
          width = currentImage.naturalWidth / currentImage.naturalHeight * parentNode.offsetHeight * .98;
          height = parentNode.offsetHeight * .98;
        }
      }

      return (
        <div className='editor'>
          <div className='editorContainer'>
            <div className='editorImageContainer' style={{zIndex: imgZIndex}}>
              <ImageCanvas id='imageCanvas' image={currentImage} 
                  width={width} height={height}/>
            </div>
            <div className='enhancementImageContainer' style={{zIndex: enhZIndex}}>
              <ImageCanvas id='enhancementCanvas' image={this.state.currentImages.enhancement}
                  width={width} height={height}/>
            </div>
            <div className='drawableImageContainer'>
              <NewDrawableCanvas {...this.state} id='drawableCanvas'
                  updateImageEnhancement={this.updateImageEnhancement} 
                  width={width} height={height}/>
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
              <Button className={'toggleBtn'} onClick={this.toggleOriginal} active={!this.state.showOriginal} bsStyle={!this.state.showOriginal ? 'success' : 'default'}>{origBtnLabel}</Button>
            </ButtonGroup>
            <Button className={'toggleBtn'} onClick={this.showEnhancement} active={this.state.showEnhancement} bsStyle={this.state.showEnhancement ? 'primary' : 'default'}
              disabled={this.state.showOriginal}>
              Show Enhancement
            </Button>
            <Button href='#' className='downloadBtn' onClick={this.downloadImage} download={file.name}>Download!</Button>
          </div>
        </div>
      );
    }
  };
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
          {
            file.status !== 'UPLOADING' ? (
            <img className='imageTableRowIcon'
                 src={'data:image/png;base64,'+ file.preview}
                 style={{opacity: file.progress}}/>
            ) : (
              <img className='imageTableRowIcon'
                 src={'./img/loading.gif'}
                 style={{opacity: file.progress}}/>
            )
          }
          {file.name}
        </td>
        <td className='imageTableRowSize'>{size}</td>
      </tr>
    );
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
                accept={'image/gif,image/jpeg,image/png'}>
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
