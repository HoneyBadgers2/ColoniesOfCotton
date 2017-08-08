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
    console.log(this.props.gamestate);
    return (
      <div>
        <h3>View of the board:</h3>
        <h4>Players:</h4>
        {this.state.gamestate.players.map(player => {
          return (
            <div>
              <div key={player.id}>{JSON.stringify(player)}</div>
            </div>
          )
        })}
        <h4>Tiles:</h4>
        {this.state.gamestate.tiles.map(tile => {
          return (
            <div>
              <div key={tile.id}>{JSON.stringify(tile)}</div>
            </div>
          )
        })}

        <h4>Settlements:</h4>
        {this.state.gamestate.settlements.map(settlement => {
          return (
            <div>
              <div key={settlement.id}>{JSON.stringify(settlement)}</div>
            </div>
          )
        })}

        <h4>Roads:</h4>
        {this.state.gamestate.roads.map(road => {
          return (
            <div>
              <div key={road.id}>{JSON.stringify(road)}</div>
            </div>
          )
        })}

      </div>
    )
  }

}

export default Boardview;
