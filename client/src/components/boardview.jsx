import React from 'react';

class Boardview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate
    }
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      // slotnumber: this.props.number,
      readyState: nextprops.ready,
      log: nextprops.record
    });
  }
  

  render() {
    console.log(this.props.gamestate);
    return (
      <div>
        <h3>View of the board:</h3>
      </div>
    )
  }

}

export default Boardview;
