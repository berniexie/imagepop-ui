//Demo page - will show the before and after effect of popping an image

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

//a container for the before and after of the same picture
export default class DemoPane extends Component {
  //props for before and after pictures
  static propTypes = {
    before: PropTypes.string,
    after: PropTypes.string,
  };

  //default prop values
  static defaultProps = {
    before: '',
    after: '',
  };

  //state variables including whether after picture has been pressed
  state = {pressed:false};

  //when after picture has been clicked, reverse its state
  handleClick() {
    this.setState({pressed: !this.state.pressed});
  };

  render() {
    //consts for props
    const { before, after } = this.props;
    var styles = this.constructor.styles;

    //decide which picture to render on the right based on whether
    //or not is has been clicked
    var pic = this.state.pressed ? before : after;
    return (
      <div>
        <div style={styles.picContainer}>
          <img style={styles.pic} src={before}/>
        </div>
        <div style={styles.picContainer}>
          <img style={styles.pic} src={pic} onMouseDown={this.handleClick.bind(this)} 
              onMouseUp={this.handleClick.bind(this)}/> 
        </div>
      </div>
    );
  }
}

//styling for Demo Pane
DemoPane.styles = {
  picContainer: {
    display: "inline-block",
    width: "50%"
  },
  pic: {
    display: "block",
    margin: "auto",
    width: "95%"
  }
};

//container for all of the components of the Demo page
export default class DemoPage extends Component{
  render(){
    return(
      <div>
        <p> Check it out! </p>
        <DemoPane before="./img/bears-before.png" after="./img/bears-after.png"/>,
        <DemoPane before="./img/building-before.png" after="./img/building-after.png"/>,
      </div>
    );
  }
}

ReactDOM.render(
    <DemoPage/>,
    document.getElementById('app')
);

