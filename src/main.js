import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: '/api/upload_image'
};

var djsConfig = {
  addRemoveLinks: true,
  uploadMultiple: false,
  params: {

  }
}

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
      return (<SingleImageArea state={this.props.state}/>)
    }
  }
}

export default class SingleImageArea extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  render() {
    return (
      <DropzoneComponent config={componentConfig} djsConfig={djsConfig} />
    );
  }
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
      throw(exception: any);
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
      case "INITIAL":
        controls.push(<SliderControl min={0} max={10} name="Pop Level" key="popLevel"/>);
        break;
      default:
        break;
    }
    controls.push(<ActionButtonArea state={this.props.state} key="actionButtonArea"/>);
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
    state: PropTypes.string
  };

  render() {
    var buttons = [];
    switch (this.props.state) {
      case "INITIAL":
        buttons.push(<button type="button" key="popIt">Pop it!</button>);
        break;
      default:
        break;
    }
    return (
      <div style={{textAlign: 'center', margin: '0 auto'}}>
        {buttons}
      </div>
    );
  }
}

export default class ImageUploadArea extends Component {
  static propTypes = {
    state: PropTypes.string
  };

  static defaultProps = {
    state: 'INITIAL'
  };

  render() {
    return (
      <div>
        <ImageStatus state={this.props.state}/>
        <ImageUpload state={this.props.state}/>
        <ImageControlArea state={this.props.state}/>
      </div>
    );
  }
}

ReactDOM.render(
  <ImageUploadArea />,
  document.getElementById('app')
);
