const express = require('express');
const parser = require('body-parser');
const PORT = 3000;
const App = express();

App.use(parser.json());
App.use(parser.urlencoded({extended: true}));


App.listen(PORT, (err) => {
    if(err){
        console.log('Error setting up server.js')
    } else {
        console.log('Server.js is up and listening to Port:', PORT);
    }
})