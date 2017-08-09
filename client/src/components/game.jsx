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
      room: null,
      players: ['BOARD', 'Player1', 'Player2', 'Player3', 'Player4'],
      tiles: [0, 1, 2, 3, 4, 5],
      settlements: [],
      roads: [],
      messages: [],
      active: false,
      turn: 0,
      moveRobber: false,
      robber: false,
      robbedTile: null,
      ableToBuyRoad: false,
      ableToBuySettlement: false,
      ableToBuyCity: false,
      ableToBuyDevelopmentCard: false,
      ableToOfferTrade: false,
      ableToPlayCardKnight: false,
      ableToPlayCardRoad: false,
      ableToPlayCardMonopoly: false,
      ableToPlayCardPlenty: false,
      ableToPlayCardVictory: false,
      ableToCancelAction: false,
      hasRolled: false
    }

    this.rollForFirst = this.rollForFirst.bind(this);
    this.makePurchase = this.makePurchase.bind(this);
    this.startTrade = this.startTrade.bind(this);
    this.playCard = this.playCard.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.diceRoll = this.diceRoll.bind(this);
    this.robber = this.robber.bind(this);
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
    this.verifyCorner = this.verifyCorner.bind(this);
    this.verifyRoad = this.verifyRoad.bind(this);
    this.getAdjCornersToCorner = this.getAdjCornersToCorner.bind(this);
    this.getAdjRoadsToCorner = this.getAdjRoadsToCorner.bind(this);
    this.getAdjCornerToRoad = this.getAdjCornerToRoad.bind(this);
    this.getAdjRoadsToRoad = this.getAdjRoadsToRoad.bind(this);
    this.getCommonCornerToTwoRoads = this.getCommonCornerToTwoRoads.bind(this);
    this.findPossibleRoads = this.findPossibleRoads.bind(this);
    this.findPossibleSettlements = this.findPossibleSettlements.bind(this);
    this.calculateScore = this.calculateScore.bind(this);
    this.canBuyRoad = this.canBuyRoad.bind(this);
    this.canBuySettlement = this.canBuySettlement.bind(this);
    this.canBuyCity = this.canBuyCity.bind(this);
    this.canBuyDevelopmentCard = this.canBuyDevelopmentCard.bind(this);
    this.canOfferTrade = this.canOfferTrade.bind(this);
    this.canPlayCardKnight = this.canPlayCardKnight.bind(this);
    this.canPlayCardRoad = this.canPlayCardRoad.bind(this);
    this.canPlayCardMonopoly = this.canPlayCardMonopoly.bind(this);
    this.canPlayCardPlenty = this.canPlayCardPlenty.bind(this);
    this.canPlayCardVictory = this.canPlayCardVictory.bind(this);

    this.cheatTakeControl = this.cheatTakeControl.bind(this);
    this.cheatMoveRobber = this.cheatMoveRobber.bind(this);
    this.cheatMaxResource = this.cheatMaxResource.bind(this);
    this.cheatMaxDev = this.cheatMaxDev.bind(this);

  }
  
  rollForFirst(){
    let dice1 = Math.floor(Math.random() * 6 + 1);
    let dice2 = Math.floor(Math.random() * 6 + 1);
    let total = dice1 + dice2
    var obj = {player: this.state.identity, roll: total}
    this.socket.emit('firstRoll', obj);
    this.setState({firstTurn: false});
  }

  makePurchase(item) {
    console.log('Game: Player', this.state.players[this.state.identity].id, 'wants to:', item);
    if (item === 'buyroad') {
      let possibleRoadSlots = findPossibleRoads()
      if (possibleRoadSlots.length > 0) {
        let roadId;
        //display textform for input
          //roadId = userinput

        // emit for all 4 players to update
        let allPlayers = this.state.players;
        allPlayers[this.state.identity].card_brick--
        allPlayers[this.state.identity].card_lumber--
        allplayers[this.state.identity].owns_road.push(roadId);
        let allRoads = this.state.roads;
        allRoads[roadId].owner = this.state.identity;
          this.setState({
            players: allPlayers,
            roads: allroads
          })
      }
      
    } else if (item === 'buysettlement') {
      let possibleSettlementSlots = findPossibleSettlements()
      if (possibleSettlementSlots.length > 0) {
        let settlementId;
        //display textform for input
          //settlementId = userinput

        // emit for all 4 players to update
        let allPlayers = this.state.players;
        allPlayers[this.state.identity].card_brick--
        allPlayers[this.state.identity].card_lumber--
        allPlayers[this.state.identity].card_grain--
        allPlayers[this.state.identity].card_wool--
        allplayers[this.state.identity].owns_settlement.push(settlementId);
        let allSettlements = this.state.settlements;
        allSettlements[settlementId].owner = this.state.identity;
        this.setState({
          players: allPlayers,
          settlements: allSettlements
        })
      }

    } else if (item === 'buycity') {
      let allPlayers = this.state.players;
      let possibleCities = allPlayers[this.state.identity].owns_settlement;
      let allHouses = this.state.settlements;
      let houseId;
      //display form for input
        //cityId = userinput

      // emit for all 4 players to update
      allPlayers[this.state.identity].owns_settlement; // slice settlement out of owns_settlement, it's becoming a city
      allPlayers[this.state.identity].owns_city.push(houseId);
      this.setState({
        players: allPlayers,
        settlements: allHouses
      })

    } else if (item === 'buydevelopmentcard') {
      //build array of development cards
      //check lenght of array
      //increment player's card count
      //decrement board card
      //emit
    }
  }

  startTrade() {
    console.log('Game: Player', this.state.players[this.state.identity].id, 'wants to: trade');
    //display input form for desired resources
    //display input form for resources to give
    //await response from other users?
  }

  playCard(item) {
    console.log('Game: Player', this.state.players[this.state.identity].id, 'wants to:', item);
    if (item === 'playcardknight') {
      let allPlayers = this.state.players
      allPlayers[this.state.identity].card_knight--
      allPlayers[this.state.identity].played_card_knight++
      this.setState({
        players: allPlayers
      })
      let tileId;
      //inputform to set tileId to input
        //if input value's tile has robber already, reject
      let allTiles = this.state.tiles
      allTiles['TILE ID OF ORIGINAL ROBBER'].has_robber = false;
      allTiles[tileId].has_robber = true;
      //emit

            //list possible players to steal from
      //display input form (target player)
      //invoke eventRobberSteal
      //emit

    } else if (item === 'playcardroad') {
      let possibleRoadSlots = findPossibleRoads()
      if (possibleRoadSlots.length > 0) {
        //set a cardroadplayed counter = 0
        //display possible roads
        //display input form for a road (roadId)
        //set ownership on players
        //set ownership on roads
        //set a cardroadplayed counter = 1
        //emit
        possibleRoadSlots = findPossibleRoads()
        if (possibleRoadSlots.length > 0) {
          //display possible roads
          //display input form for a road (roadId)
          //set ownership on players
          //set ownership on roads
          //set a cardroadplayed counter = 2 (done with road placing process)
          //emit
        } else {
          //set a cardroadplayed counter = 2 (done with road placing process)
        }

      }

      this.state.roadCardCounter = 0
      let allPlayers = this.state.players
      allPlayers[this.state.identity].card_road--
      allPlayers[this.state.identity].played_card_road++
      allplayers[this.state.identity].owns_road.push(roadId);
      let allRoads = this.state.roads;
      allRoads[roadId].owner = this.state.identity;
      this.state.roadCardCounter = 1


      
    } else if (item === 'playcardmonopoly') {
      let allPlayers = this.state.players
      allPlayers[this.state.identity].card_monopoly--
      allPlayers[this.state.identity].played_card_monopoly++
      //display input form for resource (select one resource)
      //calculate resources of other players
      //set those resources = 0
      //increment player's resources by that sum
      //emit
    } else if (item === 'playcardplenty') {
      let allPlayers = this.state.players
      allPlayers[this.state.identity].card_plenty--
      allPlayers[this.state.identity].played_card_plenty++
      //display input form for resources (up to 2)
      //decrement board's resources
      //increment player's resources
      //emit
    } else if (item === 'playcardvictory') {
      let allPlayers = this.state.players
      allPlayers[this.state.identity].card_victory--
      allPlayers[this.state.identity].played_card_victory++
      calculateScore();
      //emit
    }
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
    let obj = {};
    obj.room = this.state.room;
    obj.player = this.state.identity;
    obj.total = total;
    this.socket.emit('diceRoll', obj);
  }

  moveRobber(event){
    if(this.state.moveRobber){
      let obj = {
        tile: event.target.value,
        room: this.state.room
      }
      this.state.moveRobber = false;
      this.state.robber = true;
      this.socket.emit('moveRobber', obj)
    }
  }

  robber(event){
    if(this.state.robber){
      let index = this.state.robbedTile;
      let tile = this.state.tiles[index];
      let corners = this.state.tiles.connecting_house_slots
      let arr = [];

      for(let x = 0; x < corners.length; x++){
        let corner = this.state.tiles[corners[x]];

        if(corner.owner){
         arr.push(corner.owner);
        }
      }

      if(arr.indexOf(event.target.value) !== -1){
        let target = this.state.players[event.target.value]
        let available = [];
        if(target.card_brick){
          available.push('card_brick');
        }

        if(target.card_wool){
          available.push('card_wool');
        }

        if(target.card_lumber){
          available.push('card_lumber');
        }

        if(target.card_grain){
          available.push('card_grain');
        }

        if(target.card_ore){
          available.push('card_ore');
        }

        let RNG = Math.floor(Math.random() * available.length);
        let resource = available[RNG];
        let obj ={};
        obj.room = this.state.room;
        obj.resource = resource;
        obj.target = event.target.value;
        obj.player = this.state.identity;
        this.socket.emit('rob', obj)
      }
    }
  }


  handleSubmitMessage(event){
   let obj = {
     user: this.state.identity,
     room: this.state.room,
     text: event.target.value
   }
    
    if(event.keyCode === 13){
      this.socket.emit('message', obj);
      event.target.value = '';
    }
  }
