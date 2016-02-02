import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

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
          <img style={styles.pic} src={pic} onClick={this.handleClick.bind(this)}/>
        </div>
      </div>
    );
  }
}

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

ReactDOM.render(
  <DemoPane before="./img/bears-before.png" after="./img/bears-after.png"/>,
  document.getElementById('app')
);

