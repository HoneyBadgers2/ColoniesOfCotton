//Dependencies
const mongoose = require ('mongoose');
const path = require('path');
const data = require('../data/RoadData.json');
const {Road} = require('../mongo');


const RoadSeeder = () => {
// Mongoose Connection
mongoose.connect();
const db = mongoose.connection;
// Connection to Database
db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
db.once('open', function () {
  console.log('Database has created a succesful connection.')
  // Truncate Table 
  // Seed
  data.forEach((road) => {
  const newRoad = Road.create({
          id: road.id,
          owner: road.owner,
          cor_1: road.cor_1,
          cor_2: road.cor_2,
          surf_1: road.surf_1,
          surf_2: road.surf_2,
          surf_3: road.surf_3,
          surf_4: road.surf_4
          }, 
        function (err) {
        console.log(err)
      });
    });
  })
};

RoadSeeder();