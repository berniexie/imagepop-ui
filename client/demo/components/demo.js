//Demo page - will show the before and after effect of popping an image

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PageTemplate from '../../shared/components/pageTemplate.js';
import styles from '../../../public/css/demo.css';
import Slider from 'react-slider';

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

  static propTypes = {
    demoImages: PropTypes.array,
  };

  defaultProps = {
    demoImages: [],
  };
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
    const {demoImages} = this.props;
    var rows = this.props.demoImages.map( (item, i) =>{
      var entry = item.map( (element, j) =>{
        return ( 
          <div key = {j} className='col-sm-4'>
            <img className="galleryPic" onClick={() => this.handleClick(element.lowImgSrc, element.medImgSrc, element.highImgSrc, element.befImgSrc)}
                src={element.smallImgSrc}/>
          </div>
          );
        });
      return (
        <div className='row' key={i}> {entry} </div>
      );
    });
    return(
      <div className={this.state.hidden ? '' : 'noScroll'}>
        <div className='container-fluid'>
              {rows}
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

var images = [[{smallImgSrc: "./img/beach-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/beach-after.png",
                highImgSrc: "",
                befImgSrc: "./img/beach-before.png"},
                {smallImgSrc: "./img/doheny-small.png",
                lowImgSrc: "./img/doheny-low.png",
                medImgSrc: "./img/doheny-medium.png",
                highImgSrc: "./img/doheny-high.png",
                befImgSrc: "./img/doheny-before.png"},
                {smallImgSrc: "./img/building-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/building-after.png",
                highImgSrc: "",
                befImgSrc: "./img/building-before.png"}],
                [{smallImgSrc: "./img/jellies-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/jellies-after.png",
                highImgSrc: "",
                befImgSrc: "./img/jellies-before.png"},
                {smallImgSrc: "./img/kelp-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/kelp-after.png",
                highImgSrc: "",
                befImgSrc: "./img/kelp-before.png"},
                {smallImgSrc: "./img/shark-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/shark-after.png",
                highImgSrc: "",
                befImgSrc: "./img/shark-before.png"}],
                [{smallImgSrc: "./img/ships-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/ships-after.png",
                highImgSrc: "",
                befImgSrc: "./img/ships-before.png"},
                {smallImgSrc: "./img/tanks-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/tanks-after.png",
                highImgSrc: "",
                befImgSrc: "./img/tanks-before.png"},
                {smallImgSrc: "./img/waves-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/waves-after.png",
                highImgSrc: "",
                befImgSrc: "./img/waves-before.png"}]];
ReactDOM.render(
    <PageTemplate title="Gallery" 
        subtitle="Select an image below to see what image|pop can do." >
      <DemoPageContent demoImages={images}/>
    </PageTemplate>,
    document.getElementById('app'),
);

