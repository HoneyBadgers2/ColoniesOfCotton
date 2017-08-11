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
      gamestate: nextprops.gamestate
    });
  }
  

  render() {
    return (
      <div>
        <h3>View of the board:</h3>
        <h4>Players:</h4>
        {this.state.gamestate.players.map((player, index) => {
          return (
              <div key={index}>
                <h6>Player Number </h6>
                <div>{JSON.stringify(player.user_number_label)}</div>
                <br></br>

                <h6>Player Resources </h6>
                <div>{'Brick: ' + JSON.stringify(player.card_brick) + ', Grain: ' + JSON.stringify(player.card_grain) + ', Lumber: ' + JSON.stringify(player.card_lumber) + ', Ore: ' + JSON.stringify(player.card_ore)+ ', Wool: ' + JSON.stringify(player.card_wool)}</div>
                <br></br>

                <div>Player Dev Cards </div>
                <div>{'Knight: ' + JSON.stringify(player.card_knight) + ', Road: ' + JSON.stringify(player.card_road) + ', Monopoly: ' + JSON.stringify(player.card_monopoly) + ', Plenty: ' + JSON.stringify(player.card_plenty)+ ', Victory: ' + JSON.stringify(player.card_victory)}</div>
                <br></br>

                <div>Property Owned </div>
                <div>{'Roads: ' + JSON.stringify(player.owns_road) + ', Settlements: ' + JSON.stringify(player.owns_settlement) + ', Cities: ' + JSON.stringify(player.owns_city)}</div>
                <br></br>

                <div>Other States</div>
                <div>{'player.id: ' + player.id}</div>
                <div>{'player.game_session_id: ' + player.game_session_id}</div>
                <div>{'player.played_card_knight: ' + player.played_card_knight}</div>
                <div>{'player.played_card_road: ' + player.played_card_road}</div>
                <div>{'player.played_card_monopoly: ' + player.played_card_monopoly}</div>
                <div>{'player.played_card_plenty: ' + player.played_card_plenty}</div>
                <div>{'player.played_card_victory: ' + player.played_card_victory}</div>
                <div>{'player.has_longest_road: ' + player.has_longest_road}</div>
                <div>{'player.has_biggest_army: ' + player.has_biggest_army}</div>
                <div>{'player.display_name: ' + player.display_name}</div>
                <div>{'player.turn_order: ' + player.turn_order}</div>
                <div>{'player.turn_counter: ' + player.turn_counter}</div>
                <div>{'player.is_active_player: ' + player.is_active_player}</div>
                <div>{'player.has_played_development_card: ' + player.has_played_development_card}</div>
                <div>{'player.player_points: ' + player.player_points}</div>
              </div>
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
