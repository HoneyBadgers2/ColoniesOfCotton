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
      settlements: [],
      roads: [],
      messages: [],
      active: false,
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
    let ownedRoads = this.state.identity.owns_road;
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
    let ownedRoads = this.state.identity.owns_road;
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





  // dice_roll_regular() {
  //   let die_1_result = Math.floor(Math.random() * 6) + 1;
  //   let die_2_result = Math.floor(Math.random() * 6) + 1;
  //   console.log('dice rolled, results: ', die_1_result, die_2_result);

  //   // TODO: update board with roll result

  //   if (dice_roll === 7) {
  //     for (let i = 1; i < 5; i++) {
  //       if (resource_cards_in_hand(player[i]) > 7) {
  //         discard_half(player[i]);
  //         // move robber and steal 
  //       }
  //     }
  //   } else {
  //     collect_resources(die_1_result + die_2_result);
  //   }

  // }




  // collect_resources(rollResult) {
  //   for (let i = 0; i < this.state.tiles.length; i++) {
  //     // if tile has roll value, the houses of that tile receive resources.
  //     if (this.state.tiles[i].roll_trigger_value === rollResult) {
  //       // check tile's house slots for owners
  //       for (let j = 0; j < 6; j++) {
  //         // TODO: check for edge case such as "not enough resources"
  //         if (this.state.tiles[i].corner[j].owner !== null) {
  //           let amountToReceive = corner // TODO: incomplete line here
  //           let resourceRecepient = this.state.tiles[i].corner[j].owner;
  //           let resourceToCollect = 'card_' + this.state.tiles[i].terrain;
  //           console.log(resourceRecepient + ' receives ' + amountToReceive + ' ' + resourceToCollect + '(s)');
  //           this.state.players[0][resourceToCollect]--
  //           this.state.players[resourceRecepient][resourceToCollect]++
  //         }
  //       }
  //     }
  //   }
  // }





  calculateScore() {
    let score = this.state.player[this.state.identity].played_card_victory + this.state.player[this.state.identity].owns_settlement.length + (2 * this.state.player[this.state.identity].owns_city.length);

    if (this.state.player[this.state.identity].has_longest_road) {
      score = score + 2;
    }
      
    if (this.state.player[this.state.identity].has_biggest_army) {
      score = score + 2;
    }

    if (score >= 10) {
      console.log('Player ' + this.state.identity + ' has reached 10 points!');
      // endGame(); // need to write this function
    }
    
    // return the score visible to others
    return score - player.card_victory;
  }



  canBuyRoad() {
    let possibleRoads = findPossibleRoads();

    // check if affordable && piece available && there is a valid spot available
    if (this.state.player[this.state.identity].card_brick >= 1 && 
      this.state.player[this.state.identity].card_lumber >= 1 && 
      this.state.player[this.state.identity].owns_road.length < 14 && 
      possibleRoads.length > 0) {
        return true;
      }
      return false;
  }

  canBuySettlement() {
    let possibleSettlements = findPossibleSettlements();

    // check if affordable && piece available && there is a valid spot available
    if (this.state.player[this.state.identity].card_brick >= 1 && 
      this.state.player[this.state.identity].card_lumber >= 1 && 
      this.state.player[this.state.identity].card_grain >= 1 && 
      this.state.player[this.state.identity].card_wool >= 1 && 
      this.state.player[this.state.identity].owns_settlement.length < 5 && 
      possibleSettlements.length > 0) {
        return true;
      }
      return false;
  }

  canBuyCity() {
    return (this.state.player[this.state.identity].card_ore >= 3 && 
      this.state.player[this.state.identity].card_grain >= 2 && 
      this.state.player[this.state.identity].owns_city.length < 4 && 
      this.state.player[this.state.identity].owns_settlement.length > 0);
  }

  canBuyDevelopmentCard() {
    return (this.state.player[this.state.identity].card_ore >= 1 && 
      this.state.player[this.state.identity].card_grain >= 1 && 
      this.state.player[this.state.identity].card_wool >= 1);
  }

  canOfferTrade() {
    return (this.state.player[this.state.identity].card_brick >= 1 || 
      this.state.player[this.state.identity].card_lumber >= 1 || 
      this.state.player[this.state.identity].card_grain >= 1 || 
      this.state.player[this.state.identity].card_wool >= 1 || 
      this.state.player[this.state.identity].card_ore >= 1);
  }

  canPlayCardKnight() {
    return (!this.state.player[this.state.identity].has_played_development_card && this.state.player[this.state.identity].card_knight >= 1);
  }

  canPlayCardRoad() {
    return (!this.state.player[this.state.identity].has_played_development_card && this.state.player[this.state.identity].card_road >= 1);
  }

  canPlayCardMonopoly() {
    return (!this.state.player[this.state.identity].has_played_development_card && this.state.player[this.state.identity].card_monopoly >= 1);
  }

  canPlayCardPlenty() {
    return (!this.state.player[this.state.identity].has_played_development_card && this.state.player[this.state.identity].card_plenty >= 1);
  }

  canPlayCardVictory() {
    return (this.state.player[this.state.identity].card_victory >= 1);
  }

  // canCancelAction() {
  //   return this.state.player[this.state.identity].isInMenu ? true : false;
  // }

  // canRollDice() {
  //   return this.state.player[this.state.identity].hasRolled ? false : true;
  // }



/////////////////////////// END HELPER FUNCTIONS ///////////////////////////

  componentDidMount() {
    this.socket = io('/');

    this.socket.on('start', body => {
      console.log('start trigger heard');
      this.setState({players: body.players, tiles: body.tiles, settlements: body.settlements, roads: body.roads});
      if(this.state.identity === 1){
        this.setState({active: true})
      }
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
    <button onClick={this.rollForFirst}>ROLL FOR FIRST</button>
    {this.state.active ? <Playerinterface gamestate={this.state} diceRoll={this.diceRoll} buymethod={this.buy} endTurn={this.endTurn}/> : null}
    <Messagelog  messages={this.state.messages} handleSubmitMessage={this.handleSubmitMessage}/>
    <Boardview gamestate={this.state} />
    
    </div>)
  }


}


export default Game;
