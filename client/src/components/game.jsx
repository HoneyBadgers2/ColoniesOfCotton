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
    }

    this.buy = this.buy.bind(this);
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
    this.diceRoll = this.diceRoll.bind(this);
    this.endTurn = this.endTurn.bind(this);
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

  componentDidMount() {
    console.log('Game: component mounted.');
    this.socket = io('/');

    this.socket.on('start', body => {
      console.log('start trigger heard');
      this.setState({players: body.players, tiles: body.tiles, settlements: body.settlements, roads: body.roads});
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
  }

  handleSubmitMessage(event){
    let body = event.target.value;
    
    if(event.keyCode === 13){
      console.log('running');
      this.socket.emit('message', body);
      event.target.value = '';
    }
  }

  verifyCorner(cornerId) {
    let allSettlements = this.state.settlements;
    let allRoads = this.state.roads;
    let adjacentCorners = allSettlements[cornerId].adj_house_slots;

    if(allSettlements[cornerId].owner !== null){
      return false
    }

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
    let adjacentCorners = allSettlements[cornerId].connecting_house_slots;
    let adjacentRoads = allSettlements[cornerId].adj_road_slots;

    if(allRoads[roadId].owner !== null){
      return false;
    }




    for(let i = 0; i < adjacentCorners.length; i++){
      let index = adjacentCorners[i];
      if(allSettlements[index].owner === null || allSettlements[index].owner === this.state.identity){
        for(let j = 0; j < allSettlements[index].adj_road_slots; j++){
         let roadIndex = allSettlements[index].adj_road_slots[j];
         if(allSetllements[roadIndex].owner === this.state.identity){
           return true
         }
        }
      }
    }

    return false;
  }


  render() {
    return(<div>
    <h2>Now in-game (game.jsx Component)</h2>
    {this.state.active ? <Playerinterface gamestate={this.state} diceRoll={this.diceRoll} buymethod={this.buy} endTurn={this.endTurn}/> : null}
    <Messagelog  messages={this.state.messages} handleSubmitMessage={this.handleSubmitMessage}/>
    <Boardview gamestate={this.state} />

    </div>)
  }


}


export default Game;
