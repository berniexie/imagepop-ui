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
          <p>Before</p>
          <img style={styles.pic} src={before}/>
        </div>
        <div style={{...styles.picContainer, ...styles.afterPic}}>
          <p>After</p>
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
    textAlign: "center",
    width: "50%"
  },
  pic: {
    display: "block",
    margin: "auto",
    width: "95%"
  },
  afterPic: {
    cursor: "pointer"
  }
};

//a container for the before and after of the same picture
export default class DemoPane2 extends Component {
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
      <div style={styles.picContainer}>
        <img style={styles.pic} src={pic} onMouseDown={this.handleClick.bind(this)} 
            onMouseUp={this.handleClick.bind(this)}/> 
        <div style={styles.buttonPanel}>
          <button style={styles.button}>Low</button>
          <button style={styles.button}>Medium</button>
          <button style={styles.button}>High</button>
        </div>
      </div>
    );
  }
}

//styling for Demo Pane
DemoPane2.styles = {
  picContainer: {
    display: "inline-block",
    marginTop: "20px",
    textAlign: "center",
    width: "100%"
  },
  pic: {
    cursor: "pointer",
    display: "block",
    margin: "auto",
    width: "95%"
  },
  buttonPanel: {
    marginTop: "10px"
  },
  button: {
    margin: "10px"
  }
};

//a container for the before and after of the same picture
export default class DemoPane3 extends Component {
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
  state = {sliderPosition:window.innerWidth*.5};

  //when after picture has been clicked, reverse its state
  handleClicks(e) {
    console.log(window.innerWidth);
    this.setState({sliderPosition: e.pageX});
  };

  render() {
    //consts for props
    const { before, after } = this.props;
    var styles = this.constructor.styles;

    //decide which picture to render on the right based on whether
    //or not is has been clicked
    var pic = this.state.pressed ? before : after;
    var style2 = {backgroundImage: "url(" + before + ")", width: ((this.state.sliderPosition*100.0)/window.innerWidth) + "%"};
    var style3 = {left: ((this.state.sliderPosition *100.0)/window.innerWidth) + "%"};
    return (
      <div>
        <p style={styles.headerText}><span style={styles.beforeText}>Before</span> 
            <span style={styles.afterText}>After</span></p>
        <div style={styles.clear}/>
        <div style={styles.picContainer} 
            onMouseMove={this.handleClicks.bind(this)}>
          <img id="picture" style={styles.pic} src={after}/>
          <div style={{...styles.divisor, ...style2}}/>
          <div style={{...styles.slider, ...style3}}/>
        </div>
      </div>
    );
  }
}

//styling for Demo Pane
DemoPane3.styles = {
  headerText: {
    marginTop: "20px",
    width: "100%"
  },
  beforeText: {
    float: "left",
    width: "5%"
  },
  afterText: {
    float: "right",
    width: "5%"
  },
  clear: {
    clear: "both"
  },
  picContainer: {
    display: "inline-block",
    marginTop: "10px",
    position: "relative",
    textAlign: "center",
    width: "100%"
  },
  pic: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    cursor: "pointer",
    display: "block",
    width: "100%"
  },
  divisor: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    bottom: "0",
    height: "100%",
    overflow: "hidden",
    position: "absolute",
    width: "100%"
  },
  slider: {
    backgroundColor: "black",
    bottom: "0",
    height: "100%",
    overflow: "hidden",
    position: "absolute",
    width: "5px"
  }
};


//container for all of the components of the Demo page
export default class DemoPage extends Component{
  render(){
    var styles = this.constructor.styles;
    return(
      <div style={styles.page}>
        <p>Press and Hold the Popped Image to compare to the original</p>
        <DemoPane before="./img/bears-before.png" after="./img/bears-after.png"/>
        <DemoPane before="./img/building-before.png" after="./img/building-after.png"/>
        <DemoPane2 before="./img/bears-before.png" after="./img/bears-after.png"/>
        <DemoPane2 before="./img/building-before.png" after="./img/building-after.png"/>
        <DemoPane3 before="./img/bears-before.png" after="./img/bears-after.png"/>
        <DemoPane3 before="./img/building-before.png" after="./img/building-after.png"/>
      </div>
    );
  }
}

DemoPage.styles = {
  page: {
    textAlign: "center"
  }
}

ReactDOM.render(
    <DemoPage/>,
    document.getElementById('app')
);

