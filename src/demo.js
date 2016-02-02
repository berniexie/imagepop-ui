import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class DemoPane extends Component {
  static propTypes = {
    before: PropTypes.string,
    after: PropTypes.string
  };

  static defaultProps = {
    before: '',
    after: ''
  };

  render() {
    const { before, after } = this.props;
    var styles = this.constructor.styles;
    return (
      <div>
        <div style={styles.picContainer}>
          <img style={styles.pic} src={before}/>
        </div>
        <div style={styles.picContainer}>
          <img style={styles.pic} src={after}/>
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

