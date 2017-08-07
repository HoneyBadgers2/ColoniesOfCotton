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








var counter = 0;
io.on('connection', socket => {
    counter ++
    socket.emit('identity', counter);

    socket.on('message', body => {
        io.sockets.emit('message', body);
    })
    const game = initiateGame(initial);
    if(counter === 4){
    io.sockets.emit('start', game);
    counter = 0;
    io.sockets.emit('endTurn', 1);
    }

    socket.on('diceRoll', total => {
        io.sockets.emit('diceRoll', total);
    })

    socket.on('endTurn', player => {
        io.sockets.emit('endTurn', player)
    })
})