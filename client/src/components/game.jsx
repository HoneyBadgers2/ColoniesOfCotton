import React from 'react';
// import gamedata from '';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = { // dummy data
      identity: "Player1",
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

  verifyCorner(cornerId) {
    let allSettlements = this.state.settlements;
    let allRoads = this.state.roads;
    let adjacentCorners = allSettlements[cornerId].adj_house_slots;

    for(let i = 0; i < adjacentCorners.length; i++){
      let house = allSettlements[adjacentCorners[i]]
      if(house.owner !== null){
        return false;
      }
    }

    let adjacentRoads = allSettlements[cornerId].adj_road_slots;
    for(let i = 0; i < adjacentRoads.length; i++){
      let road = allRoads[adjacentRoads[i]];
      if(road.owner === this.state.identity){
        return true;
      }
    }

    return false;
  }

  verifyRoad(roadId){
    let allSettlements = this.state.settlements;
    let allRoads = this.state.roads;
    let adjacentCorners = allSettlements[cornerId].adj_house_slots;
    let adjacentRoads = allSettlements[cornerId].adj_road_slots;

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
