import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

export default class ImageStatus extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  static getDescForState(state) {
    switch (state) {
      case "INITIAL":
        return "Upload an Image to Pop";
      case "PREPARING":
        return "Preparing to Upload Image";
      case "UPLOADING":
        return "Uploading Image";
      case "POPPING":
        return "Popping Image";
      case "FINISHED":
        return "Done Popping Image";
      case "MULTIPLE":
        return "Popping Multiple Images";
      default:
        return "UNKNOWN STATE";
    }
  }

  render() {
    return (
      <div style={{fontSize: '24px', textAlign: 'center'}}>
        {ImageStatus.getDescForState(this.props.state)}
      </div>
    );
  }
}

export default class ImageUpload extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  render() {
    if (this.props.state == 'MULTIPLE') {
      return (<BatchImageArea/>)
    } else {
      return (<SingleImageArea state={this.props.state}
                               onImageSelect={this.props.onImageSelect}/>)
    }
  }
}

export default class SingleImageArea extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
  };

  djsConfig = {
    addRemoveLinks: true,
    autoProcessQueue: false,
    uploadMultiple: false,
    params: { }
  };

  handleImageSelect = (file) => {
    this.props.onImageSelect(file);
  };

  handleFinishUploading(file) {
    console.log(file);
  }

  render = () => {
    return (
      <DropzoneComponent config={this.componentConfig} action="/api/upload_image"
                         djsConfig={this.djsConfig}
                         eventHandlers={{
                           addedfile: this.handleImageSelect,
                           drop: () => {},
                           complete: this.handleFinishUploading
                         }}/>
    );
  };
}

export default class BatchImageArea extends Component {
  static propTypes = {
    imageFiles: PropTypes.array
  };

  static defaultProps = {
    imageFiles: []
  };

  render() {
    if (this.props.state != 'MULTIPLE') {
      throw "Cannot render BatchImageArea in state other than MULTIPLE";
    } else {
      var rows = [];
      for (var file of this.props.imageFiles) {
        rows.push(<ImageRow file={file}/>);
      }
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    }
  }
}

export default class ImageRow extends Component {
  static propTypes = {
    state: PropTypes.string,
    file: PropTypes.string
  };

  static defaultProps = {
    state: 'PREPARE',
    file: ''
  };

  render() {
    return (
      <tr>
        <td>{this.props.file}</td>
        <td>{this.props.state}</td>
      </tr>
    );
  }
}

export default class ImageControlArea extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  render() {
    var controls = [];
    switch (this.props.state) {
      case "PREPARING":
        controls.push(<SliderControl min={0} max={10} name="Pop Level" key="popLevel"/>);
        break;
      default:
        break;
    }
    controls.push(<ActionButtonArea state={this.props.state}
                                    key="actionButtonArea"
                                    onBeginPopping={this.props.onBeginPopping}/>);
    return (
      <div style={{margin: '0 auto'}}>
        {controls}
      </div>
    );
  }
}

export default class SliderControl extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    name: PropTypes.string
  };

  static defaultProps = {
    min: 0,
    max: 1,
    name: ''
  };

  render() {
    return (
      <div style={{textAlign: 'center', margin: '0 auto'}}>
        <input type="number" min={this.props.min} max={this.props.max} step="1"/>
        <label>{this.props.name}</label>
      </div>
    );
  }
}

export default class ActionButtonArea extends Component {
  static propTypes = {
    state: PropTypes.string,
    onBeginPopping: PropTypes.func
  };

  handlePopItClick = (e) => {
    this.props.onBeginPopping();
  };

  render() {
    var buttons = [];
    if (this.props.state == "PREPARING") {
      buttons.push(<button type="button" key="popIt"
                             onClick={this.handlePopItClick}>Pop it!</button>);
      buttons.push(<button type="button" key="clear">Clear</button>);
    }
    return (
      <div style={{textAlign: 'center', margin: '0 auto'}}>
        {buttons}
      </div>
    );
  }
}

export default class ImageUploadArea extends Component {
  constructor(props) {
    super(props);
    this.state = {s: 'INITIAL'};
  }

  handleImageSelect = (images) => {
    if (this.state.s == 'INITIAL' || this.state.s == 'FINISHED') {
      if (Array.isArray(images)) {
        this.setState({s: 'MULTIPLE'});
      } else {
        this.setState({s: 'PREPARING'});
      }
    } else {
      this.setState({s: 'MULTIPLE'});
    }
  };

  handleBeginPopping() {
    if (this.state.s == 'PREPARING') {
      this.setState({s: 'UPLOADING'});
    }
  }

  handleFinishUploading() {
    if (this.state.s == 'UPLOADING') {
      this.setState({s: 'POPPING'});
    } else {
      throw "Cannot transition to POPPING from state other than UPLOADING";
    }
  }

  handleFinishPopping() {
    if (this.state.s == 'POPPING') {
      this.setState({s: 'FINISHED'});
    } else {
      throw "Cannot transition to FINISHED from state other than POPPING";
    }
  }

  render() {
    return (
      <div>
        <ImageStatus state={this.state.s}/>
        <ImageUpload state={this.state.s}
                     onImageSelect={this.handleImageSelect}
                     onFinishUploading={this.handleFinishUploading}
                     onFinishPopping={this.handleFinishPopping}/>
        <ImageControlArea state={this.state.s}
                          onBeginPopping={this.handleBeginPopping}/>
      </div>
    );
  }
}

ReactDOM.render(
  <ImageUploadArea />,
  document.getElementById('app')
);
