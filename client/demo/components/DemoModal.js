//a component for the modal that will pop up when the picture is clicked
import React, { PropTypes, Component } from 'react';
import styles from '../../../public/css/demo.css';
import Slider from 'react-slider';
import {ButtonGroup, Button} from 'react-bootstrap';

export default class DemoModal extends React.Component{
  
  static propTypes = {
    lowImageSrc: PropTypes.string,
    medImageSrc: PropTypes.string,
    highImageSrc: PropTypes.string,
    beforeImageSrc: PropTypes.string,

  };

  //default prop values
  static defaultProps = {
    lowImageSrc: '',
    medImageSrc: '',
    highImageSrc: '',
    beforeImageSrc: '',
  };

  state = {pressed:true, after:this.props.medImageSrc};

  handleSlider = (value) => {
    switch (value) {
      case 1:
        this.setState({after: this.props.lowImageSrc, pressed:true});
        break;
      case 2:
        this.setState({after: this.props.medImageSrc, pressed:true});
        break;
      default:
        this.setState({after: this.props.highImageSrc, pressed:true});
        break;
    }
  };

  showOriginal = () => {
    this.setState({pressed: false});
  };

  showPopped = () => {
    this.setState({pressed: true});
  };

  render() {
    const {beforeImageSrc} = this.props;
    var pic = this.state.pressed ? this.state.after : beforeImageSrc;
    return (
      <div className='demoModal'>
        <img src={pic}></img>
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
        <ButtonGroup>
          <Button className={this.state.pressed ? 'toggleButton' : 'toggleButtonClicked'} onClick={this.showOriginal} bsSize='large'>Original</Button>
          <Button className={this.state.pressed ? 'toggleButtonClicked' : 'toggleButton'} onClick={this.showPopped} bsSize='large'>Popped</Button>
        </ButtonGroup>
      </div>
    );
  }
}