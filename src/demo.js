import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class DemoPane extends Component {
  static propTypes = {
    before: PropTypes.string,
    after: PropTypes.string,
    pressed: PropTypes.bool
  };

  static defaultProps = {
    before: '',
    after: '',
    pressed: false
  };

  handleClick() {
    this.setState({pressed: !this.state.pressed});
  };

  render() {
    var { before, after, pressed } = this.props;
    var styles = this.constructor.styles;
    var pic = {pressed}? {before} : {after};
    return (
      <div>
        <div style={styles.picContainer}>
          <img style={styles.pic} src={before}/>
        </div>
        <div style={styles.picContainer}>
          <img style={styles.pic} src={pic} />
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

