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
      gamestate: nextprops.gamestate
    });
  }
  

  render() {
    // console.log(this.props.gamestate);
    return (
      <div>
        <h3>View of the board:</h3>
        <h4>Players:</h4>
        {this.state.gamestate.players.map((player, index) => {
          return (
              <div key={index}>{JSON.stringify(player)}</div>
          )
        })}
        <h4>Tiles:</h4>
        {this.state.gamestate.tiles.map((tile, index) => {
          return (
              <div key={index}>{JSON.stringify(tile)}</div>
          )
        })}

        <h4>Settlements:</h4>
        {this.state.gamestate.settlements.map((settlement, index) => {
          return (
              <div key={index}>{JSON.stringify(settlement)}</div>
          )
        })}

        <h4>Roads:</h4>
        {this.state.gamestate.roads.map((road, index) => {
          return (
              <div key={index}>{JSON.stringify(road)}</div>
          )
        })}

      </div>
    )
  }

}

export default Boardview;
