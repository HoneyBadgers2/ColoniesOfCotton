//Dependencies
const mongoose = require ('mongoose');
const dotenv = require('dotenv').config();


//Mongoose Connection
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

//DB Connection 
db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
db.once('open', function () {
  console.log('Database has created a succesful connection.')
});


// Board Schema
const BoardSchema = mongoose.Schema ({
  id: Number,
  user_number_label: String,
  display_name: String,
  turn_counter: Number,
  player_points: Number,
  owns_road: Number,
  owns_settlement: Number,
  owns_city: Number,
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
const Player = mongoose.model('Player', BoardSchema);

// Road Schema 
const RoadSchema = mongoose.Schema({
  id: Number,
  owner: String,
  cor_1: Number,
  cor_2: Number,
  surf_1: Number,
  surf_2: Number,
  surf_3: Number,
  surf_4: Number
});

// Road Model
const Road = mongoose.model('Road', RoadSchema);

// Settlement Schema
const SettlementSchema = mongoose.Schema({
  id: Number,
  owner: String,
  house_type: String,
  port_id: Number,
  port_input_type: String,
  port_input_value: Number,
  cor_1: Number,
  cor_2: Number,
  cor_3: Number,
  surf_1: Number,
  surf_2: Number,
  surf_3: Number
});

// Settlement Model 
const Settlement = mongoose.model('Settlement', SettlementSchema);

// Tile Schema
const TileSchema = mongoose.Schema({
  id: Number,
  terrain: String,
  dice_trigger_value: Number,
  has_robber: Boolean,
  surf_1: Number,
  surf_2: Number,
  surf_3: Number,
  surf_4: Number,
  surf_5: Number,
  surf_6: Number,
  cor_1: Number,
  cor_2: Number,
  cor_3: Number,
  cor_4: Number,
  cor_5: Number,
  cor_6: Number
});

// Tile Model 
const Tile = mongoose.model('Tile', TileSchema);


module.exports = {mongoose, Player, Settlement};