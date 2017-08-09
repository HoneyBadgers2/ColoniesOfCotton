//Dependencies
const mongoose = require ('mongoose');
const path = require('path');
const data = require('../data/UserData.json');
const {User} = require('../mongo');


const UserSeeder = () => {
// Mongoose Connection
mongoose.connect();
const db = mongoose.connection;
// Connection to Database
db.on('error', console.error.bind(console, 'The DB just shit the bed. Here is your connection error:'));
db.once('open', function () {
  console.log('Database has created a succesful connection.')
  // Truncate Table 
  // Seed
  data.forEach((user) => {
  const newUser = User.create({
          user_name: user.user_name,
          password: user.password,
          in_game: user.in_game,
          games_won: user.games_won,
          current_room: user.current_room
          }, 
        function (err) {
        console.log(err)
      });
    });
  })
};

UserSeeder();