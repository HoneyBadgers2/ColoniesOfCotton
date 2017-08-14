const express = require('express');
const http = require('http');
const parser = require('body-parser');
const socketIo = require('socket.io');
const db = require('../db/mongo');
const data = require('../data.json');

const port = process.env.PORT || 3000;
const App = express();
const server = http.createServer(App);
const io = socketIo(server);
const initial = require('../data.json');

//comment

App.use(express.static('client'));
App.use(parser.urlencoded({extended: false}));
App.use(parser.json());
server.listen(port, (err) => {
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


// Post and retrieve games. 

App.post('/newGame', function (req, res){
    db.Game.create({
        game_session_id: req.body.game_session_id,        
        players: data.players,
        settlements: data.settlements,
        tiles: data.tiles,
        roads: data.roads
    }).then(function (data){
    res.status(201).send(data)
    }).catch(function (err){
    return console.log(err)
    })
}); 

App.get('/games', function (req, res){
    db.Game.find({})
    .then(function (data){
    res.status(200).send(data)
    }).catch(function (err){
    return console.log(err)
    })
});

io.on('connection', socket => {
    socket.on('joining', roomName => {
        console.log(roomName)
        socket.join(roomName);
        io.sockets.in(roomName).emit('joined', roomName);
    })

    socket.on('start', (roomName) => {
        const game = initiateGame(initial);
        
        io.sockets.in(roomName).emit('start', game);
    })

    socket.on('message', body => {
        let room = body.room;
        let message = {
            text: body.text,
            user: body.user
        }

        io.sockets.in(room).emit('message', message);
    })

    socket.on('cancelTradePost', obj => {
        io.sockets.in(obj.room).emit('cancelTradePost', obj.player)
    })

    socket.on('firstRoll', obj => {
        let player = obj.player
        let total = obj.roll
        let message = {
            text: "Player" + player + " rolled a " + total,
            user: "COMPUTER"
        }
        
        io.sockets.in(obj.room).emit('message', message);
        io.sockets.in(obj.room).emit('firstRoll', obj);
    })


    socket.on('first', obj => {
        io.sockets.in(obj.room).emit('message', {user: "COMPUTER", text: "Player" + obj.first + " goes first."})
        io.sockets.in(obj.room).emit('first', obj.first);
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
        io.sockets.in(obj.room).emit('message', {text: "Player" + obj.player + " moves the Robber!", user: "COMPUTER"})
        io.sockets.in(obj.room).emit('moveRobber', obj.tile);
    })

    socket.on('rob', obj => {
        let message = {
            text: "Player" + obj.player + " takes a resource from Player" + obj.target + "!",
            user: "COMPUTER"
        };
        socket.broadcast.to(obj.room).emit('message', message);
        socket.emit('message', {user: "COMPUTER", text: "You stole a " + obj.resource.slice(5)})
        io.sockets.in(obj.room).emit('rob', obj);
    })


    socket.on('endTurn', obj => {
        let message = {
            text: "Player" + obj.player + "'s turn!",
            user: "COMPUTER" 
        }
        io.sockets.in(obj.room).emit('message', message);
        io.sockets.in(obj.room).emit('endTurn', obj);
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


    socket.on('roadBuilding', obj => {
      let message = {
          text: 'Player' + obj.player + ' builds a road!',
          user: 'COMPUTER'
      }
        io.sockets.in(obj.room).emit('message', message);
        socket.broadcast.to(obj.room).emit('roadBuilding', obj);
  })


  socket.on('playedCardMonopoly', obj => {
      io.sockets.in(obj.room).emit('playedCardMonopoly', obj);
      let message = {
          text: "Player" + obj.player + " steals everyone's " + obj.resource.slice(5) + "!",
          user: "COMPUTER"
      }
      io.sockets.in(obj.room).emit('message', message);
  })

  socket.on('playingDev', obj =>{
      let message = {
          text: "Player" + obj.player + " plays " + obj.dev + "!",
          user: "COMPUTER"
      }
    io.sockets.in(obj.room).emit('message', message);
    io.sockets.in(obj.room).emit('playedDev', {player: obj.player, card: obj.card});
  })

  socket.on('playedCardPlenty', obj => {
      let message = {
          text: 'Player' + obj.player + " takes a " + obj.resource.slice(5) + "!",
          user: "COMPUTER"
      }
      io.sockets.in(obj.room).emit('message', message);
      io.sockets.in(obj.room).emit('playedCardPlenty', obj);
  })

  socket.on('tradeWithBank', obj => {
      let message = {
          text: "Player" + obj.player + " trades " + obj.amount + " " + obj.giving.slice(5) + " for 1 " + obj.taking.slice(5),
          user: "COMPUTER"
      }
      io.sockets.in(obj.room).emit('message', message);
      io.sockets.in(obj.room).emit('tradeWithBank', obj);
  })

  socket.on('endGame', obj => {
      let message = {
          text: "Player" + obj.player + " wins the game with "  + obj.score + " Points and " + obj.victory + " Victory Points!",
          user: "Computer"
      }
    io.sockets.in(obj.room).emit('message', message);
    io.sockets.in(obj.room).emit('endGame');
  })

  socket.on('postTrade', obj => {
      io.sockets.in(obj.room).emit('postTrade', obj);
  })

  socket.on('agreesToTrade', obj => {
      io.sockets.in(obj.room).emit('agreesToTrade', obj);
  })

  socket.on('finalizeTrade', obj => {
      io.sockets.in(obj.room).emit('message', {text: "Player" + obj.player + " trades with Player" + obj.trader, user: "COMPUTER"})
      io.sockets.in(obj.room).emit('finalizeTrade', obj);
  })

  socket.on('cancelAgreement', obj => {
      io.sockets.in(obj.room).emit('cancelAgreement', obj);
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
//////////////////////////////////////////

})