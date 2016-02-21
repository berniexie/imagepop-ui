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
    const {popped, bef, aft} = this.props;
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
  state = {hidden:true, after:'', before:''};

  handleClick(aft, bef) {
    document.getElementById('body').className 
        = (!this.state.hidden) ? "" : "noScroll";
    this.setState({
      hidden: !this.state.hidden, 
      after: aft, 
      before: bef
    });
  };
  render(){
    return(
      <div className={this.state.hidden ? '' : 'noScroll'}>
        <div className='container-fluid'>
          <div className='row'>
            <DemoPicture popped="./img/beach-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/beach-after.png", "./img/beach-before.png")}/>
            <DemoPicture popped="./img/doheny-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/doheny-after.png", "./img/doheny-before.png")}/>
            <DemoPicture popped="./img/building-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/building-after.png", "./img/building-before.png")}/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/jellies-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/jellies-after.png", "./img/jellies-before.png")}/>
            <DemoPicture popped="./img/kelp-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/kelp-after.png", "./img/kelp-before.png")}/>
            <DemoPicture popped="./img/shark-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/shark-after.png", "./img/shark-before.png")}/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/ships-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/ships-after.png", "./img/ships-before.png")}/>
            <DemoPicture popped="./img/tanks-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/tanks-after.png", "./img/tanks-before.png")}/>
            <DemoPicture popped="./img/waves-small.png"
                callBack ={this.handleClick.bind(this, 
                    "./img/waves-after.png", "./img/waves-before.png")}/>
          </div>
        </div>
        {this.state.hidden ? null
            : <DemoModal after = {this.state.after}
            before = {this.state.before}
            callBack ={this.handleClick.bind(this, "", "")}/>}
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

