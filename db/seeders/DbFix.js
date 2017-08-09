const mongoose = require('mongoose');


mongoose.connect();
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('THE DB CONNECTED.')
});