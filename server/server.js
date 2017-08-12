const express = require('express');
const http = require('http');
const parser = require('body-parser');
const socketIo = require('socket.io');

const PORT = 3000;
const App = express();
const server = http.createServer(App);
const io = socketIo(server);
const initial = require('../data.json');

App.use(express.static('client'));
App.use(parser.urlencoded({extended: false}));
server.listen(3000, (err) => {
    if(err){
        console.log('error');
    } else {
        console.log('listening on 3000');
    }
});

function initiateGame(gamedata) {

  // constants for board pieces
  const letters = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
  const terrain = ['grain', 'grain', 'grain', 'grain', 'brick', 'brick', 'brick', 'ore', 'ore', 'ore', 'lumber', 'lumber', 'lumber', 'lumber', 'wool', 'wool', 'wool', 'wool', 'desert'];

  const shuffle = function(array) {
    let arr = array.slice();
    let currentIndex = arr.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }
    return arr;
  };


  const shuffled = shuffle(terrain);
  let output = [];
  shuffled.forEach((field) => {
      let temp = {};
      
      temp.field = field;
      if(field !== 'desert'){
      temp.diceTrigger = letters.shift();
      } else {
          temp.diceTrigger = null;
      }
      
      output.push(temp);
  });

  // boardTiles is an array of objects denoting the tiles
  const boardTiles = output;

  // update gamestate object with tileset
  for (let i = 0; i < 19;  i++) {
    gamedata.tiles[i + 1].terrain = boardTiles[i].field;
    gamedata.tiles[i + 1].dice_trigger_value = boardTiles[i].diceTrigger;
  }

  return gamedata;

  // roll initial dice for each player // for starting purpose, turn order will be fixed at first
  // update gamestate object with turnorder // for starting purpose, turn order will be fixed at first

  // place settlement/road in order (wait between players)
  // update gamestate object with placed settlements/roads (as they are placed)

  // set first player to active player
  // start turn


}






var room = 0;
var highest = 0;
var counter = 0;
var first = null;
var rolls = 0;

io.on('connection', socket => {
    counter ++;
    socket.emit('identity', counter);
    socket.join(room.toString());

    if(counter === 4){
        const game = initiateGame(initial);
        game.game_session_id = room.toString();
        counter = 0;
        io.sockets.in(room.toString()).emit('start', game);
        room ++;
    }

    socket.on('message', body => {
        let room = body.room;
        let message = {
            text: body.text,
            user: body.user
        }

        io.sockets.in(room).emit('message', message);
    })

    socket.on('firstRoll', obj => {
        let player = obj.player
        let total = obj.roll
        rolls ++
        let message = {
            text: "Player" + player + " rolled a " + total,
            user: "COMPUTER"
        }
        
        io.sockets.in(obj.room).emit('message', message);
        if(total > highest){
            highest = total
            first = player
        }
        if(rolls === 4){
            io.sockets.in(obj.room).emit('message', {user: "COMPUTER", text: "Player" + first + " goes first."})
            io.sockets.in(obj.room).emit('first', first);
            rolls = 0;
        }
    })



    socket.on('diceRoll', obj => {
        let room = obj.room;
        let message = {
                        text: 'player' + obj.player + ' rolled a ' + obj.total,
                        user: "COMPUTER"
                    }

        
        io.sockets.in(room).emit('message', message);

        if(obj.total !== 7){
            io.sockets.in(room).emit('diceRoll', obj.total);
        } else {
            socket.emit('robber', obj.player);
            message.text = 'player'+obj.player+ ' needs to move the robber';
            io.sockets.in(room).emit('message', message);
        }
    })

    socket.on('moveRobber', obj => {
        io.sockets.in(obj.room).emit('moveRobber', obj.tile);
    })

    socket.on('rob', obj => {
        io.sockets.in(obj.room).emit('rob', obj);
    })


    socket.on('endTurn', obj => {
        io.sockets.in(obj.room).emit('endTurn', obj.player)
    })

    socket.on('buyRoad', obj => {
        let message = {
            text: 'Player' + obj.player + ' buys a road.',
            user:'COMPUTER'
        }

        io.sockets.in(obj.room).emit('message', message);
        io.sockets.in(obj.room).emit('buyRoad', obj);
    })

    socket.on('buySettlement', obj => {
        let message = {
            text: 'Player' + obj.player + ' buys a settlement.',
            user: 'COMPUTER'
        }

        io.sockets.in(obj.room).emit('message', message);
        io.sockets.in(obj.room).emit('buySettlement', obj);
    })

    socket.on('buyCity', obj => {
        let message = {
            text:  'Player' + obj.player + ' buys a city.',
            user: 'COMPUTER'
        }

        io.sockets.in(obj.room).emit('message', message);
        io.sockets.in(obj.room).emit('buyCity', obj);
    })

    socket.on('buyDev', obj => {
        let message = {
            text:  'Player' + obj.player + ' buys a development card.',
            user: "COMPUTER"
        };

        io.sockets.in(obj.room).emit('message', message);
        io.sockets.in(obj.room).emit('buyDev', obj);
    })

    socket.on('settingSettlement', obj => {
        io.sockets.in(obj.room).emit('settingSettlement', obj);
    })

    socket.on('settingRoad', obj => {
        io.sockets.in(obj.room).emit('settingRoad', obj);
    })

  socket.on('playedCardRoadNull', obj => {
    let message = {
      text: 'Player' + obj.player + ' plays: ' + obj.card + ', with no effect.',
      user: "COMPUTER"
    };

    io.sockets.in(obj.room).emit('message', message);
    io.sockets.in(obj.room).emit('playedCardRoadNull', obj);
  })



  socket.on('playedCardRoad', obj => {
    let message = {
      text: 'Player' + obj.player + ' plays: ' + obj.card + ', and builds roads at ' + JSON.stringify(obj.roadsBought),
      user: "COMPUTER"
    };

    io.sockets.in(obj.room).emit('message', message);
    io.sockets.in(obj.room).emit('playedCardRoad', obj);
  })


  socket.on('playedCardMonopoly', obj => {
    let message = {
        text: 'Player' + obj.player + ' plays: ' + obj.card + ', and gets all ' + obj.resourceType,
        user: "COMPUTER"
    };

    io.sockets.in(obj.room).emit('message', message);
    io.sockets.in(obj.room).emit('playedCardMonopoly', obj);
  })

  socket.on('playingDev', obj =>{
      let message = {
          text: "Player" + obj.player + " plays " + obj.dev + "!",
          user: "COMPUTER"
      }
    io.sockets.in(obj.room).emit('message', message);
  })

  socket.on('playedCardPlenty', obj => {
      let message = {
          text: 'Player' + obj.player + " takes a " + obj.resource.slice(5) + "!",
          user: "COMPUTER"
      }
      io.sockets.in(obj.room).emit('message', message);
      io.sockets.in(obj.room).emit('playedCardPlenty', obj);
  })



//////////////////////////////////////////
    socket.on('cheatSkipSetup', obj => {
    let message = {
        text: 'Skipping Setup phase!',
        user: "COMPUTER"
    };

    io.sockets.in(obj.room).emit('message', message);
    io.sockets.in(obj.room).emit('cheatSkipSetup');
  })
///////////////////////////////////////////


})