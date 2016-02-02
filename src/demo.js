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
    return (
      <div>
        <img src={before}/>
        <img src={after}/>
      </div>
    );
  }
}


ReactDOM.render(
  <DemoPane before="./img/bears-before.png" after="./img/bears-after.png"/>,
  document.getElementById('app')
);

