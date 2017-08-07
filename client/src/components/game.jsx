import React from 'react';
// import gamedata from '';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = { // dummy data
      players: ['BOARD', 'Player1', 'Player2', 'Player3', 'Player4'],
      tiles: [0, 1, 2, 3, 4, 5],
      settlements: ['mycity'],
      roads: ['myroad']
    }

    this.buy = this.buy.bind(this);
  }

  buy(item) {
    console.log('Game: ', this.state.player[0], ' wants to buy: ', item);
  }

  componentDidMount() {
    console.log('Game: component mounted.');
  }


  render() {
    <div>
    <h2>Now in-game (game.jsx Componen)t</h2>
    <Playerinterface gamestate={this.state} buymethod={this.buy}/>
    <Messagelog gamestate={this.state} />
    <Boardview gamestate={this.state} />

    </div>
  }


}


export default Game;
