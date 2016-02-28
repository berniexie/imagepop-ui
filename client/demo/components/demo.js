//Demo page - will show the before and after effect of popping an image

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PageTemplate from '../../shared/components/pageTemplate.js';
import styles from '../../../public/css/demo.css';
import Slider from 'react-slider';

//a container for each picture in the gallery
export default class DemoPicture extends Component {
  static propTypes = {
    popped: PropTypes.string,
  };

  //default prop values
  static defaultProps = {
    popped: '',
  };

  handleClick = () => {
    this.props.callBack();
  };

  render() {
    const {popped, bef, aft} = this.props;
    return (
      <div className='col-sm-4'>
        <img className="galleryPic" onClick={this.handleClick}
            src={popped}/>
      </div>
    );
  }
}

//a component for the modal that will pop up when the picture is clicked
export default class DemoModal extends React.Component{
  
  static propTypes = {
    low: PropTypes.string,
    med: PropTypes.string,
    high: PropTypes.string,
    before: PropTypes.string,

  };

  //default prop values
  static defaultProps = {
    low: '',
    med: '',
    high: '',
    before: '',
  };

  state = {pressed:true, after:this.props.med};

  //will display original when the picture in the modal is pressed down
  handleClick = () => {
    this.setState({pressed: !this.state.pressed})
  };

  //closes the modal when you click outside
  closeModal = (e) => {
    if (e.target.className == 'demoModalWrapper')
      this.props.callBack();
  };

  handleSlider = (value) => {
    switch (value) {
      case 1:
        this.setState({after: this.props.low});
        break;
      case 2:
        this.setState({after: this.props.med});
        break;
      default:
        this.setState({after: this.props.high});
        break;
    }
  };

  render() {
    const {before} = this.props;
    var imageText = this.state.pressed ? 'after' : 'before';
    var pic = this.state.pressed ? this.state.after : before;
    return (
      <div className = 'demoModalWrapper' onClick={this.closeModal}>
        <div className='demoModal'>
          <div className='imageText'>{imageText}</div>
          <img src={pic} onMouseDown={this.handleClick}
              onMouseUp={this.handleClick}></img>
          <div className='pressLabel'>Press and hold the image to see it before 
              it was popped</div>
          <h3>Level of Contrast</h3>
          <p>Adjust the amount of edge contrast using the indicators below.</p>
          <div className='sliderWrapper'>
            <Slider  defaultValue={2} min={1} max={3} step={1} withBars 
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
}

//container for all of the components of the Demo page
export default class DemoPageContent extends Component {
  state = {hidden:true, low:'', med:'', high:'', before:''};

  handleClick(l, m, h, bef){
    document.getElementById('body').className 
        = (!this.state.hidden) ? "" : "noScroll";
    this.setState({
      hidden: !this.state.hidden, 
      low: l, 
      med: m,
      high: h,
      before: bef
    });
  };
  render(){
    return(
      <div className={this.state.hidden ? '' : 'noScroll'}>
        <div className='container-fluid'>
          <div className='row'>
            <DemoPicture popped="./img/beach-small.png"
                callBack ={() => this.handleClick( 
                    "", "./img/beach-after.png", "", "./img/beach-before.png")}/>
            <DemoPicture popped="./img/doheny-small.png"
                callBack ={() => this.handleClick(
                    "./img/doheny-low.png", "./img/doheny-medium.png", "./img/doheny-high.png", "./img/doheny-before.png")}/>
            <DemoPicture popped="./img/building-small.png"
                callBack ={() => this.handleClick(
                    "", "./img/building-after.png", "", "./img/building-before.png")}/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/jellies-small.png"
                callBack ={() => this.handleClick(
                    "", "./img/jellies-after.png", "", "./img/jellies-before.png")}/>
            <DemoPicture popped="./img/kelp-small.png"
                callBack ={() => this.handleClick( 
                    "", "./img/kelp-after.png", "", "./img/kelp-before.png")}/>
            <DemoPicture popped="./img/shark-small.png"
                callBack ={() => this.handleClick(
                    "", "./img/shark-after.png", "", "./img/shark-before.png")}/>
          </div>
          <div className='row'>
            <DemoPicture popped="./img/ships-small.png"
                callBack ={() => this.handleClick(
                    "", "./img/ships-after.png", "", "./img/ships-before.png")}/>
            <DemoPicture popped="./img/tanks-small.png"
                callBack ={() => this.handleClick(
                    "", "./img/tanks-after.png", "", "./img/tanks-before.png")}/>
            <DemoPicture popped="./img/waves-small.png"
                callBack ={() => this.handleClick(
                    "", "./img/waves-after.png", "", "./img/waves-before.png")}/>
          </div>
        </div>
        {this.state.hidden ? null
            : <DemoModal low = {this.state.low}
            med = {this.state.med}
            high = {this.state.high}
            before = {this.state.before}
            callBack ={() => this.handleClick("", "")}/>}
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

