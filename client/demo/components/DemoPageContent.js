//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import styles from '../../../public/css/demo.css';
import DemoModal from './DemoModal.js';

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

    //iterates over 2D (3x3) array containing the image files and prepares them to be rendered
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
            : <DemoModal lowImageSrc = {this.state.low}
            medImageSrc = {this.state.med}
            highImageSrc = {this.state.high}
            beforeImageSrc = {this.state.before}
            callBack ={() => this.handleClick("", "")}/>}
        </div>
    );
  }
}