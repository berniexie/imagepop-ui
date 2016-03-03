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
          <Modal.Body>
            <DemoModal lowImageSrc = {this.state.low}
              medImageSrc = {this.state.med}
              highImageSrc = {this.state.high}
              beforeImageSrc = {this.state.before}
              callBack ={() => this.handleClick("", "")}/>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}