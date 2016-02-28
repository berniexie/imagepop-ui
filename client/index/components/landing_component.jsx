import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../../shared/components/navbar_component.jsx';
import styles from '../../../public/css/index.css';

export default class Landing extends Component {
  var landingStyle;

  static propTypes = {
    user: PropTypes.string
  };

  landingStyle = {
      color: "white",
      height: "100%",
      backgroundImage: 'url(./img/sea-nature-sunny-beach.jpg)',
      backgroundSize: "cover",
      filter: "brightness(70%)",
      position: "relative",
      display: "flex",
      alignItems: "flex-end"
  };

  render () {
    return (
      //<body style="background-image:url('./img/sea-nature-sunny-beach.jpg')">
      // <img src={'./img/sea-nature-sunny-beach.jpg'}/>

    <div className="Landing" style={landingStyle}>
      <Navbar />
        <div style={{width:"100%", paddingBottom:"5%"}}>
            <h1 style={{fontSize: "48px", textShadow:"2px 4px 4px gray"}}> <b>image | pop </b> </h1>
            <p style={{fontSize:"36px", textShadow:"2px 4px 4px gray"}}> Make your photos standout with ImagePop. <br/> A photo enhancer that will make your images pop! </p>
            <div>
              <a href="/demo" className="galleryButton">VIEW OUR GALLERY</a>
              <a href="/main" className="uploadButton">UPLOAD NOW</a>
            </div>
        </div>
    </div>
    );
  }
}

ReactDOM.render(<Landing/>, document.getElementById('app') );
