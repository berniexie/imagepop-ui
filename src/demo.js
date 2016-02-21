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
    this.props.callBack();
  };

  render() {
    const {popped} = this.props;
    return (
      <div className='col-sm-4'>
        <img className="galleryPic" onClick={this.handleClick.bind(this)}
            src={popped}/>
      </div>
    );
  }
}

//a component for the modal that will pop up when the picture is clicked
export default class DemoModal extends Component{
  
  static propTypes = {
    after: PropTypes.string,
    before: PropTypes.string,
  };

  //default prop values
  static defaultProps = {
    after: '',
    before: '',
  };

  state = {pressed:true};

  //will display original when the picture in the modal is pressed down
  handleClick() {
    this.setState({pressed: !this.state.pressed})
  };

  //closes the modal when you click outside
  closeModal(e){
    if (e.target.className == 'demoModalWrapper')
      this.props.callBack();
  }

  render() {
    const {after, before} = this.props;
    var imageText = this.state.pressed ? 'after' : 'before';
    var pic = this.state.pressed ? after : before;
    return (
      <div className = 'demoModalWrapper' onClick={this.closeModal.bind(this)}>
        <div className='demoModal'>
          <div className='imageText'>{imageText}</div>
          <img src={pic} onMouseDown={this.handleClick.bind(this)}
              onMouseUp={this.handleClick.bind(this)}></img>
          <div className='pressLabel'>Press and hold the image to see it before 
              it was popped</div>
          <h3>Level of Contrast</h3>
          <p>Adjust the amount of edge contrast using the indicators below.</p>
        </div>
      </div>
    );
  }
}

//container for all of the components of the Demo page
export default class DemoPageContent extends Component {
  state = {hidden:true};

  handleClick() {
    document.getElementById('body').className 
        = (!this.state.hidden) ? "" : "noScroll";
    this.setState({hidden: !this.state.hidden});
  };

  render(){
    return(
      <div className={this.state.hidden ? '' : 'noScroll'}>
        <div className='container-fluid'>
          <div className='row'>
            <DemoPicture popped="./img/basketball-small.png" 
                callBack ={this.handleClick.bind(this)}/>
            <DemoPicture popped="./img/usc-small.png" 
                callBack ={this.handleClick.bind(this)}/>
            <DemoPicture popped="./img/building-small.png" 
                callBack ={this.handleClick.bind(this)}/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/cars-small.png" 
                callBack ={this.handleClick.bind(this)}/>
            <DemoPicture popped="./img/aquarium-small.png" 
                callBack ={this.handleClick.bind(this)}/>
            <DemoPicture popped="./img/manchu-small.png" 
                callBack ={this.handleClick.bind(this)}/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/trump-small.png" 
                callBack ={this.handleClick.bind(this)}/>
            <DemoPicture popped="./img/dress-small.png" 
                callBack ={this.handleClick.bind(this)}/>
            <DemoPicture popped="./img/motorcycle-small.png" 
                callBack ={this.handleClick.bind(this)}/>
          </div>
        </div>
        {this.state.hidden ? null
            : <DemoModal after ="./img/building-after.png" 
            before ="./img/building-before.png" 
            callBack ={this.handleClick.bind(this)}/>}
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

