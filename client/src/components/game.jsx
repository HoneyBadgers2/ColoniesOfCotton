import React from 'react';
import io from 'socket.io-client';
import Playerinterface from './playerinterface';
import Messagelog from './messagelog';
import Boardview from './boardview';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = { // dummy data
      identity: 1,
      players: ['BOARD', 'Player1', 'Player2', 'Player3', 'Player4'],
      tiles: [0, 1, 2, 3, 4, 5],
      settlements: ['mycity'],
      roads: ['myroad'],
      messages: [],
      active: false,
      firstTurn: false,
      firstHouse: null,
    }

    this.buy = this.buy.bind(this);
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
    this.diceRoll = this.diceRoll.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.rollForFirst = this.rollForFirst.bind(this);
  }
  
  rollForFirst(){
    let dice1 = Math.floor(Math.random() * 6 + 1);
    let dice2 = Math.floor(Math.random() * 6 + 1);
    let total = dice1 + dice2
    var obj = {player: this.state.identity, roll: total}
    this.socket.emit('firstRoll', obj);
    this.setState({firstTurn: false});
  }

  buy(item) {
    console.log('Game: ', this.state.player[0], ' wants to buy: ', item);
  }

  endTurn() {
    let nextPlayer;
    if(this.state.identity !== 4){
      nextPlayer = this.state.identity + 1;
    } else {
      nextPlayer = 1;
    }
    this.setState({active: false});
    console.log('nextPlayer is', nextPlayer);
    this.socket.emit('endTurn', nextPlayer);
  }



  diceRoll(){
    let dice1 = Math.floor(Math.random() * 6 + 1);
    let dice2 = Math.floor(Math.random() * 6 + 1);
    let total = dice1 + dice2
    this.socket.emit('diceRoll', total);
  }


  handleSubmitMessage(event){
    let body = event.target.value;
    
    if(event.keyCode === 13){
      console.log('running');
      this.socket.emit('message', body);
      event.target.value = '';
    }
  }
