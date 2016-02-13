//Demo page - will show the before and after effect of popping an image

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

//a container for each picture in the gallery
export default class DemoPicture extends Component {
  static propTypes = {
    popped: PropTypes.string,
  };

  //default prop values
  static defaultProps = {
    popped: '',
  };

  state = {};

  handleClick() {
  };

  render() {
    const {popped} = this.props;
    return (
      <div className='col-sm-4'>
        <img className='galleryPic' src={popped}/>
      </div>
    );
  }
}

//a component for the modal that will pop up when the picture is clicked
export default class DemoModal extends Component {
  static propTypes = {
    
  };

  //default prop values
  static defaultProps = {
    
  };

  state = {};

  handleClick() {
  };

  render() {
    
    return (
      <div>

      </div>
    );
  }
}

//container for all of the components of the Demo page
export default class DemoPage extends Component{
  render(){
    return(
      <div className='pageContent'>
        <h1>Gallery</h1>
        <p className='subheader'>Check out the photos below to get a better idea of how image|pop works.</p>
        <div className='container-fluid'>
          <div className='row'>
            <DemoPicture popped="./img/bears-after.png"/>
            <DemoPicture popped="./img/building-after.png"/>
            <DemoPicture popped="./img/bears-after.png"/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/bears-after.png"/>
            <DemoPicture popped="./img/building-after.png"/>
            <DemoPicture popped="./img/bears-after.png"/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/bears-after.png"/>
            <DemoPicture popped="./img/building-after.png"/>
            <DemoPicture popped="./img/bears-after.png"/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
    <DemoPage/>,
    document.getElementById('app')
);