//////////////////////////////// HELPER FUNCTIONS ////////////////////////////////
  verifyCorner(cornerId) {
    if(this.state.settlements[cornerId].owner !== null){
      return false
    }

    const adjCorners = this.getAdjCornersToCorner(cornerId);
    const adjRoads = this.getAdjRoadsToCorner(cornerId);

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
    const adjRoads = this.getAdjRoadsToRoad(roadId);
    for(let i = 0; i < adjRoads.length; i++){
      if(adjRoads[i].owner === this.state.identity){
        let common = this.getCommonCornerToTwoRoads(adjRoads[i].id, roadId);
        if(common.owner){
          if(common.owner === this.state.identity || common.owner === null){
            return true;
          }
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
      output.push(this.state.roads[arr[i]]);
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
    let ownedRoads = this.state.players[this.state.identity].owns_road;
    let possibleRoads = [];
    for (let i = 0; i < ownedRoads.length; i ++) {
      for (let j = 0; j < allRoads[ownedRoads[i]].adj_road_slots.length; j++ ) {
        if (this.verifyRoad(allRoads[ownedRoads[i]].adj_road_slots[j])) {
          let road = allRoads[ownedRoads[i]].adj_road_slots[j];
          if(possibleRoads.indexOf(road) === -1){
            possibleRoads.push(road);
          }
        }
      }
    }

    return possibleRoads;
  }

  findPossibleSettlements() {
    // determine HouseSlots that are valid for this player, returns an array
    let allRoads = this.state.roads;
    let ownedRoads = this.state.players[this.state.identity].owns_road;
    let possibleSettlements = [];

    for (let i = 0; i < ownedRoads.length; i ++) {
      for (let j = 0; j < allRoads[ownedRoads[i]].connecting_house_slots.length; j++ ) {
        if (this.verifyCorner(allRoads[ownedRoads[i]].connecting_house_slots[j])) {
          let corner = allRoads[ownedRoads[i]].connecting_house_slots[j];
          if(possibleSettlements.indexOf(corner) === -1){
           possibleSettlements.push(allRoads[ownedRoads[i]].connecting_house_slots[j]);
          }
        }
      }
    }

    return possibleSettlements;
  }

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
    let possibleRoads = this.findPossibleRoads();

    // check if affordable && piece available && there is a valid spot available
    if (this.state.players[this.state.identity].card_brick >= 1 && 
      this.state.players[this.state.identity].card_lumber >= 1 && 
      this.state.players[this.state.identity].owns_road.length < 14 && 
      possibleRoads.length > 0) {
        return true;
      }
      return false;
  }

  canBuySettlement() {
    let possibleSettlements = this.findPossibleSettlements();
    console.log(possibleSettlements);

    // check if affordable && piece available && there is a valid spot available
    if (this.state.players[this.state.identity].card_brick >= 1 && 
      this.state.players[this.state.identity].card_lumber >= 1 && 
      this.state.players[this.state.identity].card_grain >= 1 && 
      this.state.players[this.state.identity].card_wool >= 1 && 
      this.state.players[this.state.identity].owns_settlement.length < 5 && 
      possibleSettlements.length > 0) {
        return true;
      }
      return false;
  }

  canBuyCity() {
    return (this.state.players[this.state.identity].card_ore >= 3 && 
      this.state.players[this.state.identity].card_grain >= 2 && 
      this.state.players[this.state.identity].owns_city.length < 4 && 
      this.state.players[this.state.identity].owns_settlement.length > 0);
  }

  canBuyDevelopmentCard() {
    return (this.state.players[this.state.identity].card_ore >= 1 && 
      this.state.players[this.state.identity].card_grain >= 1 && 
      this.state.players[this.state.identity].card_wool >= 1);
  }

  canOfferTrade() {
    return (this.state.players[this.state.identity].card_brick >= 1 || 
      this.state.players[this.state.identity].card_lumber >= 1 || 
      this.state.players[this.state.identity].card_grain >= 1 || 
      this.state.players[this.state.identity].card_wool >= 1 || 
      this.state.players[this.state.identity].card_ore >= 1);
  }

  canPlayCardKnight() {
    return (!this.state.players[this.state.identity].has_played_development_card && this.state.players[this.state.identity].card_knight >= 1);
  }

  canPlayCardRoad() {
    return (!this.state.players[this.state.identity].has_played_development_card && this.state.players[this.state.identity].card_road >= 1);
  }

  canPlayCardMonopoly() {
    return (!this.state.players[this.state.identity].has_played_development_card && this.state.players[this.state.identity].card_monopoly >= 1);
  }

  canPlayCardPlenty() {
    return (!this.state.players[this.state.identity].has_played_development_card && this.state.players[this.state.identity].card_plenty >= 1);
  }

  canPlayCardVictory() {
    return (this.state.players[this.state.identity].card_victory >= 1);
  }

  // canCancelAction() {
  //   return this.state.players[this.state.identity].isInMenu ? true : false;
  // }

  // canRollDice() {
  //   return this.state.players[this.state.identity].hasRolled ? false : true;
  // }



/////////////////////////// END HELPER FUNCTIONS ///////////////////////////










/////////////////////////// CHEATS ///////////////////////////
/////////////////////////// CHEATS ///////////////////////////

  // remember to bind these functions
  // this.cheatTakeControl = this.cheatTakeControl.bind(this);
  // this.cheatMoveRobber = this.cheatMoveRobber.bind(this);
  // this.cheatMaxResource = this.cheatMaxResource.bind(this);
  // this.cheatMaxDev = this.cheatMaxDev.bind(this);


  cheatTakeControl(event) {
    let slotId = event.target.value;
    let buildingtype = event.target.id;

    if(event.keyCode === 13){
      var temp = this.state.roads;
      temp[slotId].owner = 1;
      console.log(this.state.players[1].owns_road)
      this.state.players[1].owns_road.push(Number(slotId));
      this.setState({
        roads: temp
      })
    }
  }

  cheatMoveRobber() {
    let tileId = event.target.value
    if(event.keyCode === 13){
      this.setState({
        // move robber
      })
    }
  }

  cheatMaxResource() {
    let allPlayerStates = this.state.players
    allPlayerStates[this.state.identity].card_brick = 9999;
    allPlayerStates[this.state.identity].card_grain = 9999;
    allPlayerStates[this.state.identity].card_lumber = 9999;
    allPlayerStates[this.state.identity].card_ore = 9999;
    allPlayerStates[this.state.identity].card_wool = 9999;

    this.setState({
      players: allPlayers
    })
  }

  cheatMaxDev() {
    let allPlayerStates = this.state.players
    allPlayerStates[this.state.identity].card_knight = 9999;
    allPlayerStates[this.state.identity].card_road = 9999;
    allPlayerStates[this.state.identity].card_monopoly = 9999;
    allPlayerStates[this.state.identity].card_plenty = 9999;
    // allPlayerStates[this.state.identity].card_victory = 9999;

    this.setState({
      players: allPlayers
    })
  }


    // <h3>Cheat Mode for Developer
    //   <button id="2" onClick={this.robber}>EventRobberSteal from Player 2</button>
    //   <button id="3" onClick={this.robber}>EventRobberSteal from Player 3</button>
    //   <button id="4" onClick={this.robber}>EventRobberSteal from Player 4</button>
    //   <button onClick={this.cheatMaxResource}>Maxed Resources</button>
    //   <button onClick={this.cheatMaxDev}>Maxed Dev Cards</button>
    //   <input type='text' id="cheatroad" placeholder="Take Road Ownership (RoadSlotId)" onKeyUp={this.cheatTakeControl}/>
    //   <input type='text' id="cheathouse" placeholder="Take House Ownership (HouseSlotId)" onKeyUp={this.cheatTakeControl}/>
    //   <input type='text' id="cheatmoverobber" placeholder="Move Robber (TileId)" onKeyUp={this.cheatMoveRobber}/>
    // </h3>



/////////////////////////// END CHEATS ///////////////////////////
/////////////////////////// END CHEATS ///////////////////////////









  componentDidMount() {
    this.socket = io('/');

    this.socket.on('start', body => {
      console.log('start trigger heard');
      this.setState({room: body.game_session_id, players: body.players, tiles: body.tiles, settlements: body.settlements, roads: body.roads});
      if(this.state.identity === 1){
        this.setState({active: true})
      }
    })

    this.socket.on('rob', obj => {
      let victim = this.state.players[obj.target];
      let crim = this.state.players[obj.player];
      let resource = obj.resource;

      victim[resource] --;
      crim[resource] ++;
      this.setState({turns: this.state.turns++});
    })

    this.socket.on('identity', identity => {
      this.setState({identity: identity})
    })

    this.socket.on('message', body =>{
      this.setState({messages: [...this.state.messages, body]})
    })

    this.socket.on('diceRoll', total => {
      for(var i = 0; i < this.state.tiles.length; i++){
        let tile = this.state.tiles[i];
        if(tile.dice_trigger_value === total){
          for(var j = 0; j < tile.connecting_house_slots.length; j++){
            let index = tile.connecting_house_slots[j];
            let corner = this.state.settlements[index];
            if(corner.owner !== null){
              let board = this.state.players[0];
              let player = this.state.players[corner.owner];
              let resource = tile.terrain;
              let card = "card_"+resource;

              board[card]--;
              player[card]++;
              this.setState({turn: this.state.turn + 1});
              console.log('player' + corner.owner + " now has " + player[card] + resource + "s");
              console.log('board now has ' + board[card] + resource + "s")

                  this.setState({
                    ableToBuyRoad: this.canBuyRoad(),
                    ableToBuySettlement: this.canBuySettlement(),
                    ableToBuyCity: this.canBuyCity(),
                    ableToBuyDevelopmentCard: this.canBuyDevelopmentCard(),
                    ableToOfferTrade: this.canOfferTrade(),
                    ableToPlayCardKnight: this.canPlayCardKnight(),
                    ableToPlayCardRoad: this.canPlayCardRoad(),
                    ableToPlayCardMonopoly: this.canPlayCardMonopoly(),
                    ableToPlayCardPlenty: this.canPlayCardPlenty(),
                    ableToPlayCardVictory: this.canPlayCardVictory()
                  })

            }
          }
        }
      }
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

    this.socket.on('robber', player => {
      this.state.moveRobber = true;
    })

    this.socket.on('moveRobber', tile => {
      let index = this.state.robbedTile;
      let temp = this.state.tiles;
      temp[index].has_robber = false;
      temp[tile].has_robber = true;
      this.setState({robbedTile: tile, tiles: temp});
    })



  }





  render() {
    return(<div>
    <h2>Now in-game (game.jsx Component)</h2>

    <h3>Cheat Mode for Developer
    <button id="2" onClick={this.robber}>EventRobberSteal from Player 2</button>
    <button id="3" onClick={this.robber}>EventRobberSteal from Player 3</button>
    <button id="4" onClick={this.robber}>EventRobberSteal from Player 4</button>
    <button onClick={this.cheatMaxResource}>Maxed Resources</button>
    <button onClick={this.cheatMaxDev}>Maxed Dev Cards</button>
    <input type='text' id="cheatroad" placeholder="Take Road Ownership (RoadSlotId)" onKeyUp={this.cheatTakeControl}/>
    <input type='text' id="cheathouse" placeholder="Take House Ownership (HouseSlotId)" onKeyUp={this.cheatTakeControl}/>
    <input type='text' id="cheatmoverobber" placeholder="Move Robber (TileId)" onKeyUp={this.cheatMoveRobber}/>
    </h3>

    <button onClick={this.rollForFirst}>ROLL FOR FIRST</button>

    {this.state.active ? <Playerinterface gamestate={this.state} diceRoll={this.diceRoll} buymethod={this.makePurchase} playcardmethod={this.playCard} offertrademethod={this.startTrade} endTurn={this.endTurn}/> : null}
    <Messagelog  messages={this.state.messages} handleSubmitMessage={this.handleSubmitMessage}/>
    <Boardview gamestate={this.state} />
    
    </div>)
  }


}


export default Game;