//////////////////////////////// HELPER FUNCTIONS ////////////////////////////////
  verifyCorner(cornerId) {
    if(this.state.settlements[cornerId].owner !== null){
      return false
    }

    const adjCorners = getAdjCornersToCorner(cornerId);
    const adjRoads = getAdjRoadsToCorner(cornerId);

    for(let i = 0; i < adjCorners.length; i++){
      if(adjCorners[i].owner !== null){
        return false;
      }
    }

    for(let i = 0; i < adjRoads.length; i++){
      if(adjRoads[i].owner === this.state.identity){
        return true;
      }
    }

    return false;
  }


  verifyRoad(roadId){
    const adjRoads = getAdjRoadsToRoad(roadId);
    for(let i = 0; i < adjRoads.length; i++){
      if(adjRoads[i].owner === this.state.identity){
        let common = getCommonCornerToTwoRoads(adjRoads[i].id, roadId);
        if(common.owner === this.state.identity || common.owner === null){
          return true;
        }
      }
    }
    return false;
  }

  getAdjCornersToCorner(cornerId){
    let arr = this.state.settlements[cornerId].adj_house_slots;
    let output = [];
    for(var i = 0; i < arr.length; i++){
      output.push(this.state.settlements[arr[i]]);
    }
    return output;
  }

  getAdjRoadsToCorner(cornerId){
    let arr = this.state.settlements[cornerId].connecting_road_slots;
    let output = [];
    for(let i = 0; i < arr.length; i++){
      output.push(this.state.roads[arr[i]]);
    }
    return output;
  }

  getAdjCornerToRoad(roadId){
    let arr = this.state.roads[roadId].connecting_house_slots;
    let output = [];
    for(let i = 0; i < arr.length; i++){
      output.push(this.state.settlements[arr[i]]);
    }
    return output;
  }

  getAdjRoadsToRoad(roadId){
    let arr = this.state.roads[roadId].adj_road_slots;
    let output = [];
    for(let i = 0; i < arr.length; i++){
      output.push(this.state.settlements[arr[i]]);
    }
    return output;
  }

  getCommonCornerToTwoRoads(road1, road2){
    let firstCorners = this.state.roads[road1].connecting_house_slots;
    let secondCorners = this.state.roads[road2].connecting_house_slots;

    for(let i = 0; i < firstCorners.length; i++){
      if(secondCorners.indexOf(firstCorners[i]) !== -1){
        return this.state.settlements[firstCorners[i]];
      }
    }
  }

  findPossibleRoads() {
    // determine Roads that are valid for this player, returns an array
    let allRoads = this.state.roads;
    let ownedRoads = this.state.owns_road;
    let possibleRoads = [];

    for (let i = 0; i < ownedRoads.length; i ++) {
      for (let j = 0; j < allRoads[ownedRoads[i]].adj_road_slots.length; j++ ) {
        if (verifyRoad(allRoads[ownedRoads[i]].adj_road_slots[j])) {
          for (let k = 0; k < possibleRoads.length; k++) {
            if (possibleRoads[k].id === allRoads[ownedRoads[i]].adj_road_slots[j]) {
              console.log('road already in possibleRoads');
              continue;
            }
          }
          possibleRoads.push(allRoads[ownedRoads[i]].adj_road_slots[j]);
        }
      }
    }

    return possibleRoads;
  }

  findPossibleSettlements() {
    // determine HouseSlots that are valid for this player, returns an array
    let allRoads = this.state.roads;
    let ownedRoads = this.state.owns_road;
    let possibleSettlements = [];

    for (let i = 0; i < ownedRoads.length; i ++) {
      for (let j = 0; j < allRoads[ownedRoads[i]].connecting_house_slots.length; j++ ) {
        if (verifyCorner(allRoads[ownedRoads[i]].connecting_house_slots[j])) {
          for (let k = 0; k < possibleSettlements.length; k++) {
            if (possibleSettlements[k].id === allRoads[ownedRoads[i]].connecting_house_slots[j]) {
              console.log('settlement already in possibleSettlements');
              continue;
            }
          }
          possibleSettlements.push(allRoads[ownedRoads[i]].connecting_house_slots[j]);
        }
      }
    }

    return possibleSettlements;
  }



/////////////////////////// END HELPER FUNCTIONS ///////////////////////////

  componentDidMount() {
    console.log('Game: component mounted.');
    this.socket = io('/');

    this.socket.on('start', body => {
      console.log('start trigger heard');
      this.setState({players: body.players, tiles: body.tiles, settlements: body.settlements, roads: body.roads});
      this.setState({firstTurn: true})
    })

    this.socket.on('identity', identity => {
      console.log('identity trigger heard', identity);
      this.setState({identity: identity})
    })

    this.socket.on('message', body =>{
      console.log('receiving messages');
      this.setState({messages: [...this.state.messages, body]})
    })

    this.socket.on('diceRoll', total => {
      console.log('Player rolled a', total);
    })

    this.socket.on('endTurn', active => {
      console.log('hearing END TURN', active);
      if(active === this.state.identity){
        this.setState({active: true});
        console.log('ITS YOUR TURN!!!!!!!!!!');
      }
    })

    this.socket.on('first', player => {
      console.log('starting player is', player);
    })
  }





  render() {
    return(<div>
    <h2>Now in-game (game.jsx Component)</h2>
    {this.state.firstTurn ? <button onClick={this.rollForFirst}>RollDice</button> : null}
    {this.state.active ? <Playerinterface gamestate={this.state} diceRoll={this.diceRoll} buymethod={this.buy} endTurn={this.endTurn}/> : null}
    <Messagelog  messages={this.state.messages} handleSubmitMessage={this.handleSubmitMessage}/>
    <Boardview gamestate={this.state} />
    
    </div>)
  }


}


export default Game;
