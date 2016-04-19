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

  state = {showPopped:true, after:this.props.medImageSrc, available:true, sliderValue:2};

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
          this.setState({available: false, showPopped:true, sliderValue: 1}); 
        } else {
          this.setState({after: this.props.lowImageSrc, available: true, 
            showPopped:true, sliderValue: 1}); 
        }
        break;
      case 2:
        if (this.props.medImageSrc == '') {
          this.setState({available: false, showPopped:true, sliderValue: 2}); 
        } else {
          this.setState({after: this.props.medImageSrc, available: true, 
            showPopped:true, sliderValue: 2});
        }
        break;
      default:
        if (this.props.highImageSrc == '') {
          this.setState({available: false, showPopped:true, sliderValue: 3}); 
        } else {
          this.setState({after: this.props.highImageSrc, available: true, 
            showPopped:true, sliderValue: 3});
        }
        break;
    }
  };

  toggleOriginal = () => {
    this.setState({showPopped: !this.state.showPopped});
  };

  render() {
    const {beforeImageSrc} = this.props;
    var pic = this.state.showPopped ? this.state.after : beforeImageSrc;
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
          <Button className={'toggleButton'} disabled={!this.state.available} active={this.state.available && this.state.showPopped}
                  onClick={this.toggleOriginal} bsSize='large' bsStyle={this.state.showPopped ? 'success' : 'default'}>
            {this.state.showPopped ? 'Popped' : 'Original'}
          </Button>
      </div>
    );
  }
}