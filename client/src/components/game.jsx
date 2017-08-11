import React from 'react';
import io from 'socket.io-client';
import Playerinterface from './playerinterface';
import Messagelog from './messagelog';
import Boardview from './boardview';
import {Scene} from 'react-babylonjs';
import {SceneLoader, ShaderMaterial, HemisphericLight, PointLight, Vector3, Color3, PhysicsEngine, OimoJSPlugin,
    StandardMaterial, Mesh, CubeTexture, ArcRotateCamera, Texture, Engine } from 'babylonjs';

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
      hasRolled: false,
      isBuyingRoad: false,
      isBuyingSettlement: false,
      isBuyingCity: false,
    }
    this.scene = undefined;
    this.engine = undefined;
    this.onSceneMount = this.onSceneMount.bind(this);
    this.onMeshPicked = this.onMeshPicked.bind(this);
    this.initEnvironment = this.initEnvironment.bind(this)
    this.getIDFromMesh = this.getIDFromMesh.bind(this);
    this.moveRobber = this.moveRobber.bind(this);
    this.colorPiece = this.colorPiece.bind(this);


    /////////////////////////////////////////////////////
    this.toggleOff = this.toggleOff.bind(this);
    this.toggleBuySettlement = this.toggleBuySettlement.bind(this);
    this.toggleBuyCity = this.toggleBuyCity.bind(this);
    this.toggleBuyRoad = this.toggleBuyRoad.bind(this);
    this.rollForFirst = this.rollForFirst.bind(this);
    this.buyingRoad = this.buyingRoad.bind(this);
    this.buyingSettlement = this.buyingSettlement.bind(this);
    this.buyingCity = this.buyingCity.bind(this);
    this.buyingDevelopmentCard = this.buyingDevelopmentCard.bind(this);
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
  /////////////////////////////////////////////////////////////////////////////
   onMeshPicked(mesh, scene) {
     if(this.state.isBuyingRoad){
       let tile = mesh.name.slice(0,4);
       let id = Number(mesh.name.slice(4));
       if(tile === 'Road'){
       this.buyingRoad(id);
       }
     }

    if(this.state.isBuyingSettlement){
       let tile = mesh.name.slice(0,5);
       let id = Number(mesh.name.slice(5));
       if(tile === 'House'){
       this.buyingSettlement(id);
       }
     }

     if(this.state.isBuyingCity) {
       let tile = mesh.name.slice(0, 5);
       let id = Number(mesh.name.slice(5));
       console.log('buying City at house', tile, 'at id', id);
       if(tile === 'House'){
         this.buyingCity(id);
       }
     }



     
    }



    moveRobber(mesh, scene) {
        var robber = scene.getMeshByID('Robber'); 
        robber.position.x = mesh.position.x;
        robber.position.z = mesh.position.z;
    }

    colorPiece(Id, mat) {
      let mesh = this.scene.getMeshByID(Id);
        mesh.visibility = 1;   
        mesh.material = mat;
    }

    getIDFromMesh(mesh){
        let temp = mesh.name.slice(-2);
        temp = Number(temp);
        return temp;
    }
    
    createMat(player){
        var mat = new StandardMaterial("Color", this.scene);
          if(player === 1){
            mat.diffuseColor = new Color3(1, 0, 0);
          } else if (player === 2){
            mat.diffuseColor = new Color3(1, 1, 0);
          } else if (player ===3){
            mat.diffuseColor = new Color3(0, 0, 1);
          } else if (player ===4){
            mat.diffuseColor = new Color3(0, 1, 0);
          }

      return mat;
    }

    toggleOff(){
      if(this.state.isBuyingCity){
        this.toggleBuyCity();
      }

      if(this.state.isBuyingRoad){
        this.toggleBuyRoad();
      }

      if(this.state.isBuyingSettlement){
        this.toggleBuySettlement();
      }
    }

    
    onSceneMount(e) {
        const { canvas, scene, engine} = e;   
        this.scene = scene;   
        this.engine = engine;



        this.initEnvironment(canvas, scene);
        SceneLoader.ImportMesh("", "", "boardTemplate.babylon", scene, function (newMeshes) {   
            for(var mesh of newMeshes) {
                mesh.convertToFlatShadedMesh();
                if(mesh.name.includes('City') || mesh.name.includes('House') || mesh.name.includes('Road')) {       
                    mesh.visibility = 0.0;                                
                } 
            }              
        });
       

        engine.runRenderLoop(() => {

            if (scene) {
                scene.render();
            }
        });

    
    }

    initEnvironment(canvas, scene) {
        
        var light = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
        light.intensity = 1.35;
       

        var camera = new ArcRotateCamera('Camera', 0, 1.05, 20, Vector3.Zero(), scene)
        camera.lowerRadiusLimit = 10
        camera.upperRadiusLimit = 35
        camera.upperBetaLimit = Math.PI / 2
        camera.attachControl(canvas, false)
        

        scene.registerBeforeRender(function () {
                light.position = camera.position;
                var brick = scene.getMeshByID('BrickIcon');
            if(brick !== null) {
                brick.rotation.y += 0.02;
            }
            var random = scene.getMeshByID('RandomIcon');
            if(random !== null) {
                random.rotation.y += 0.02;
            }
            var random1 = scene.getMeshByID('RandomIcon.001');
            if(random1 !== null) {
                random1.rotation.y += 0.02;
            }
            var random2 = scene.getMeshByID('RandomIcon.002');
            if(random2 !== null) {
                random2.rotation.y += 0.02;
            }
            var random3 = scene.getMeshByID('RandomIcon.003');
            if(random3 !== null) {
                random3.rotation.y += 0.02;
            }
            var hay = scene.getMeshByID('HayIcon');
            if(hay !== null) {
                hay.rotation.y += 0.02;
            }
            var rock = scene.getMeshByID('RockIcon');
            if(rock !== null) {
                rock.rotation.y += 0.02;
            }
            var sheep = scene.getMeshByID('SheepIcon');
            if(sheep !== null) {
                sheep.rotation.y += 0.02;
            }
            var tree = scene.getMeshByID('TreeIcon');
            if(tree !== null) {
                tree.rotation.y += 0.02;
            }
        });

      
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  rollForFirst(){
    let dice1 = Math.floor(Math.random() * 6 + 1);
    let dice2 = Math.floor(Math.random() * 6 + 1);
    let total = dice1 + dice2
    var obj = {player: this.state.identity, roll: total}
    this.socket.emit('firstRoll', obj);
    this.setState({firstTurn: false});
  }

  buyingRoad(roadId) {
    if (this.verifyRoad(roadId)) {
      let obj = {room: this.state.room, player: this.state.identity, road: roadId};
      this.toggleBuyRoad();
      this.socket.emit('buyRoad', obj);
    } else {
      let message = {
        user: 'COMPUTER',
        text: 'selected slot is invalid, please select another!'
      };
      this.setState({messages: [...this.state.messages, message]})
    }

  }

  buyingSettlement(settlementId) {
    if (this.verifyCorner(settlementId)) {
      this.toggleBuySettlement();
      let obj = {room: this.state.room, player: this.state.identity, settlement: settlementId};
      this.socket.emit('buySettlement', obj);
    } else {
      let message = {
        user: 'COMPUTER',
        text: 'selected slot is invalid, please select another!'
      };
      this.setState({messages: [...this.state.messages, message]});
    }
  }

  buyingCity(cityId) {
    let allPlayers = this.state.players;
    if (allPlayers[this.state.identity].owns_settlement.includes(cityId) && this.state.settlements[cityId].owner === this.state.identity) {
      this.toggleBuyCity();
      let obj = {room: this.state.room, player: this.state.identity, city: cityId};
      console.log('emitting buyCity with', obj);
      this.socket.emit('buyCity', obj);
    } else {
      let message = {
        user: 'COMPUTER',
        text: 'selected slot is invalid, please select another!'
      };
      this.setState({messages: [...this.state.messages, message]});
    }
  }

  buyingDevelopmentCard() {
    let possibleDevCards = [];
    for (let i = 0; i < this.state.players[0].card_knight; i++) {
      possibleDevCards.push('card_knight');
    }
    for (let i = 0; i < this.state.players[0].card_road; i++) {
      possibleDevCards.push('card_knight');
    }
    for (let i = 0; i < this.state.players[0].card_monopoly; i++) {
      possibleDevCards.push('card_knight');
    }
    for (let i = 0; i < this.state.players[0].card_plenty; i++) {
      possibleDevCards.push('card_knight');
    }
    for (let i = 0; i < this.state.players[0].card_victory; i++) {
      possibleDevCards.push('card_knight');
    }

    let RNG = Math.floor(Math.random() * possibleDevCards.length);
    let randomCard = possibleDevCards[RNG];

    let obj = {player: this.state.identity, dev: randomCard}
    this.socket.emit('buyDev', obj);
  }

  startTrade() {
    //display input form for desired resources
    //display input form for resources to give
    //await response from other users?
  }

  playCard(item) {
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
    this.setState({active: false})
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
  
    if(this.state.roads[roadId].owner !== null){
      return false;
    }
    const adjRoads = this.getAdjRoadsToRoad(roadId);


    for(let i = 0; i < adjRoads.length; i++){
      if(adjRoads[i].owner === this.state.identity){
        let common = this.getCommonCornerToTwoRoads(adjRoads[i].id, roadId);
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
    if(ownedRoads){
      for (let i = 0; i < ownedRoads.length; i ++) {
          
        for (let j = 0; j < allRoads[ownedRoads[i]].adj_road_slots.length; j++ ) {
            let road = allRoads[ownedRoads[i]].adj_road_slots[j];
            if (this.verifyRoad(road)) {
            if(possibleRoads.indexOf(road) === -1){
              possibleRoads.push(road);
            }
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
    let possibleSettlements = this.findPossibleSettlements()

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

  toggleBuyRoad(){
    this.setState({isBuyingRoad: !this.state.isBuyingRoad},
        function(){
        if(this.state.isBuyingRoad){
            let arr = this.findPossibleRoads();
            for(let i = 0; i < arr.length; i++){
              let mesh = this.scene.getMeshByID('Road' + arr[i]);
              mesh.visibility = 0.8
            }
          } else {
            let arr = this.findPossibleRoads();
            for(let i = 0; i < arr.length; i++){
              let mesh = this.scene.getMeshByID('Road' + arr[i]);
              mesh.visibility = 0
            }
          }
    })
  }

    toggleBuySettlement(){
    this.setState({isBuyingSettlement: !this.state.isBuyingSettlement},
        function(){
        if(this.state.isBuyingSettlement){
            let arr = this.findPossibleSettlements();
    
            for(let i = 0; i < arr.length; i++){
              let mesh = this.scene.getMeshByID('House' + arr[i]);
              mesh.visibility = 0.8
            }
          } else {
            let arr = this.findPossibleSettlements();
            for(let i = 0; i < arr.length; i++){
              let mesh = this.scene.getMeshByID('House' + arr[i]);
              mesh.visibility = 0
            }
          }
    })
  }

  toggleBuyCity(){
    this.setState({isBuyingCity: !this.state.isBuyingCity})
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
      console.log('STARTING GAME');
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

    this.socket.on('buyRoad', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];
      player.card_brick --;
      player.card_lumber --;
      player.owns_road.push(obj.road);

      board.card_brick ++;
      board.card_lumber++;


      let roads = this.state.roads;
      let road = roads[obj.road];
      road.owner = obj.player;
      let mat = this.createMat(obj.player);
      this.colorPiece('Road'+obj.road, mat);
      

      this.setState({players: players, roads: roads});
    })

    this.socket.on('buySettlement', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];
      player.card_brick --;
      player.card_lumber --;
      player.card_grain --;
      player.card_wool --;

      board.card_brick ++;
      board.card_lumber ++;
      board.card_grain ++;
      board.card_wool ++;
      

      player.owns_settlement.push(obj.settlement);

      let settlements = this.state.settlements;
      let settlement = settlements[obj.settlement];
    
      settlement.owner = obj.player;
      settlement.house_type = 1;

      let mat = this.createMat(obj.player);
      this.colorPiece('House'+obj.settlement, mat);

      this.setState({players: players, settlements: settlements});
    })

    this.socket.on('buyCity', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];

      player.card_grain -= 2;
      player.card_ore -= 3;
      board.card_grain += 2;
      board.card_ore += 2;

      player.owns_city.push(obj.city);

      let settlements = this.state.settlements;
      let settlement = settlements[obj.city];
    
      settlement.house_type = 2;

      let index = player.owns_settlement.indexOf(obj.city);
      player.owns_settlement.splice(index, 1);
      let mat = this.createMat(obj.player);
      this.colorPiece('City'+obj.city, mat);
      this.setState({players: players, settlements: settlements});
    })

    this.socket.on('buyDev', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];

      player.card_grain --;
      player.card_ore --;
      player.card_wool --;

      board.card_grain ++;
      board.card_ore ++;
      board.card_wool ++;

      player[obj.dev] ++;
      board[obj.dev] --;
    })



    this.socket.on('endTurn', active => {
      if(active === this.state.identity){
        this.setState({active: true});

      }
    })

    this.socket.on('first', player => {
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

    {/* <h3>Cheat Mode for Developer
    <button id="2" onClick={this.robber}>EventRobberSteal from Player 2</button>
    <button id="3" onClick={this.robber}>EventRobberSteal from Player 3</button>
    <button id="4" onClick={this.robber}>EventRobberSteal from Player 4</button>
    <button onClick={this.cheatMaxResource}>Maxed Resources</button>
    <button onClick={this.cheatMaxDev}>Maxed Dev Cards</button>
    <input type='text' id="cheatroad" placeholder="Take Road Ownership (RoadSlotId)" onKeyUp={this.cheatTakeControl}/>
    <input type='text' id="cheathouse" placeholder="Take House Ownership (HouseSlotId)" onKeyUp={this.cheatTakeControl}/>
    <input type='text' id="cheatmoverobber" placeholder="Move Robber (TileId)" onKeyUp={this.cheatMoveRobber}/>
    </h3> */}
    
    <button onClick={this.rollForFirst}>ROLL FOR FIRST</button>
    <button onClick={this.toggleBuyRoad}>BUY ROAD</button>
    <button onClick={this.toggleBuySettlement}>BUY SETTLEMENT</button>
    <button onClick={this.toggleBuyCity}>BUY CITY</button>
    <button onClick={()=>(console.log(this.state))}>CHECK GAME STATE</button>

     {/* {this.state.active ? <Playerinterface gamestate={this.state} diceRoll={this.diceRoll} buymethod={this.makePurchase} playcardmethod={this.playCard} offertrademethod={this.startTrade} endTurn={this.endTurn}/> : null} */}
     {/* <Boardview gamestate={this.state} />   */}
                     <Scene              
                    onSceneMount={this.onSceneMount} 
                    onMeshPicked={this.onMeshPicked}
                    visible={true} />
     <Messagelog  messages={this.state.messages} handleSubmitMessage={this.handleSubmitMessage}/> 
                    <h1>THIS IS THE BOTTOM</h1>    
    </div>)
  }


}


export default Game;
