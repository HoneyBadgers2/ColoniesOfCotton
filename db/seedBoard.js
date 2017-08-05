//Dependencies
const mongoose = require ('mongoose');
const path = require('path');
const data = require('../BoardData.json');
const db = mongoose.connection;
const {Player} = require('./mongo');
const dotenv = require('dotenv').config();


const boardSeeder = () => {
//Mongoose Connection
mongoose.connect(process.env.DB_URL);
//Connection to Database
db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
db.once('open', function () {
  console.log('Database has created a succesful connection.')
  // Truncate Table 
  Player.collection.drop();
  // Seeding
    data.forEach((player) => {
      const newPlayer = Player.create({
      id: player.id,
      user_player_label: player.user_player_label,
      display_name: player.display_name,
      turn_counter: player.turn_counter,
      player_points: player.player_points,
      owns_road: player.owns_road,
      owns_settlement: player.owns_settlement,
      owns_city: player.owns_city,
      played_card_knight: player.played_card_knight,
      played_card_road: player.played_card_road,
      played_card_monopoly: player.played_card_monopoly,
      played_card_plenty: player.played_card_plenty,
      played_card_victory: player.played_card_victory,
      has_longest_road: player.has_longest_road,
      has_biggest_army: player.has_biggest_army,
      card_brick: player.card_brick,
      card_grain: player.card_grain,
      card_lumber: player.card_lumber,
      card_ore: player.card_ore,
      card_wool: player.card_wool,
      card_knight: player.card_knight,
      card_road: player.card_road,
      card_monopoly: player.card_monopoly,
      card_plenty: player.card_plenty,
      card_victory: player.card_victory
      }, 
      function (err) {
        console.log(err)
      });
    });
  });
};

boardSeeder();

