//a component for the modal that will pop up when the picture is clicked
import React, { PropTypes, Component } from 'react';
import styles from '../../../public/css/demo.css';
import Slider from 'react-slider';
import {ButtonGroup, Button} from 'react-bootstrap';
import classNames from 'classnames';

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

  state = {pressed:true, after:this.props.medImageSrc, available:true, sliderValue:2};

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.medImageSrc == '') {
      this.setState({
        after: nextProps.medImageSrc,
        sliderValue: 2,
        available: false
      });
    } else {
      this.setState({
        after: nextProps.medImageSrc,
        sliderValue: 2,
        available: true
      });
    }
  }

  handleSlider = (value) => {
    switch (value) {
      case 1:
        if (this.props.lowImageSrc == '') { 
          this.setState({available: false, pressed:true, sliderValue: 1}); 
        } else {
          this.setState({after: this.props.lowImageSrc, available: true, 
            pressed:true, sliderValue: 1}); 
        }
        break;
      case 2:
        if (this.props.medImageSrc == '') {
          this.setState({available: false, pressed:true, sliderValue: 2}); 
        } else {
          this.setState({after: this.props.medImageSrc, available: true, 
            pressed:true, sliderValue: 2});
        }
        break;
      default:
        if (this.props.highImageSrc == '') {
          this.setState({available: false, pressed:true, sliderValue: 3}); 
        } else {
          this.setState({after: this.props.highImageSrc, available: true, 
            pressed:true, sliderValue: 3});
        }
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
    var origBtnClass = classNames({
      'disabled': !this.state.available,
      'toggleButton': this.state.available && this.state.pressed,
      'toggleButtonClicked': this.state.available && !this.state.pressed
    });
    var popBtnClass = classNames({
      'disabled': !this.state.available,
      'toggleButton': this.state.available && !this.state.pressed,
      'toggleButtonClicked': this.state.available && this.state.pressed
    });
    return (
      <div className='demoModal'>
        {this.state.available ? '' : <div className='notAvailable'>Image Not Available</div>}
        <img src={pic}></img>
        <h3>Level of Contrast</h3>
        <p>Adjust the amount of edge contrast using the indicators below.</p>
        <div className='sliderWrapper'>
          <Slider value={this.state.sliderValue} defaultValue={2} min={1} max={3} step={1} withBars 
              onChange={this.handleSlider}>
            <div className='handle'/>
          </Slider>
          <div className='label labelLeft'>low</div>
          <div className='label'>med</div>
          <div className='label labelRight'>high</div>
        </div>
        <ButtonGroup>
          <Button className={origBtnClass} onClick={this.showOriginal} bsSize='large'>Original</Button>
          <Button className={popBtnClass} onClick={this.showPopped} bsSize='large'>Popped</Button>
        </ButtonGroup>
      </div>
    );
  }
}