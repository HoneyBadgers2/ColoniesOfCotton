//Dependencies
const mongoose = require ('mongoose');
require('dotenv').config();
require('dotenv').load();


//Mongoose Connection
// mongoose.connect(process.env.DB_URL);
// const db = mongoose.connection;

//DB Connection 
// db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
// db.once('open', function () {
//   console.log('Database has created a succesful connection.')
// });


// Board Schema
const BoardSchema = mongoose.Schema ({
  id: Number,
  user_number_label: String,
  display_name: String,
  turn_order: Number,
  turn_counter: Number,
  is_active_player: Boolean,
  has_played_development_card: Boolean,
  player_points: Number,
  owns_road: [],
  owns_settlement: [],
  owns_city: [],
  played_card_knight: Number,
  played_card_road: Number,
  played_card_monopoly: Number,
  played_card_plenty: Number,
  played_card_victory: Number,
  has_longest_road: Boolean,
  has_biggest_army: Boolean,
  card_brick: Number,
  card_grain: Number,
  card_lumber: Number,
  card_ore: Number,
  card_wool: Number,
  card_knight: Number,
  card_road: Number,
  card_monopoly: Number,
  card_plenty: Number,
  card_victory: Number
});

// Board Model 
// const Player = mongoose.model('Player', BoardSchema);

// Road Schema 
const RoadSchema = mongoose.Schema({
  id: Number,
  owner: String,
  connecting_house_slots: [],
  adj_road_slots: []
});

// Road Model
// const Road = mongoose.model('Road', RoadSchema);

// Settlement Schema
const SettlementSchema = mongoose.Schema({
  id: Number,
  owner: String,
  house_type: Number,
  port_id: Number,
  port_input_type: String,
  port_input_value: Number,
  adj_house_slots: [],
  connecting_road_slots: []
});

// Settlement Model 
// const Settlement = mongoose.model('Settlement', SettlementSchema);

// Tile Schema
const TileSchema = mongoose.Schema({
  id: Number,
  terrain: String,
  dice_trigger_value: Number,
  has_robber: Boolean,
  connecting_road_slots: [],
  connecting_house_slots: [],
  connecting_tiles: []
});

// Tile Model 
// const Tile = mongoose.model('Tile', TileSchema);

// User Schema
const UserSchema = mongoose.Schema({
  user_name: String,
  password: String,
  in_game: Boolean,
  games_won: Number,
  current_room: String,
});

// User Model
// const User = mongoose.model('User', UserSchema);

// Stringified Data
const StringDataSchema = mongoose.Schema({
  room_id: Number,
  data: String
});

// Strigified Data Model
// const StringData = mongoose.model('StringData', StringDataSchema);

const gameSchema = mongoose.Schema({
  game_session_id: Number,
  players: [BoardSchema],
  tiles: [TileSchema],
  settlements: [SettlementSchema],
  roads: [RoadSchema]
});

const Game = mongoose.model('Game', gameSchema);

// User Schema
const UserSchema = mongoose.Schema({
  user_name: String,
  password: String,
  in_game: Boolean,
  games_won: Number,
  current_room: String,
});

// User Model
const User = mongoose.model('User', UserSchema);


module.exports = {mongoose, Game};