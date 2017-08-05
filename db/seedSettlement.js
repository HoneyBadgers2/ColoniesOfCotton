//Dependencies
const mongoose = require ('mongoose');
const path = require('path');
const data = require('../SettlementData.json');
const db = mongoose.connection;
const {Settlement} = require('./mongo');
const dotenv = require('dotenv').config();

const SettlementSeeder = () => {
//Mongoose Connection
mongoose.connect(process.env.DB_URL);
//Connection to Database
db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
db.once('open', function () {
  console.log('Database has created a succesful connection.')
  // Truncate Table 
  Settlement.collection.drop();
  // Seed
  data.forEach((settlement) => {
  const newSettlement = Settlement.create({
          id: settlement.id,
          owner: settlement.owner,
          house_type: settlement.house_type,
          port_id: settlement.port_id,
          port_input_type: settlement.port_input_type,
          port_input_value: settlement.port_input_value,
          cor_1: settlement.cor_1,
          cor_2: settlement.cor_2,
          cor_3: settlement.cor_3,
          surf_1: settlement.surf_1,
          surf_2: settlement.surf_2,
          surf_3: settlement.surf_3
          }, 
        function (err) {
        console.log(err)
      });
    });
  })
};

SettlementSeeder();

