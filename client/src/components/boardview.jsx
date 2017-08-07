import React from 'react';

class Boardview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate
    }
  }

  componentWillReceiveProps(nextprops) {
    console.log('Boardview: compWillReceiveProps:', nextprops);
    this.setState({
      // slotnumber: this.props.number,
      readyState: nextprops.ready,
      log: nextprops.record
    });
  }
  

  render() {
    return (
      <div>
        <h3>View of the board:</h3>
        <div>{JSON.stringify(this.props.gamestate)}</div>
      </div>
    )
  }

}

export default Boardview;
