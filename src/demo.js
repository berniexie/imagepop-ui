//Demo page - will show the before and after effect of popping an image

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PageTemplate from './pageTemplate.js';
import styles from '../css/demo.css';

//a container for each picture in the gallery
export default class DemoPicture extends Component {
  static propTypes = {
    popped: PropTypes.string,
  };

  //default prop values
  static defaultProps = {
    popped: '',
  };

  state = {hidden:true};

  handleClick() {
    console.log("in parent" + this.state.hidden);
    this.setState({hidden: !this.state.hidden})
  };

  render() {
    const {popped} = this.props;
    return (
      <div className='col-sm-4'>
        <img className="galleryPic" onClick={this.handleClick.bind(this)}
            src={popped}/>
        {this.state.hidden ? null
            : <DemoWrapper after ="./img/building-after.png" 
            before ="./img/building-before.png" callBackParent ={this.handleClick.bind(this)}/>}
      </div>
    );
  }
}

export default class DemoWrapper extends DemoPicture{
  static propTypes = {
    after: PropTypes.string,
    before: PropTypes.string,
  };

  //default prop values
  static defaultProps = {
    after: '',
    before: '',
  };

  handleClick(){
    console.log("in wrapper");
    this.props.callBackParent();
  };
  render(){
    const {after, before} = this.props;
    return (
      <div className='demoModalWrapper' onClick={this.handleClick.bind(this)}>
        <DemoModal after={this.props.after} before={this.props.before}/>
      </div>
    );
  }
}
//a component for the modal that will pop up when the picture is clicked
export default class DemoModal extends DemoWrapper{
  
  state = {pressed:true};

  handleClick() {
    this.setState({pressed: !this.state.pressed})
  };

  render() {
    const {after, before} = this.props;
    var imageText = this.state.pressed ? 'after' : 'before';
    var pic = this.state.pressed ? after : before;
    return (
        <div className='demoModal'>
          <div className='imageText'>{imageText}</div>
          <img src={pic} onMouseDown={this.handleClick.bind(this)}
              onMouseUp={this.handleClick.bind(this)}></img>
          <div className='pressLabel'>Press and hold the image to see it before it was popped</div>
          <h3>Level of Contrast</h3>
          <p>Adjust the amount of edge contrast using the indicators below.</p>
        </div>
    );
  }
}

//container for all of the components of the Demo page
export default class DemoPageContent extends Component {
  render(){
    return(
      <div>
        <div className='container-fluid'>
          <div className='row'>
            <DemoPicture popped="./img/basketball-small.png"/>
            <DemoPicture popped="./img/usc-small.png"/>
            <DemoPicture popped="./img/building-small.png"/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/cars-small.png"/>
            <DemoPicture popped="./img/aquarium-small.png"/>
            <DemoPicture popped="./img/manchu-small.png"/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/trump-small.png"/>
            <DemoPicture popped="./img/dress-small.png"/>
            <DemoPicture popped="./img/motorcycle-small.png"/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
    <PageTemplate title="Gallery" 
        subtitle="Select an image below to see what image|pop can do." >
      <DemoPageContent />
    </PageTemplate>,
    document.getElementById('app'),
);

