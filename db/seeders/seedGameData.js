const mongoose = require('mongoose');
const data = require('../../data.json')
const {Game} = require('../mongo')
const path = require('path');

mongoose.connect();
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('THE DB CONNECTED.')

  Game.collection.drop();

  let game = new Game({
    game_session_id: 1,
    players: data.players,
    settlements: data.settlements,
    tiles: data.tiles,
    roads: data.roads
  });

  game.save((err, game) => {
    if(err) console.log(err, 'HEY THIS IS ERROR')
    console.log(game)
  });
});