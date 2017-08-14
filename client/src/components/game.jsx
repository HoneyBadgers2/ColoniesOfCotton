import React from 'react';
import io from 'socket.io-client';
import Messagelog from './messagelog';
import {Scene} from 'react-babylonjs';
import {
  SceneLoader,
  ShaderMaterial,
  HemisphericLight,
  PointLight,
  Vector3,
  Color3,
  PhysicsEngine,
  OimoJSPlugin,
  StandardMaterial,
  Mesh,
  CubeTexture,
  ArcRotateCamera,
  Texture,
  Engine
} from 'babylonjs';
import {Button, Grid, Card, Icon, Image, Form, Menu, Popup} from 'semantic-ui-react';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      connections: null,
      highest: null,
      starter: null,
      rollsForFirst: 0,
      setupCorner: false,
      setupRoad: false,
      identity: 1,
      room: null,
      players: ['BOARD', 'Player1', 'Player2', 'Player3', 'Player4'],
      tiles: [0, 1, 2, 3, 4, 5],
      settlements: [],
      roads: [],
      messages: [],
      active: false,
      canRollForFirst: false,
      turn: 0,
      moveRobber: false,
      robber: false,
      robbedTile: 1,
      ableToBuyRoad: false,
      ableToBuySettlement: false,
      ableToBuyCity: false,
      ableToBuyDevelopmentCard: false,
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
      isBuying: false,
      isPlayingDevCard: false,
      isPlayingCardKnight: false,
      isPlayingCardRoad: 2,
      isPlayingCardMonopoly: false,
      isPlayingCardPlenty: 2,
      wantedCards: { card_brick: 0, card_grain: 0, card_lumber: 0, card_ore: 0, card_wool: 0 },
      needResourceBar: false,
      interfaceToggled: false,
      instruction: null,
      tradeMenuOpen: false
    }
    this.scene = undefined;
    this.engine = undefined;
    this.onSceneMount = this.onSceneMount.bind(this);
    this.onMeshPicked = this.onMeshPicked.bind(this);
    this.initEnvironment = this.initEnvironment.bind(this)
    this.getIDFromMesh = this.getIDFromMesh.bind(this);
    this.moveRobber = this.moveRobber.bind(this);
    this.colorPiece = this.colorPiece.bind(this);


    ////////////////////////////////////////////////////
    this.cheatSkipSetup = this.cheatSkipSetup.bind(this);
    ///////////////////////////////////////////////////////////////////
    this.cancelTradeMenu = this.cancelTradeMenu.bind(this);
    this.cancelAgreement = this.cancelAgreement.bind(this);
    this.finalizeTrade = this.finalizeTrade.bind(this);
    this.agreeToTrade = this.agreeToTrade.bind(this);
    this.cancelTradePost = this.cancelTradePost.bind(this);
    this.postTrade = this.postTrade.bind(this);
    this.tradeWithBank = this.tradeWithBank.bind(this);
    this.changeOffering = this.changeOffering.bind(this);
    this.changeWanting = this.changeWanting.bind(this);
    this.openTradeMenu = this.openTradeMenu.bind(this);
    this.toggleResourceBar = this.toggleResourceBar.bind(this);
    this.playCardPlenty = this.playCardPlenty.bind(this);
    this.toggleUI = this.toggleUI.bind(this);
    this.handleResourceClick = this.handleResourceClick.bind(this);
    this.playingCardKnight = this.playingCardKnight.bind(this);
    this.playingCardRoad = this.playingCardRoad.bind(this);
    this.playingCardMonopoly = this.playingCardMonopoly.bind(this);
    this.togglePlayingDev = this.togglePlayingDev.bind(this);
    this.toggleBuying = this.toggleBuying.bind(this);
    this.toggleSetupCorner = this.toggleSetupCorner.bind(this);
    this.toggleSetupRoad = this.toggleSetupRoad.bind(this);
    this.checkPossibleActions = this.checkPossibleActions.bind(this);
    this.toggleOff = this.toggleOff.bind(this);
    this.toggleBuySettlement = this.toggleBuySettlement.bind(this);
    this.toggleBuyCity = this.toggleBuyCity.bind(this);
    this.toggleBuyRoad = this.toggleBuyRoad.bind(this);
    this.rollForFirst = this.rollForFirst.bind(this);
    this.buyingRoad = this.buyingRoad.bind(this);
    this.buyingSettlement = this.buyingSettlement.bind(this);
    this.buyingCity = this.buyingCity.bind(this);
    this.buyingDevelopmentCard = this.buyingDevelopmentCard.bind(this);
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
    this.canPlayCardKnight = this.canPlayCardKnight.bind(this);
    this.canPlayCardRoad = this.canPlayCardRoad.bind(this);
    this.canPlayCardMonopoly = this.canPlayCardMonopoly.bind(this);
    this.canPlayCardPlenty = this.canPlayCardPlenty.bind(this);
    this.canPlayCardVictory = this.canPlayCardVictory.bind(this);
    this.cheatTakeControl = this.cheatTakeControl.bind(this);
    this.cheatMoveRobber = this.cheatMoveRobber.bind(this);
    this.cheatMaxResource = this.cheatMaxResource.bind(this);
    this.cheatMaxDev = this.cheatMaxDev.bind(this);
    this.cheatResetDevCard = this.cheatResetDevCard.bind(this);

  }
  /////////////////////////////////////////////////////////////////////////////


  onMeshPicked(mesh, scene) {
    if (this.state.setupCorner) {
      let meshType = mesh.name.slice(0, 5);
      let id = Number(mesh.name.slice(5));
      if (meshType === 'House' && mesh.visibility === 0.8) {
        this.settingSettlement(id);
        this.toggleSetupCorner('off');
        this.toggleSetupRoad(id);
        this.setState({ setupCorner: false, setupRoad: true });
      }
    }

    if (this.state.setupRoad) {
      let meshType = mesh.name.slice(0, 4);
      let id = Number(mesh.name.slice(4));
      if (meshType === 'Road' && mesh.visibility === 0.8) {
        this.settingRoad(id);
        this.toggleSetupRoad();
        this.setState({ setupRoad: false });
      }
    }

    if (this.state.isBuyingRoad) {
      let tile = mesh.name.slice(0, 4);
      let id = Number(mesh.name.slice(4));
      if (tile === 'Road') {
        this.buyingRoad(id);
      }
    }

    if (this.state.isBuyingSettlement) {
      let tile = mesh.name.slice(0, 5);
      let id = Number(mesh.name.slice(5));
      if (tile === 'House') {
        this.buyingSettlement(id);
      }
    }

    if (this.state.isBuyingCity) {
      let tile = mesh.name.slice(0, 5);
      let id = Number(mesh.name.slice(5));
      if (tile === 'House') {
        this.buyingCity(id);
      }
    }

    if (this.state.moveRobber) {
      let tile = mesh.name.slice(0, 4)
      let id = Number(mesh.name.slice(4));
      if (tile === 'Tile') {
        this.moveRobber(id);
      }
    }

    if (this.state.isPlayingCardRoad < 2 && mesh.name.slice(0, 4) === 'Road' && mesh.visibility === 0.8) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        road: Number(mesh.name.slice(4))
      }
      this.socket.emit('roadBuilding', obj);
      let players = this.state.players;
      let player = players[this.state.identity];
      player.has_played_development_card = true;
      let roadID = Number(mesh.name.slice(4));
      player.owns_road.push(roadID);
      let roads = this.state.roads;
      let road = roads[roadID];
      road.owner = this.state.identity;
      let mat = this.createMat(this.state.identity);
      this.colorPiece('Road' + roadID, mat);

      let longestRoad = 0;
      let previousPlayer = null;

      players.forEach(player => {
        if(player.has_longest_road){
          longestRoad = player.owns_road.length;
          previousPlayer = player;
        }
      })
     
      if(player.owns_road.length > longestRoad && player.owns_road.length > 5){
        player.has_longest_road = true;
        if(previousPlayer && previousPlayer.id !== player.id){
          previousPlayer.has_longest_road = false;
        }
      }





      this.setState({ isPlayingCardRoad: this.state.isPlayingCardRoad + 1, players: players, roads: roads }, () => {
        for (let i = 1; i < 73; i++) {
          let mesh = this.scene.getMeshByID('Road' + i);
          if (this.state.roads[i].owner === null) {
            mesh.visibility = 0;
          }
        }
        if (this.state.isPlayingCardRoad === 1) {
          let arr = this.findPossibleRoads();

          for (let j = 0; j < arr.length; j++) {
            let mesh = this.scene.getMeshByID('Road' + arr[j]);
            mesh.visibility = 0.8;
          }
        } else if (this.state.isPlayingCardRoad === 2) {
          this.checkPossibleActions();
          this.toggleUI();
        }
      });
    }
  }

  tradeWithBank() {
    let players = this.state.players;
    let player = players[this.state.identity];
    let wanting = player.active_trade.wanting;
    let offering = player.active_trade.offering;
    let totalOffering = 0;
    let totalWanting = 0;
    let giving = null;
    let taking = null;
    let port = null;
    let wild = null;

    for (let prop in offering) {
      totalOffering += offering[prop];

      if (offering[prop] === 2) {
        port = prop;
      } else if (offering[prop] === 3) {
        wild = prop;
      } else if (offering[prop] === 4) {
        giving = prop;
      }
    }

    for (let prop in wanting) {
      totalWanting += wanting[prop];
      if (wanting[prop] === 1) {
        taking = prop;
      }
    }

    if (totalOffering === 2 && totalWanting === 1 && port === 'card_wool' && taking && (this.state.settlements[40].owner === this.state.identity || this.state.settlements[41].owner === this.state.identity)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: giving,
        taking: taking,
        amount: 4
      };

      this.socket.emit('tradeWithBank', obj);
    } else if (totalOffering === 2 && totalWanting === 1 && port === 'card_grain' && taking && (this.state.settlements[30].owner === this.state.identity || this.state.settlements[31].owner === this.state.identity)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: giving,
        taking: taking,
        amount: 4
      };

      this.socket.emit('tradeWithBank', obj);
    } else if (totalOffering === 2 && totalWanting === 1 && port === 'card_ore' && taking && (this.state.settlements[34].owner === this.state.identity || this.state.settlements[35].owner === this.state.identity)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: port,
        taking: taking,
        amount: 2
      };
      this.socket.emit('tradeWithBank', obj);
    } else if (totalOffering === 2 && totalWanting === 1 && port === 'card_lumber' && taking && (this.state.settlements[25].owner === this.state.identity || this.state.settlements[54].owner === this.state.identity)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: port,
        taking: taking,
        amount: 2
      };
      this.socket.emit('tradeWithBank', obj);
    } else if (totalOffering === 2 && totalWanting === 1 && port === 'card_brick' && taking && (this.state.settlements[50].owner === this.state.identity || this.state.settlements[51].owner === this.state.identity)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: port,
        taking: taking,
        amount: 2
      };
      this.socket.emit('tradeWithBank', obj);
    } else if (totalOffering === 3 && totalWanting === 1 && wild && taking && (this.state.settlements[27].owner === this.state.identity || this.state.settlements[28].owner === this.state.identity || this.state.settlements[37].owner === this.state.identity || this.state.settlements[38].owner === this.state.identity || this.state.settlements[44].owner === this.state.identity || this.state.settlements[45].owner === this.state.identity || this.state.settlements[47].owner === this.state.identity || this.state.settlements[48].owner === this.state.identity)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: wild,
        taking: taking,
        amount: 3
      };
      this.socket.emit('tradeWithBank', obj);
    } else if (totalOffering === 4 && totalWanting === 1 && giving && taking) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        giving: giving,
        taking: taking,
        amount: 4
      };
      this.socket.emit('tradeWithBank', obj);
    }
  }

  toggleUI() {
    this.setState({ interfaceToggled: !this.state.interfaceToggled });
  }

  finalizeTrade(event){
    console.log(event.target.id);

    let obj = {
      room: this.state.room,
      player: this.state.identity,
      trader: event.target.id,
      trade: this.state.players[this.state.identity].posted_trade
    }
    console.log(obj);
    let players = this.socket.emit('finalizeTrade', obj);
  }

  cancelTradeMenu(){
    let players = this.state.players;
    let player = players[this.state.identity];

    let wanting = player.active_trade.wanting;
    let offering = player.active_trade.offering;

    for(var prop in wanting){
      wanting[prop] = 0;
      offering[prop] = 0;
    }

    this.setState({players: players, tradeMenuOpen: false});

  }

  cancelTradePost(){
    let obj = {
      room: this.state.room,
      player: this.state.identity,
    }

    this.socket.emit('cancelTradePost', obj);
  }

  openTradeMenu() {
    this.setState({ tradeMenuOpen: !this.state.tradeMenuOpen, isBuying: false, isPlayingDevCard: false })
  }

  playCardPlenty() {
    let players = this.state.players;
    let player = this.state.players[this.state.identity];
    player.has_played_development_card = true;
    this.setState({ instruction: "Pick Two Resources", isPlayingDevCard: false })
    this.toggleUI();
    this.toggleResourceBar();
    this.socket.emit('playingDev', { room: this.state.room, player: this.state.identity, dev: "Year of Plenty", card: "card_plenty" })
    this.setState({ isPlayingCardPlenty: 0, players: players });
  }

  handleResourceClick(event) {
    if (this.state.isPlayingCardPlenty < 2) {
      if (this.state.players[0][event.target.id] > 0) {
        let obj = {
          resource: event.target.id,
          player: this.state.identity,
          room: this.state.room
        }
        this.socket.emit('playedCardPlenty', obj);
        this.setState({ isPlayingCardPlenty: this.state.isPlayingCardPlenty + 1 }, () => {
          if (this.state.isPlayingCardPlenty === 2) {
            this.toggleUI();
            this.toggleResourceBar();
            this.checkPossibleActions();
          }
        })

      }
    }


    if (this.state.isPlayingCardMonopoly) {
      let obj = {
        player: this.state.identity,
        room: this.state.room,
        resource: event.target.id
      }

      this.socket.emit('playedCardMonopoly', obj);
      this.setState({ needResourceBar: false });
      this.toggleUI();
      this.checkPossibleActions();
    }
  }



  colorPiece(Id, mat) {
    let mesh = this.scene.getMeshByID(Id);
    mesh.visibility = 1;
    mesh.material = mat;
  }

  getIDFromMesh(mesh) {
    let temp = mesh.name.slice(-2);
    temp = Number(temp);
    return temp;
  }

  createMat(player) {
    var mat = new StandardMaterial("Color", this.scene);
    if (player === 1) {
      mat.diffuseColor = new Color3(0.569, 0, 0);
    } else if (player === 2) {
      mat.diffuseColor = new Color3(0.875, 0.620, 0.106);
    } else if (player === 3) {
      mat.diffuseColor = new Color3(0.063, 0.145, 0.259);
    } else if (player === 4) {
      mat.diffuseColor = new Color3(0.071, 0.337, 0.047);
    }

    return mat;
  }

  toggleOff(param) {
    if (this.state.isBuyingCity && param !== 'City') {
      this.toggleBuyCity();
    }

    if (this.state.isBuyingRoad && param !== 'Road') {
      this.toggleBuyRoad();
    }

    if (this.state.isBuyingSettlement && param !== 'Settlement') {
      this.toggleBuySettlement();
    }
  }

  cancelAgreement(){
    let obj = {
      room: this.state.room,
      player: this.state.identity
    }

    this.socket.emit('cancelAgreement', obj);
  }

  changeWanting(event) {
    let players = this.state.players;
    let player = players[this.state.identity];
    let active_trade = player.active_trade;
    let wanting = active_trade.wanting;
    let resource = event.target.id;
    if (event.button === 0) {
      wanting[resource]++
    } else if (event.button === 2 && wanting[resource] > 0) {
      wanting[resource]--
    }
    this.setState({ players: players });
  }

  changeOffering(event) {
    let players = this.state.players;
    let player = players[this.state.identity];
    let active_trade = player.active_trade;
    let offering = active_trade.offering;
    let resource = event.target.id;
    if (event.button === 0 && player[resource] > offering[resource]) {
      offering[resource]++
    } else if (event.button === 2 && offering[resource] > 0) {
      offering[resource]--
    }
    this.setState({ players: players });
  }


  onSceneMount(e) {
    const {
      canvas,
      scene,
      engine
    } = e;
    this.scene = scene;
    this.engine = engine;



    this.initEnvironment(canvas, scene);
    SceneLoader.ImportMesh("", "", "boardTemplate.babylon", scene, function (newMeshes) {
      for (var mesh of newMeshes) {
        if (mesh.name !== 'NonClickRobber') {
          mesh.convertToFlatShadedMesh();
        }

        if (mesh.name.includes('NonClick')) {
          mesh.isPickable = false;
        }

        if (mesh.name.includes('City') || mesh.name.includes('House') || mesh.name.includes('Road')) {
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
      var brick = scene.getMeshByID('NonClickBrickIcon');
      if (brick !== null) {
        brick.rotation.y += 0.02;
      }
      var random = scene.getMeshByID('NonClickRandomIcon');
      if (random !== null) {
        random.rotation.y += 0.02;
      }
      var random1 = scene.getMeshByID('NonClickRandomIcon.001');
      if (random1 !== null) {
        random1.rotation.y += 0.02;
      }
      var random2 = scene.getMeshByID('NonClickRandomIcon.002');
      if (random2 !== null) {
        random2.rotation.y += 0.02;
      }
      var random3 = scene.getMeshByID('NonClickRandomIcon.003');
      if (random3 !== null) {
        random3.rotation.y += 0.02;
      }
      var hay = scene.getMeshByID('NonClickHayIcon');
      if (hay !== null) {
        hay.rotation.y += 0.02;
      }
      var rock = scene.getMeshByID('NonClickRockIcon');
      if (rock !== null) {
        rock.rotation.y += 0.02;
      }
      var sheep = scene.getMeshByID('NonClickSheepIcon');
      if (sheep !== null) {
        sheep.rotation.y += 0.02;
      }
      var tree = scene.getMeshByID('NonClickTreeIcon');
      if (tree !== null) {
        tree.rotation.y += 0.02;
      }
    });


  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  settingSettlement(id) {
    let obj = {};
    obj.room = this.state.room;
    obj.player = this.state.identity;
    obj.corner = id;

    this.socket.emit('settingSettlement', obj);
  }

  toggleResourceBar() {
    this.setState({ needResourceBar: !this.state.needResourceBar });
  }

  settingRoad(id) {
    let nextPlayer = null;
    let last = true;
    let obj = {};

    let numberOfSettlementsOwned = this.state.players[this.state.identity].owns_settlement.length;
    if (numberOfSettlementsOwned === 1) {
      for (let i = 1; i < this.state.players.length; i++) {
        if (this.state.players[i].owns_settlement.length < 1) {
          last = false;
        }
      }
      if (last) {
        nextPlayer = this.state.identity;
      } else {
        nextPlayer = this.state.identity + 1;
        if (nextPlayer === 5) {
          nextPlayer = 1;
        }
      }
    }

    if (numberOfSettlementsOwned === 2) {
      for (let i = 1; i < this.state.players.length; i++) {
        if (this.state.players[i].owns_settlement.length < 2) {
          last = false;
        }
      }
      if (last) {
        nextPlayer = this.state.identity;
        obj.start = true;
      } else {
        nextPlayer = this.state.identity - 1;
        if (nextPlayer === 0) {
          nextPlayer = 4;
        }
      }
    }

    obj.room = this.state.room;
    obj.player = this.state.identity;
    obj.road = id;
    obj.next = nextPlayer

    this.socket.emit('settingRoad', obj);
  }

  rollForFirst() {
    let dice1 = Math.floor(Math.random() * 6 + 1);
    let dice2 = Math.floor(Math.random() * 6 + 1);
    let total = dice1 + dice2
    var obj = {
      room: this.state.room,
      player: this.state.identity,
      roll: total
    }
    console.log('First Roll Object is', obj);
    this.socket.emit('firstRoll', obj);
    this.setState({
      canRollForFirst: false
    });
  }

  agreeToTrade(){
    let active;
    let player = this.state.players[this.state.identity];
    console.log('in agree to trade');
    this.state.players.forEach((player) => {
      if(player.is_active_player){
        active = this.state.players[player.id];
      }
    })

    let wanting = active.posted_trade.wanting;
    let canAccept = true;
    for(var prop in wanting){
      if(player[prop] < wanting[prop]){
        canAccept = false;
      }
    }

    if(canAccept){
      let obj = {
        player: this.state.identity,
        room: this.state.room
      }
      this.socket.emit('agreesToTrade', obj);
    }
  }

  buyingRoad(roadId) {
    if (this.verifyRoad(roadId)) {
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        road: roadId
      };
      this.toggleBuyRoad();
      this.socket.emit('buyRoad', obj);
    } else {
      let message = {
        user: 'COMPUTER',
        text: 'selected slot is invalid, please select another!'
      };
      this.setState({
        messages: [...this.state.messages, message]
      })
    }

  }

  toggleBuying() {
    this.setState({ isBuying: !this.state.isBuying });
    if (this.state.isPlayingDevCard) {
      this.setState({ isPlayingDevCard: false })
    }
    if (this.state.tradeMenuOpen) {
      this.setState({ tradeMenuOpen: false })
    }
  }

  togglePlayingDev() {
    this.setState({ isPlayingDevCard: !this.state.isPlayingDevCard });
    if (this.state.isBuying) {
      this.setState({ isBuying: false })
    }
    if (this.state.tradeMenuOpen) {
      this.setState({ tradeMenuOpen: false })
    }
  }

  buyingSettlement(settlementId) {
    if (this.verifyCorner(settlementId)) {
      this.toggleBuySettlement();
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        settlement: settlementId
      };
      this.socket.emit('buySettlement', obj);
    } else {
      let message = {
        user: 'COMPUTER',
        text: 'selected slot is invalid, please select another!'
      };
      this.setState({
        messages: [...this.state.messages, message]
      });
    }
  }

  buyingCity(cityId) {
    let allPlayers = this.state.players;
    if (allPlayers[this.state.identity].owns_settlement.includes(cityId) && this.state.settlements[cityId].owner === this.state.identity) {
      this.toggleBuyCity();
      let obj = {
        room: this.state.room,
        player: this.state.identity,
        city: cityId
      };
      this.socket.emit('buyCity', obj);
    } else {
      let message = {
        user: 'COMPUTER',
        text: 'selected slot is invalid, please select another!'
      };
      this.setState({
        messages: [...this.state.messages, message]
      });
    }
  }

  buyingDevelopmentCard() {
    console.log('buyingDev');
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

    let obj = {
      room: this.state.room,
      player: this.state.identity,
      dev: randomCard
    }
    this.socket.emit('buyDev', obj);
  }



  playingCardKnight(tileId) {
    this.toggleUI();
    let players = this.state.players;
    let player = players[0];
    player.has_played_development_card = true;
    this.setState({ players: players, moveRobber: true, isPlayingDevCard: false });
    let obj = {
      player: this.state.identity,
      room: this.state.room,
      dev: "a Knight",
      card: "card_knight"
    }
    this.socket.emit('playingDev', obj);
    this.checkPossibleActions();
  }

  playingCardRoad() {
    this.toggleUI();
    let players = this.state.players;
    let player = players[0];
    player.has_played_development_card = true;
    this.setState({ players: players, isPlayingCardRoad: 0, isPlayingDevCard: false });

    let obj = {
      player: this.state.identity,
      room: this.state.room,
      dev: "Road Building",
      card: "card_road"
    }
    this.socket.emit('playingDev', obj);
    let arr = this.findPossibleRoads();
    for (let i = 0; i < arr.length; i++) {
      let mesh = this.scene.getMeshByID('Road' + arr[i]);
      mesh.visibility = 0.8;
    }
  }

  playingCardMonopoly(cardType) {
    let allPlayers = this.state.players;
    let player = allPlayers[this.state.identity];
    player.has_played_development_card = true;
    let obj = {
      player: this.state.identity,
      dev: "Monopoly",
      room: this.state.room,
      card: "card_monopoly"
    };

    this.socket.emit('playingDev', obj);
    this.setState({
      isPlayingDevCard: false,
      players: allPlayers,
      isPlayingCardMonopoly: true,
      needResourceBar: true,
      instruction: "Pick A Resource To Take"
    });
    this.toggleUI();
  }



  endTurn() {
    let nextPlayer;
    let players = this.state.players;
    
    if (this.state.identity !== 4) {
      nextPlayer = this.state.identity + 1;
    } else {
      nextPlayer = 1;
    }
    this.setState({
      active: false,
      hasRolled: false,
      isBuying: false,
      isPlayingDevCard: false
    })
    let obj = {
      room: this.state.room,
      ending: this.state.identity,
      player: nextPlayer
    }
    let player = this.state.players[this.state.identity];
    let score = player.owns_settlement.length + player.card_victory + (player.owns_city.length * 2);
    if(player.has_biggest_army){
      score += 2;
    }
    if(player.has_longest_road){
      score += 2;
    }

    if(score >= 10){
      let win = {
        room: this.state.room,
        player: this.state.identity,
        victory: player.card_victory,
        score: score - player.card_victory
      }
      this.socket.emit('endGame', win);
    } else {
      this.socket.emit('endTurn', obj);
    }
  }

  postTrade(){
    console.log('client is posting trade');
    let players = this.state.players;
    let player = players[this.state.identity];
    let active = player.active_trade;
    let obj = {
      room: this.state.room,
      active: active,
      player: this.state.identity
    }
    console.log('postTrade Object is', obj);
    this.socket.emit('postTrade', obj);
  }



  diceRoll() {
    let dice1 = Math.floor(Math.random() * 6 + 1);
    let dice2 = Math.floor(Math.random() * 6 + 1);
    let total = dice1 + dice2
    let obj = {};
    obj.room = this.state.room;
    obj.player = this.state.identity;
    obj.total = total;
    this.socket.emit('diceRoll', obj);
    this.setState({ hasRolled: true });
  }

  moveRobber(tileId) {
    if (tileId !== this.state.robbedTile) {
      let obj = {
        tile: tileId,
        room: this.state.room,
        player: this.state.identity
      }
      this.state.moveRobber = false;
      let index = tileId;
      let tile = this.state.tiles[index];
      let corners = tile.connecting_house_slots
      let arr = [];

      for (let x = 0; x < corners.length; x++) {
        let corner = this.state.settlements[corners[x]];
        if (corner.owner && this.state.players[corner.owner].total_resources > 0) {
          arr.push(corner.owner);
        }
      }
      if (arr.length > 0) {
        this.state.robber = true;
      } else {
        this.setState({ messages: [...this.state.messages, { text: "No one to rob from!", user: "COMPUTER" }] })
        this.toggleUI();
      }
      this.socket.emit('moveRobber', obj)
    } else {
      let message = {
        text: "You can't place the robber where it is already.",
        user: "COMPUTER"
      }

      this.setState({ messages: [...this.state.messages, message] });
    }
  }

  robber(event) {
    if (this.state.robber) {
      let index = this.state.robbedTile;
      let tile = this.state.tiles[index];
      let corners = tile.connecting_house_slots
      let arr = [];

      for (let x = 0; x < corners.length; x++) {
        let corner = this.state.settlements[corners[x]];

        if (corner.owner) {
          arr.push(corner.owner);
        }
      }
      if (arr.length > 0) {
        if (arr.indexOf(Number(event.target.id)) !== -1 && this.state.players[Number(event.target.id)].total_resources > 0) {
          let target = this.state.players[event.target.id]
          let available = [];

          for (let i = 0; i < target.card_brick; i++) {
            available.push('card_brick');
          }

          for (let i = 0; i < target.card_wool; i++) {
            available.push('card_wool');
          }

          for (let i = 0; i < target.card_lumber; i++) {
            available.push('card_lumber');
          }

          for (let i = 0; i < target.card_grain; i++) {
            available.push('card_grain');
          }

          for (let i = 0; i < target.card_ore; i++) {
            available.push('card_ore');
          }




          let RNG = Math.floor(Math.random() * available.length);
          let resource = available[RNG];
          let obj = {};
          obj.room = this.state.room;
          obj.resource = resource;
          obj.target = event.target.id;
          obj.player = this.state.identity;
          this.socket.emit('rob', obj);
          this.toggleUI();
        }
      } else {
        this.toggleUI();
      }
    }
  }


  handleSubmitMessage(event) {
    let obj = {
      user: this.state.identity,
      room: this.state.room,
      text: event.target.value
    }

    if (event.keyCode === 13) {
      this.socket.emit('message', obj);
      event.target.value = '';
    }
  }
  //////////////////////////////// HELPER FUNCTIONS ////////////////////////////////
  verifyCorner(cornerId) {
    if (this.state.settlements[cornerId].owner !== null) {
      return false
    }

    const adjCorners = this.getAdjCornersToCorner(cornerId);
    const adjRoads = this.getAdjRoadsToCorner(cornerId);

    for (let i = 0; i < adjCorners.length; i++) {
      if (adjCorners[i].owner !== null) {
        return false;
      }
    }

    for (let i = 0; i < adjRoads.length; i++) {
      if (adjRoads[i].owner === this.state.identity) {
        return true;
      }
    }

    return false;
  }


  verifyRoad(roadId) {
    if (this.state.roads[roadId].owner !== null) {
      return false;
    }
    const adjRoads = this.getAdjRoadsToRoad(roadId);


    for (let i = 0; i < adjRoads.length; i++) {
      if (adjRoads[i].owner === this.state.identity) {
        let common = this.getCommonCornerToTwoRoads(adjRoads[i].id, roadId);
        if (common.owner === this.state.identity || common.owner === null) {
          return true;
        }

      }
    }

    return false;
  }

  getAdjCornersToCorner(cornerId) {
    let arr = this.state.settlements[cornerId].adj_house_slots;
    let output = [];
    for (var i = 0; i < arr.length; i++) {
      output.push(this.state.settlements[arr[i]]);
    }
    return output;
  }

  getAdjRoadsToCorner(cornerId) {
    let arr = this.state.settlements[cornerId].connecting_road_slots;
    let output = [];
    for (let i = 0; i < arr.length; i++) {
      output.push(this.state.roads[arr[i]]);
    }
    return output;
  }

  getAdjCornerToRoad(roadId) {
    let arr = this.state.roads[roadId].connecting_house_slots;
    let output = [];
    for (let i = 0; i < arr.length; i++) {
      output.push(this.state.settlements[arr[i]]);
    }
    return output;
  }

  getAdjRoadsToRoad(roadId) {
    let arr = this.state.roads[roadId].adj_road_slots;
    let output = [];
    for (let i = 0; i < arr.length; i++) {
      output.push(this.state.roads[arr[i]]);
    }
    return output;
  }

  getCommonCornerToTwoRoads(road1, road2) {
    let firstCorners = this.state.roads[road1].connecting_house_slots;
    let secondCorners = this.state.roads[road2].connecting_house_slots;

    for (let i = 0; i < firstCorners.length; i++) {
      if (secondCorners.indexOf(firstCorners[i]) !== -1) {
        return this.state.settlements[firstCorners[i]];
      }
    }
  }

  findPossibleRoads() {
    // determine Roads that are valid for this player, returns an array
    let allRoads = this.state.roads;
    let ownedRoads = this.state.players[this.state.identity].owns_road;
    let possibleRoads = [];
    if (ownedRoads) {
      for (let i = 0; i < ownedRoads.length; i++) {

        for (let j = 0; j < allRoads[ownedRoads[i]].adj_road_slots.length; j++) {
          let road = allRoads[ownedRoads[i]].adj_road_slots[j];
          if (this.verifyRoad(road)) {
            if (possibleRoads.indexOf(road) === -1) {
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

    for (let i = 0; i < ownedRoads.length; i++) {
      for (let j = 0; j < allRoads[ownedRoads[i]].connecting_house_slots.length; j++) {
        if (this.verifyCorner(allRoads[ownedRoads[i]].connecting_house_slots[j])) {
          let corner = allRoads[ownedRoads[i]].connecting_house_slots[j];
          if (possibleSettlements.indexOf(corner) === -1) {
            possibleSettlements.push(allRoads[ownedRoads[i]].connecting_house_slots[j]);
          }
        }
      }
    }

    return possibleSettlements;
  }

  calculateScore(playerId) {
    let score = this.state.players[playerId].played_card_victory + this.state.players[playerId].card_victory + this.state.players[playerId].owns_settlement.length + (2 * this.state.players[playerId].owns_city.length);

    if (this.state.players[playerId].has_longest_road) {
      score = score + 2;
    }

    if (this.state.players[playerId].has_biggest_army) {
      score = score + 2;
    }

    return score - this.state.players[playerId].card_victory;
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


  checkPossibleActions() {
    this.setState({
      ableToBuyRoad: this.canBuyRoad(),
      ableToBuySettlement: this.canBuySettlement(),
      ableToBuyCity: this.canBuyCity(),
      ableToBuyDevelopmentCard: this.canBuyDevelopmentCard(),
      ableToPlayCardKnight: this.canPlayCardKnight(),
      ableToPlayCardRoad: this.canPlayCardRoad(),
      ableToPlayCardMonopoly: this.canPlayCardMonopoly(),
      ableToPlayCardPlenty: this.canPlayCardPlenty(),
      ableToPlayCardVictory: this.canPlayCardVictory()
    })
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

    if (event.keyCode === 13) {
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
    if (event.keyCode === 13) {
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

  cheatResetDevCard() {
    let allPlayers = this.state.players;
    allPlayers[this.state.identity].has_played_development_card = false;
    this.setState({ players: allPlayers });
  }

  toggleBuyRoad() {
    this.toggleOff('Road');
    this.setState({
      isBuyingRoad: !this.state.isBuyingRoad
    },
      function () {
        if (this.state.isBuyingRoad) {
          let arr = this.findPossibleRoads();
          for (let i = 0; i < arr.length; i++) {
            let mesh = this.scene.getMeshByID('Road' + arr[i]);
            mesh.visibility = 0.8
          }
        } else {
          let arr = this.findPossibleRoads();
          for (let i = 0; i < arr.length; i++) {
            let mesh = this.scene.getMeshByID('Road' + arr[i]);
            mesh.visibility = 0
          }
        }
      })
  }

  toggleBuySettlement() {
    this.toggleOff('Settlement');
    this.setState({
      isBuyingSettlement: !this.state.isBuyingSettlement
    },
      function () {
        if (this.state.isBuyingSettlement) {
          let arr = this.findPossibleSettlements();

          for (let i = 0; i < arr.length; i++) {
            let mesh = this.scene.getMeshByID('House' + arr[i]);
            mesh.visibility = 0.8
          }
        } else {
          let arr = this.findPossibleSettlements();
          for (let i = 0; i < arr.length; i++) {
            let mesh = this.scene.getMeshByID('House' + arr[i]);
            mesh.visibility = 0
          }
        }
      })
  }

  toggleBuyCity() {
    this.toggleOff('City');
    this.setState({
      isBuyingCity: !this.state.isBuyingCity
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

  toggleSetupCorner(param) {
    if (param === 'on') {
      for (let i = 1; i < 55; i++) {
        let corner = this.state.settlements[i];
        let mesh = this.scene.getMeshByID('House' + i);

        let adj = this.getAdjCornersToCorner(i);
        let available = true;
        if (corner.owner !== null) {
          available = false;
        } else {
          for (let j = 0; j < adj.length; j++) {
            if (adj[j].owner !== null) {
              available = false;
            }
          }
        }

        if (available) {
          mesh.visibility = 0.8
        } else {
          if (corner.owner === null) {
            mesh.visibility = 0;
          }
        }
      }
    } else if (param === 'off') {
      for (let i = 1; i < 55; i++) {
        let corner = this.state.settlements[i];
        let mesh = this.scene.getMeshByID('House' + i);
        if (corner.owner === null) {
          mesh.visibility = 0;
        }
      }
    }
  }

  toggleSetupRoad(id, param) {
    if (id) {
      let adj = this.getAdjRoadsToCorner(id);
      for (let i = 0; i < adj.length; i++) {
        let mesh = this.scene.getMeshByID('Road' + adj[i].id);
        if (adj[i].owner === null) {
          mesh.visibility = 0.8;
        }
      }
    } else {
      for (let i = 1; i < 73; i++) {
        let road = this.state.roads[i];
        let mesh = this.scene.getMeshByID('Road' + i);
        if (road.owner === null) {
          mesh.visibility = 0;
        }
      }

    }
  }
  //////////////////////////////////////////////////
  cheatSkipSetup() {
    let obj = {};
    obj.room = this.state.room;
    this.socket.emit('cheatSkipSetup', obj);
  }

  //////////////////////////////////////////////////
  /////////// START SOCKET LISTENERS ///////////
  componentDidMount() {

    this.socket = io('/');
    this.socket.emit('joining', this.props.match.params.room)


    this.socket.on('cancelAgreement', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      player.accepted_trade = false;
      this.setState({players: players});
    })

    this.socket.on('finalizeTrade', obj => {
      let players = this.state.players;
      let active = players[obj.player];
      let trader = players[obj.trader];
      let activeGiving = obj.trade.offering;
      let activeReceiving = obj.trade.wanting;
      for(let prop in activeGiving){
        active[prop] -= activeGiving[prop];
        trader[prop] += activeGiving[prop];
        active.total_resources -= activeGiving[prop];
      }

      for(let prop in activeReceiving){
        active[prop] += activeReceiving[prop];
        trader[prop] -= activeReceiving[prop];
        active.total_resources += activeGiving[prop];
      }
      active.posted_trade = null;
      players.forEach(player => {
        player.accepted_trade = false;
      })
      this.setState({players:players});
    })

    this.socket.on('agreesToTrade', obj => {
      let players = this.state.players;
      let agree = this.state.players[obj.player];
      agree.accepted_trade = true;
      this.setState({players: players});
    })


    this.socket.on('roadBuilding', obj => {
      let playerID = obj.player;
      let roadID = obj.road;

      let players = this.state.players;
      let player = players[playerID];

      let roads = this.state.roads;
      let road = roads[roadID];

      player.owns_road.push(roadID);
      road.owner = playerID;

      this.setState({ players: players, roads: roads });
      let mat = this.createMat(playerID);
      this.colorPiece('Road' + roadID, mat);
    })

    this.socket.on('cancelTradePost', id => {
      let players = this.state.players;
      let player = players[id];
      player.posted_trade = null;
      players.forEach(player => {
        player.accepted_trade = false;
      })
      this.setState({players: players});
    })

    this.socket.on('playedDev', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      player[obj.card]--
      let largestArmy = 0;
      let previousPlayer = null;
      players.forEach(player => {
        if(player.has_biggest_army){
          largestArmy = player.played_card_knight;
          previousPlayer = player;
        }
      })
      if(obj.card === 'card_knight'){
        player.played_card_knight ++;
        if(player.played_card_knight > largestArmy && player.played_card_knight > 2){
          player.has_biggest_army = true;
          if(previousPlayer && previousPlayer.id !== player.id){
            previousPlayer.has_biggest_army = false;
          }
        }
      }

      this.setState({ players: players });
    })
    this.socket.on('start', body => {
      this.setState({
        canRollForFirst: true,
        players: body.players,
        tiles: body.tiles,
        settlements: body.settlements,
        roads: body.roads
      });
    })


    this.socket.on('playedCardPlenty', obj => {
      let resource = obj.resource;
      let players = this.state.players;

      let board = players[0];
      let player = players[obj.player];

      board[resource]--;
      player[resource]++;
      player.total_resources++;


      this.setState({ players: players })
    })

    this.socket.on('settingSettlement', obj => {
      let playerID = obj.player;
      let cornerID = obj.corner;

      let players = this.state.players;
      let player = players[playerID];

      let settlements = this.state.settlements;
      let settlement = settlements[cornerID];

      player.owns_settlement.push(cornerID);
      settlement.owner = playerID;
      if (player.owns_settlement.length === 2) {
        for (let i = 1; i < 20; i++) {
          let tile = this.state.tiles[i];
          if (tile.connecting_house_slots.indexOf(cornerID) !== -1) {
            let resource = 'card_' + tile.terrain;
            players[0][resource]--;
            player[resource]++;
            player.total_resources++;
          }
        }
      }

      this.setState({ players: players, settlements: settlements });

      let mat = this.createMat(playerID);
      this.colorPiece('House' + cornerID, mat);
    })

    this.socket.on('settingRoad', obj => {
      let playerID = obj.player;
      let roadID = obj.road;

      let players = this.state.players;
      let player = players[playerID];

      let roads = this.state.roads;
      let road = roads[roadID];

      player.owns_road.push(roadID);
      road.owner = playerID;

      this.setState({ players: players, roads: roads });
      let mat = this.createMat(playerID);
      this.colorPiece('Road' + roadID, mat);
      if (!obj.start) {
        if (obj.next === this.state.identity) {
          this.setState({ setupCorner: true }, function () { this.toggleSetupCorner('on') });
        }
      }
      if (obj.start) {
        if (obj.next === this.state.identity) {
          this.setState({ active: true });
        }
      }
    })




    this.socket.on('rob', obj => {
      let victim = this.state.players[obj.target];
      let crim = this.state.players[obj.player];
      let resource = obj.resource;

      victim[resource]--;
      victim.total_resources--;
      crim[resource]++;
      crim.total_resources++;
      this.setState({
        turns: this.state.turns++
      });
      this.checkPossibleActions();
    })
    

    this.socket.on('joined', (roomName)=> {
      this.state.connections = this.state.connections || 0;
      this.state.connections ++
      console.log('joined heard');
      console.log(roomName);
      this.setState({connections: this.state.connections, room: roomName}, () => {
          this.setState({identity: this.state.connections});

        if(this.state.connections === 4){
          this.socket.emit('start', this.state.room);
        }
      });
    })


    this.socket.on('message', body => {
      this.setState({
        messages: [...this.state.messages, body]
      })
    })

    this.socket.on('endGame', ()=> {
      this.setState({active: false});
    })
    this.socket.on('diceRoll', total => {
      for (var i = 0; i < this.state.tiles.length; i++) {
        let tile = this.state.tiles[i];
        if (tile.dice_trigger_value === total && !tile.has_robber) {
          for (var j = 0; j < tile.connecting_house_slots.length; j++) {
            let index = tile.connecting_house_slots[j];
            let corner = this.state.settlements[index];
            if (corner.owner !== null) {
              let board = this.state.players[0];
              let player = this.state.players[corner.owner];
              let resource = tile.terrain;
              let card = "card_" + resource;

              board[card]--;
              player[card]++;
              player.total_resources++
              this.setState({
                turn: this.state.turn + 1
              });
            }
          }
        }
      }
      this.checkPossibleActions();
    })

    this.socket.on('firstRoll', obj => {
      this.setState({rollsForFirst: this.state.rollsForFirst+1}, () => {
        if(obj.roll > this.state.highest){
          this.state.highest = obj.roll;
          this.state.starter = obj.player;
        }
        debugger;
        if(this.state.rollsForFirst === 4 && this.state.starter === this.state.identity){
          this.socket.emit('first', {first: this.state.starter, room: this.state.room})
        }
      });
    })


    this.socket.on('buyRoad', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];
      player.card_brick--;
      player.card_lumber--;
      player.total_resources -= 2;
      player.owns_road.push(obj.road);

      board.card_brick++;
      board.card_lumber++;

      let longestRoad = null;
      let previousPlayer = null;

      players.forEach(player => {
        if(player.has_longest_road){
          longestRoad = player.owns_road.length;
          previousPlayer = player;
        }
      })
     
      if(player.owns_road.length > longestRoad && player.owns_road.length > 5){
        player.has_longest_road = true;
        if(previousPlayer && previousPlayer.id !== player.id){
          previousPlayer.has_longest_road = false;
        }
      }


      let roads = this.state.roads;
      let road = roads[obj.road];
      road.owner = obj.player;
      let mat = this.createMat(obj.player);
      this.colorPiece('Road' + obj.road, mat);


      this.setState({
        players: players,
        roads: roads
      });
      this.checkPossibleActions();
    })

    this.socket.on('buySettlement', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];
      player.card_brick--;
      player.card_lumber--;
      player.card_grain--;
      player.card_wool--;
      player.total_resources -= 4;
      board.card_brick++;
      board.card_lumber++;
      board.card_grain++;
      board.card_wool++;


      player.owns_settlement.push(obj.settlement);

      let settlements = this.state.settlements;
      let settlement = settlements[obj.settlement];

      settlement.owner = obj.player;
      settlement.house_type = 1;

      let mat = this.createMat(obj.player);
      this.colorPiece('House' + obj.settlement, mat);

      this.setState({
        players: players,
        settlements: settlements
      });
      this.checkPossibleActions();
    })

    this.socket.on('buyCity', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];

      player.card_grain -= 2;
      player.card_ore -= 3;
      board.card_grain += 2;
      board.card_ore += 2;
      player.total_resources -= 5;
      player.owns_city.push(obj.city);

      let settlements = this.state.settlements;
      let settlement = settlements[obj.city];

      settlement.house_type = 2;

      let index = player.owns_settlement.indexOf(obj.city);
      player.owns_settlement.splice(index, 1);
      let mat = this.createMat(obj.player);
      this.colorPiece('City' + obj.city, mat);
      this.setState({
        players: players,
        settlements: settlements
      });
      this.checkPossibleActions();
    })

    this.socket.on('buyDev', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];


      player.card_grain--;
      player.card_ore--;
      player.card_wool--;
      player.total_resources -= 3;
      board.card_grain++;
      board.card_ore++;
      board.card_wool++;

      player[obj.dev]++;
      board[obj.dev]--;
      this.checkPossibleActions();
    })



    this.socket.on('endTurn', obj => {
      let players = this.state.players;
      let ending = players[obj.ending];
      let starting = players[obj.player];
      ending.is_active_player = false;
      starting.is_active_player = true;

      this.setState({
        players: players
      })

      if (obj.player === this.state.identity) {
        this.setState({
          active: true
        });
      }
      this.checkPossibleActions();
    })

    this.socket.on('first', player => {
      if (this.state.identity === player) {
        this.setState({ setupCorner: true }, function () { this.toggleSetupCorner('on') });
      }
    })

    this.socket.on('robber', player => {
      this.toggleUI();
      this.state.moveRobber = true;
    })

    this.socket.on('moveRobber', tile => {
      let index = this.state.robbedTile;
      let temp = this.state.tiles;
      if (index) {
        temp[index].has_robber = false;
      }

      temp[tile].has_robber = true;
      let robber = this.scene.getMeshByID('NonClickRobber');
      let targetTile = this.scene.getMeshByID('Tile' + tile);
      robber.position.x = targetTile.position.x;
      robber.position.z = targetTile.position.z;
      this.setState({
        robbedTile: tile,
        tiles: temp
      });
    })

    this.socket.on('playedCardMonopoly', obj => {
      let players = this.state.players;
      let player = this.state.players[obj.player];
      let resource = obj.resource;

      for (let i = 1; i < players.length; i++) {
        if (i !== obj.player) {
          while (players[i][resource] > 0) {
            players[i][resource]--
            players[i].total_resources--
            player[resource]++
            player.total_resources++
          }
        }
      }

    })

    this.socket.on('tradeWithBank', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      let board = players[0];

      board[obj.taking]--;
      player[obj.taking]++;
      player.total_resources += 1;

      board[obj.giving] += obj.amount;
      player[obj.giving] -= obj.amount;

      player.total_resources -= obj.amount;

      this.setState({ players: players });
    })

    this.socket.on('postTrade', obj => {
      let players = this.state.players;
      let player = players[obj.player];
      player.posted_trade = obj.active;
      this.setState({players: players});

    })


    ///////////////////////////////////////
    this.socket.on('cheatSkipSetup', obj => {

      let allPlayers = this.state.players;
      allPlayers[1].owns_road = [58, 61];
      allPlayers[2].owns_road = [68, 71];
      allPlayers[3].owns_road = [37, 40];
      allPlayers[4].owns_road = [44, 47];

      allPlayers[1].owns_settlement = [43, 45];
      allPlayers[2].owns_settlement = [50, 52];
      allPlayers[3].owns_settlement = [28, 30];
      allPlayers[4].owns_settlement = [33, 35];

      let allRoads = this.state.roads;
      allRoads[58].owner = 1;
      allRoads[61].owner = 1;
      allRoads[68].owner = 2;
      allRoads[71].owner = 2;
      allRoads[37].owner = 3;
      allRoads[40].owner = 3;
      allRoads[44].owner = 4;
      allRoads[47].owner = 4;

      let allSettlements = this.state.settlements;
      allSettlements[43].owner = 1;
      allSettlements[45].owner = 1;
      allSettlements[50].owner = 2;
      allSettlements[52].owner = 2;
      allSettlements[28].owner = 3;
      allSettlements[30].owner = 3;
      allSettlements[33].owner = 4;
      allSettlements[35].owner = 4;

      this.colorPiece('House43', this.createMat(1));
      this.colorPiece('House45', this.createMat(1));
      this.colorPiece('Road58', this.createMat(1));
      this.colorPiece('Road61', this.createMat(1));

      this.colorPiece('House50', this.createMat(2));
      this.colorPiece('House52', this.createMat(2));
      this.colorPiece('Road68', this.createMat(2));
      this.colorPiece('Road71', this.createMat(2));

      this.colorPiece('House28', this.createMat(3));
      this.colorPiece('House30', this.createMat(3));
      this.colorPiece('Road37', this.createMat(3));
      this.colorPiece('Road40', this.createMat(3));

      this.colorPiece('House33', this.createMat(4));
      this.colorPiece('House35', this.createMat(4));
      this.colorPiece('Road44', this.createMat(4));
      this.colorPiece('Road47', this.createMat(4));

      this.setState({
        players: allPlayers,
        roads: allRoads,
        settlements: allSettlements,
        canRollForFirst: false
      })

      if (this.state.identity === 1) {
        this.setState({ active: true });
      }

    })
    ////////////////////////////////////////////

  }
  /////////// END SOCKET LISTENERS ///////////




  render() {

    return ( <div>
      
      <button id={1} onClick={this.robber}>Steal from Player 1</button> 
      <button onClick={()=> {console.log(this.state)}}>SEE EVERYTHING!</button>
      <button onClick={this.cheatSkipSetup}>Skip Setup Phase</button>

      <Menu>
        <Menu.Item onClick={() => {console.log('NavBar: Lobby clicked')}}>Lobby</Menu.Item>
        <Menu.Item onClick={() => {console.log('NavBar: Game clicked')}}>Game</Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item className="menuTitle">Colonies of Cotton</Menu.Item>
        </Menu.Menu>
      </Menu>

      <Card style={{width: "24%", display: "inline-block"}}>
      <Card.Content>
      <Card.Header>{'Player ' + this.state.identity + ', in room: ' + this.state.room}</Card.Header>

        <Card.Description className="playerInfoCard">
      {(this.state.roads.length > 0) ?
        <span>
          <Image size='mini' src={'../../PNGs/resources.png'}/>
          <span>{this.state.players[this.state.identity].total_resources}</span>
          <Image size='mini' src={'../../PNGs/development.png'}/>
          <span>{this.state.players[this.state.identity].card_knight + this.state.players[this.state.identity].card_road + this.state.players[this.state.identity].card_monopoly + this.state.players[this.state.identity].card_plenty + this.state.players[this.state.identity].card_victory}</span>
          <Image size='mini' src={'../../PNGs/knight.png'}/>
          <span>{this.state.players[this.state.identity].played_card_knight}</span>
          <Image size='mini' src={'../../PNGs/victory.png'}/>
          <span>{this.calculateScore(this.state.identity) + this.state.players[this.state.identity].card_victory}</span>
          <Image size='mini' src={'../../PNGs/road.png'}/>
          <span>{this.state.players[this.state.identity].owns_road.length}</span>
        </span> : <div>Waiting for other players...</div>

        
      }

        </Card.Description>
      </Card.Content>
      </Card>

      


      {this.state.players.map((player, index) => {
        if (this.state.roads.length > 0 && this.state.players[player.id].id !== this.state.identity && player.id !== 0) {
        
          function getColor(player) {
            let color = '';
            if (player === 1) {
              color = 'red';
              {/* color = 'hsl(0.569, 0, 0)';  */}
            } else if (player === 2) {
              color = 'yellow';
              {/* color = 'hsl(0.875, 0.620, 0.106)';  */}
            } else if (player === 3) {
              color = 'blue';
              {/* color = 'hsl(0.063, 0.145, 0.259)';  */}
            } else if (player === 4) {
              color = 'green';
              {/* color = 'hsl(0.071, 0.337, 0.047)';  */}
            }

            return color;
          }

          function styleIfActive(player) {
            let style = {width: "22%", display: "inline-block"};
            if (player.is_active_player) {
              style = {width: "22%", display: "inline-block", "box-shadow": "-0px -0px 3px 3px red"};
            }
            return style;
          }

          return (

            <Card key={index} className="playerInfoCard" color={getColor(player.id)} style={styleIfActive(player)}>
              <Card.Content onClick={this.robber} id={player.id}>
              
              <Card.Header onClick={this.robber} id={player.id} style={{backgroundColor: getColor(player.id)}}>
              <strong>{player.user_number_label}</strong>
              {player.is_active_player ? <span>'s turn.</span> : null}
              
              <Popup
              trigger={(player.has_biggest_army) ?
              <Image className="bonusPointIcon" floated='right' src={'../../PNGs/knight.png'}/>
              : null}
              content={<span><strong>Largest Army:</strong> <br></br>2 Victory Points!<br></br>
              The first player to play 3 Knight cards gets this card. Another player who plays more Knight cards takes this card.</span>}
              hideOnScroll
              />

              <Popup
              trigger={(player.has_longest_road) ?
              <Image className="bonusPointIcon" floated='right' src={'../../PNGs/road.png'}/>
              : null}
              content={<span><strong>Longest Road:</strong> <br></br>2 Victory Points!<br></br>
              This card goes to the player with the longest unbroken road of at least 5 segments. Another player who builds a longer road takes this card.</span>}
              hideOnScroll
              />
              </Card.Header>

              <Card.Description>
                  
                  <Popup
                  trigger={<span><Image size='mini' src={'../../PNGs/resources.png'}/>
                  <span>{player.card_brick + player.card_grain + player.card_lumber + player.card_ore + player.card_wool}</span></span>}
                  content={<span>Resource cards in hand</span>}
                  hideOnScroll
                  />

                  <Popup
                  trigger={<span><Image size='mini' src={'../../PNGs/development.png'}/>
                  <span>{player.card_knight + player.card_road + player.card_monopoly + player.card_plenty + player.card_victory}</span></span>}
                  content={<span>Development cards in hand</span>}
                  hideOnScroll
                  />

                  <Popup
                  trigger={<span><Image size='mini' src={'../../PNGs/knight.png'}/>
                  <span>{player.played_card_knight}</span></span>}
                  content={<span>Knight cards played</span>}
                  hideOnScroll
                  />

                  <Popup
                  trigger={<span><Image size='mini' src={'../../PNGs/victory.png'}/>
                  <span>{this.calculateScore(player.id)}</span></span>}
                  content={<span>Victory points</span>}
                  hideOnScroll
                  />

                  <Popup
                  trigger={<span><Image size='mini' src={'../../PNGs/road.png'}/>
                  <span>{player.owns_road.length}</span></span>}
                  content={<span>Roads built</span>}
                  hideOnScroll
                  />

            {player.posted_trade ?  
              <div>
                <span>
                <span>Player Wants</span>
                  {player.posted_trade.wanting.card_brick > 0 && <span><Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}}/>{player.posted_trade.wanting.card_brick}</span>}
                  {player.posted_trade.wanting.card_grain > 0 && <span><Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}}/>{player.posted_trade.wanting.card_grain}</span>}
                  {player.posted_trade.wanting.card_lumber > 0 && <span><Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}}/>{player.posted_trade.wanting.card_lumber}</span>}
                  {player.posted_trade.wanting.card_wool > 0 && <span><Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}}/>{player.posted_trade.wanting.card_wool}</span>}
                  {player.posted_trade.wanting.card_ore > 0 && <span><Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}}/>{player.posted_trade.wanting.card_ore}</span>}
                </span>
                <span>
                <span>For</span>
                  {player.posted_trade.offering.card_brick > 0 && <span><Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}}/>{player.posted_trade.offering.card_brick}</span>}
                  {player.posted_trade.offering.card_grain > 0 && <span><Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}}/>{player.posted_trade.offering.card_grain}</span>}
                  {player.posted_trade.offering.card_lumber > 0 && <span><Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}}/>{player.posted_trade.offering.card_lumber}</span>}
                  {player.posted_trade.offering.card_wool > 0 && <span><Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}}/>{player.posted_trade.offering.card_wool}</span>}
                  {player.posted_trade.offering.card_ore > 0 && <span><Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}}/>{player.posted_trade.offering.card_ore}</span>}
                </span>
                {!this.state.players[this.state.identity].accepted_trade ? <Button positive size="small" onClick={this.agreeToTrade}>Accept Trade</Button> : <Button negative size="small" onClick={this.cancelAgreement}>Cancel</Button>}
              </div> 
              : null}

              {this.state.active && player.accepted_trade && <Button positive size="small" id={player.id} onClick={this.finalizeTrade}>Agrees To Trade</Button>}

              </Card.Description>
              </Card.Content>
            </Card>

          )

        }
      })}


      <Grid>






      <Grid.Column width={4} className="compStatusActions">


      {(this.state.roads.length > 0) ?
        <span>
    

      {/* START MY STATS */}

      <strong>My Resources: </strong>
      <br></br>
      <div className="resourceBar">
      
      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}}/>
      <span id="card_brick" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_brick}</span></span>} 
      content={<span><strong>Resource:</strong> Brick</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}}/>
      <span id="card_grain" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_grain}</span></span>} 
      content={<span><strong>Resource:</strong> Grain</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}}/>
      <span id="card_lumber" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_lumber}</span></span>} 
      content={<span><strong>Resource:</strong> Lumber</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}}/>
      <span id="card_wool" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_wool}</span></span>} 
      content={<span><strong>Resource:</strong> Wool</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}}/>
      <span id="card_ore" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_ore}</span></span>} 
      content={<span><strong>Resource:</strong> Ore</span>}
      hideOnScroll
      />

      </div>

    <br></br>
    <strong>My Dev Cards: </strong>
    <br></br>

      <div className="devCardBar">

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/knight.png'} style={{display: "inline-block"}}/>
      <span id="card_knight" disabled={true} style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_knight}</span></span>}
      content={<span><strong>Knight:</strong> Move the robber. Steal 1 resource from the owner of a settlement or city adjacent to the robber's new hex.</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/road.png'} style={{display: "inline-block"}}/>
      <span id="card_road" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_road}</span></span>}
      content={<span><strong>Road Building:</strong> Place (up to) 2 new roads as if you had just built them.</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/monopoly.png'} style={{display: "inline-block"}}/>
      <span id="card_monopoly" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_monopoly}</span></span>}
      content={<span><strong>Monopoly:</strong> When you play this card, announce 1 type of resource. All other players must give you <strong>all</strong> of their resources of that type.</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/plenty.png'} style={{display: "inline-block"}}/>
      <span id="card_plenty" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_plenty}</span></span>}
      content={<span><strong>Year of Plenty:</strong> Take any 2 resources from the bank. They can be 2 of the same resource or 2 different resources.</span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/victory.png'} style={{display: "inline-block"}}/>
      <span id="card_victory" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].card_victory}</span></span>}
      content={<span><strong>Victory Point:</strong> 1 Victory Point!</span>}
      hideOnScroll
      />

      </div>

    <br></br>
    <strong>My Properties: </strong>
    <br></br>

      <div className="buildingsBar">

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/piece_road.png'} style={{display: "inline-block"}}/>
      <span id="owns_road" disabled={true} style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].owns_road.length}</span></span>}
      content={<span><strong>Roads Owned</strong></span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/piece_settlement.png'} style={{display: "inline-block"}}/>
      <span id="owns_settlement" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].owns_settlement.length}</span></span>}
      content={<span><strong>Settlements Owned</strong></span>}
      hideOnScroll
      />

      <Popup
      trigger={<span><Image size='mini' src={'../../PNGs/piece_city.png'} style={{display: "inline-block"}}/>
      <span id="owns_city" style={{display: "inline-block"}}></span><span style={{display: "inline-block"}}>{this.state.players[this.state.identity].owns_city.length}</span></span>}
      content={<span><strong>Cities Owned</strong></span>}
      hideOnScroll
      />

      </div>


    <br></br>
    <br></br>

      {/* END MY STATS */}


      {/* START PLAYER ACTIONS */}

    <strong>Actions: </strong>


    {this.state.players[this.state.identity].posted_trade
        ?  
        <div className="resourceBar">
          <span>
          <span>You Want</span>
            {this.state.players[this.state.identity].posted_trade.wanting.card_brick > 0 && <span><Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.wanting.card_brick}</span>}
            {this.state.players[this.state.identity].posted_trade.wanting.card_grain > 0 && <span><Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.wanting.card_grain}</span>}
            {this.state.players[this.state.identity].posted_trade.wanting.card_lumber > 0 && <span><Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.wanting.card_lumber}</span>}
            {this.state.players[this.state.identity].posted_trade.wanting.card_wool > 0 && <span><Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.wanting.card_wool}</span>}
            {this.state.players[this.state.identity].posted_trade.wanting.card_ore > 0 && <span><Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.wanting.card_ore}</span>}
          </span>
          <span>
          <span>For</span>
            {this.state.players[this.state.identity].posted_trade.offering.card_brick > 0 && <span><Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.offering.card_brick}</span>}
            {this.state.players[this.state.identity].posted_trade.offering.card_grain > 0 && <span><Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.offering.card_grain}</span>}
            {this.state.players[this.state.identity].posted_trade.offering.card_lumber > 0 && <span><Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.offering.card_lumber}</span>}
            {this.state.players[this.state.identity].posted_trade.offering.card_wool > 0 && <span><Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.offering.card_wool}</span>}
            {this.state.players[this.state.identity].posted_trade.offering.card_ore > 0 && <span><Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}}/>{this.state.players[this.state.identity].posted_trade.offering.card_ore}</span>}
          </span>
          <Button negative size='small' onClick={this.cancelTradePost}>Remove Trade Offer</Button>
        </div> 
        : null}
        



      {this.state.tradeMenuOpen ?
        <div className="resourceBar">
          <div>
            <div><strong>Offering:</strong></div>
            <span className="resourceBar">
            <Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}} id="card_brick" onMouseDown={this.changeOffering}/>
            <span>{this.state.players[this.state.identity].active_trade.offering.card_brick}</span>
            <Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}} id="card_grain" onMouseDown={this.changeOffering}/>
            <span>{this.state.players[this.state.identity].active_trade.offering.card_grain}</span>
            <Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}} id="card_lumber" onMouseDown={this.changeOffering}/>
            <span>{this.state.players[this.state.identity].active_trade.offering.card_lumber}</span>
            <Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}} id="card_wool" onMouseDown={this.changeOffering}/>
            <span>{this.state.players[this.state.identity].active_trade.offering.card_wool}</span>
            <Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}} id="card_ore" onMouseDown={this.changeOffering}/>
            <span>{this.state.players[this.state.identity].active_trade.offering.card_ore}</span>
            </span>
            <div><strong>Wanting:</strong></div>
            <span className="resourceBar">
            <Image size='mini' src={'../../PNGs/brick.png'} style={{display: "inline-block"}} id="card_brick" onMouseDown={this.changeWanting}/>
            <span>{this.state.players[this.state.identity].active_trade.wanting.card_brick}</span>
            <Image size='mini' src={'../../PNGs/grain.png'} style={{display: "inline-block"}} id="card_grain" onMouseDown={this.changeWanting}/>
            <span>{this.state.players[this.state.identity].active_trade.wanting.card_grain}</span>
            <Image size='mini' src={'../../PNGs/lumber.png'} style={{display: "inline-block"}} id="card_lumber" onMouseDown={this.changeWanting}/>
            <span>{this.state.players[this.state.identity].active_trade.wanting.card_lumber}</span>
            <Image size='mini' src={'../../PNGs/wool.png'} style={{display: "inline-block"}} id="card_wool" onMouseDown={this.changeWanting}/>
            <span>{this.state.players[this.state.identity].active_trade.wanting.card_wool}</span>
            <Image size='mini' src={'../../PNGs/ore.png'} style={{display: "inline-block"}} id="card_ore" onMouseDown={this.changeWanting}/>
            <span>{this.state.players[this.state.identity].active_trade.wanting.card_ore}</span>
            </span>
          </div>
          <Button size="small" onClick={this.postTrade}>Offer Trade</Button>
          <Button size="small" onClick={this.tradeWithBank}>Trade With Bank</Button>
          <Button negative size="small" onClick={this.cancelTradeMenu}>Cancel Trading</Button>
        </div>

        : null}





    {/* END TRADE */}




      {/* START vertical action buttons */}
     <div class="ui vertical buttons">

    {this.state.canRollForFirst ? <Button onClick={this.rollForFirst}>Roll to determine turn order</Button> : null}

    {this.state.needResourceBar ?
      <div>
        <strong>{this.state.instruction}</strong>
        <div className="resourceBar">
        <Image size='mini' src={'../../PNGs/brick.png'} id="card_brick" onClick={this.handleResourceClick} style={{display: "inline-block"}}/>
        <Image size='mini' src={'../../PNGs/grain.png'} id="card_grain" onClick={this.handleResourceClick} style={{display: "inline-block"}}/>
        <Image size='mini' src={'../../PNGs/lumber.png'} id="card_lumber" onClick={this.handleResourceClick} style={{display: "inline-block"}}/>
        <Image size='mini' src={'../../PNGs/wool.png'} id="card_wool" onClick={this.handleResourceClick} style={{display: "inline-block"}}/>
        <Image size='mini' src={'../../PNGs/ore.png'} id="card_ore" onClick={this.handleResourceClick} style={{display: "inline-block"}}/>
        </div>
      </div> : null
    }

    {this.state.isPlayingDevCard ?
      <div>
      <span className="resourceBar">
          {(!this.state.interfaceToggled) ? <span><Button type="button" id="playcardknight" onClick={this.playingCardKnight} disabled={!this.state.ableToPlayCardKnight}>Play Card: Knight</Button><span>{this.state.players[this.state.identity].card_knight}</span></span> : null}
          {(!this.state.interfaceToggled) ? <span><Button type="button" id="playcardroad" onClick={this.playingCardRoad} disabled={!this.state.ableToPlayCardRoad}>Play Card: Road Building</Button><span>{this.state.players[this.state.identity].card_road}</span></span> : null}
          {(!this.state.interfaceToggled) ? <span><Button type="button" id="playcardmonopoly" onClick={this.playingCardMonopoly} disabled={!this.state.ableToPlayCardMonopoly}>Play Card: Monopoly</Button><span>{this.state.players[this.state.identity].card_monopoly}</span></span>: null}
          {(!this.state.interfaceToggled) ? <span><Button type="button" id="playcardplenty" onClick={this.playCardPlenty} disabled={!this.state.ableToPlayCardPlenty}>Play Card: Plenty</Button><span>{this.state.players[this.state.identity].card_plenty}</span></span> : null}
      </span>
      </div> : null
    }

    {this.state.isBuying ?
    <div>
    <span className="resourceBar">
    <Button.Group vertical>
      {(!this.state.interfaceToggled) ? <Button type="button" id="buysettlement" onClick={this.toggleBuyRoad} disabled={!this.state.ableToBuyRoad}>Buy Road</Button> : null}
      {(!this.state.interfaceToggled) ? <Button type="button" id="buysettlement" onClick={this.toggleBuySettlement} disabled={!this.state.ableToBuySettlement}>Buy Settlement</Button> : null}
      {(!this.state.interfaceToggled) ? <Button type="button" id="buycity" onClick={this.toggleBuyCity} disabled={!this.state.ableToBuyCity}>Buy City</Button> : null}
      {(!this.state.interfaceToggled) ? <Button type="button" id="buydevcard" onClick={this.buyingDevelopmentCard} disabled={!this.state.ableToBuyDevelopmentCard}>Buy Development Card</Button> : null}
    </Button.Group>
    </span>
    </div>:null}
    
    <Button.Group vertical>
      {(!this.state.hasRolled && this.state.active && !this.state.interfaceToggled) ? <Button type="button" onClick={this.diceRoll}>Roll Dice</Button> : null}
      {(this.state.hasRolled && this.state.active && !this.state.interfaceToggled) ? <Button type="button" onClick={this.openTradeMenu}>Trade</Button> : null}
      {(this.state.hasRolled && this.state.active && !this.state.interfaceToggled) ? <Button onClick={this.toggleBuying}>Buy</Button> : null}
      {(!this.state.players[this.state.identity].has_played_development_card && this.state.active && !this.state.interfaceToggled) ? <Button onClick={this.togglePlayingDev}>Play Dev Card</Button> : null}
      {(this.state.hasRolled && this.state.active && !this.state.interfaceToggled) ? <Button negative onClick={this.endTurn}>End Turn</Button> : null}
    </Button.Group>

    {/* END vertical action buttons */}

    {/* END PLAYER ACTIONS */}
    <br></br>
    <br></br>



    </div>
    </span> : null }
      </Grid.Column>






        <Grid.Column width={8}>
          <Scene className="compBoard" onSceneMount={this.onSceneMount} onMeshPicked={this.onMeshPicked} visible={true}/>  
        </Grid.Column>



        <Grid.Column width={4} className="gridMessageLogColumn">
          <Messagelog messages={this.state.messages} handleSubmitMessage={this.handleSubmitMessage}/>  
        </Grid.Column>



      </Grid>

    <br></br>



          <div>By: Team HoneyBadgers</div>
     </div>)
  }


}


export default Game;
