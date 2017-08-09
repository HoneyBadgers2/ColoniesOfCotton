//Dependencies
const mongoose = require ('mongoose');
const path = require('path');
const data = require('../data/TileData.json');
const {Tile} = require('../mongo');


const TileSeeder = () => {
// Mongoose Connection
mongoose.connect();
const db = mongoose.connection;
// Connection to Database
db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
db.once('open', function () {
  console.log('Database has created a succesful connection.')
  // Truncate Table 
  // Seed
  data.forEach((tile) => {
  const newTile = Tile.create({
          id: tile.id,
          terrain: tile.terrain,
          dice_trigger_value: tile.dice_trigger_value,
          has_robber: tile.has_robber,
          surf_1: tile.surf_1,
          surf_2: tile.surf_2,
          surf_3: tile.surf_3,
          surf_4: tile.surf_4,
          surf_5: tile.surf_5,
          surf_6: tile.surf_6,
          cor_1: tile.cor_1,
          cor_2: tile.cor_2,
          cor_3: tile.cor_3,
          cor_4: tile.cor_4,
          cor_5: tile.cor_5,
          cor_6: tile.cor_6
          }, 
        function (err) {
        console.log(err)
      });
    });
  })
};

TileSeeder();