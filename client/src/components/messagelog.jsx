import React from 'react';

class Messagelog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate
    }
  }

  componentWillReceiveProps(nextprops) {
    console.log('Messagelog: compWillReceiveProps:', nextprops);
  }
  

  render() {
    return (
      <div>
        <h3>Message Log</h3>
        <div>some messages here</div>
        <div>some messages here</div>
        <div>some messages here</div>
        <div>some messages here</div>
      </div>
    )
  }

}

export default Messagelog;
