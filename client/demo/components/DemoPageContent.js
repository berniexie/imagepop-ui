//container for all of the components of the Demo page
import React, { PropTypes, Component } from 'react';
import styles from '../../../public/css/demo.css';
import DemoModal from './DemoModal.js';
import { Modal, Grid, Row, Col } from 'react-bootstrap';

export default class DemoPageContent extends Component {

  static propTypes = {
    demoImages: PropTypes.array,
  };

  defaultProps = {
    demoImages: [],
  };
  state = {hidden:true, low:'', med:'', high:'', before:'', showModal:false};

  handleClick(l, m, h, bef){
    this.setState({
      low: l, 
      med: m,
      high: h,
      before: bef,
      showModal: true 
    });
  };
  
  close = () =>  {
    this.setState({ showModal: false });
  };

  prevImage = (demoImages) =>  {
    for (var r = 0; r < demoImages.length; r++) {
      for (var c = 0; c < demoImages[r].length; c++) {
        if (demoImages[r][c].medImgSrc === this.state.med) {
          var row = (c == 0 ? 
            (r == 0 ? demoImages.length-1 : r-1) : r);
          var col = (c == 0 ? 
            (r == 0 ? demoImages[demoImages.length-1].length - 1 : demoImages[r-1].length - 1) : c-1);
          this.setState({
            low: demoImages[row][col].lowImgSrc, 
            med: demoImages[row][col].medImgSrc,
            high: demoImages[row][col].highImgSrc,
            before: demoImages[row][col].befImgSrc,
            showModal: true 
          });
          break;
        }
      }
    }
  };

  nextImage = (demoImages) =>  {
    for (var r = 0; r < demoImages.length; r++) {
      for (var c = 0; c < demoImages[r].length; c++) {
        if (demoImages[r][c].medImgSrc === this.state.med) {
          var row = (c == demoImages[r].length - 1 ? 
            (r+1 == demoImages.length ? 0 : r+1) : r);
          var col = (c == demoImages[r].length - 1 ? 0 : c+1);
          this.setState({
            low: demoImages[row][col].lowImgSrc, 
            med: demoImages[row][col].medImgSrc,
            high: demoImages[row][col].highImgSrc,
            before: demoImages[row][col].befImgSrc,
            showModal: true 
          });
          break;
        }
      }
    }
  };

  render(){
    const {demoImages} = this.props;

    //iterates over 2D (3x3) array containing the image files and prepares them to be rendered
    var rows = this.props.demoImages.map( (item, i) =>{
      var entry = item.map( (element, j) =>{
        return ( 
          <Col key = {j} sm={4}>
            <img className="galleryPic" onClick={() => this.handleClick(element.lowImgSrc, element.medImgSrc, element.highImgSrc, element.befImgSrc)}
                src={element.smallImgSrc}/>
          </Col>
          );
        });
      return (
        <Row key={i}> {entry} </Row>
      );
    });
    return(
      <div>
        <Grid fluid={true}>
              {rows}
        </Grid>
        <Modal show={this.state.showModal} onHide={this.close}>
          <div className="arrow leftArrow" onClick={() => this.prevImage(demoImages)}>&#60;</div>
          <Modal.Body>
            <DemoModal lowImageSrc = {this.state.low}
              medImageSrc = {this.state.med}
              highImageSrc = {this.state.high}
              beforeImageSrc = {this.state.before}
              callBack ={() => this.handleClick("", "")}/>
          </Modal.Body>
          <div className="arrow rightArrow" onClick={() => this.nextImage(demoImages)}>&#62;</div>
        </Modal>
      </div>
    );
  }
}