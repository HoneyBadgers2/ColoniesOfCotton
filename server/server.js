const express = require('express');
const http = require('http');
const parser = require('body-parser');
const socketIo = require('socket.io');

const PORT = 3000;
const App = express();
const server = http.createServer(App);
const io = socketIo(server);

App.use(express.static('client'));
App.use(parser.urlencoded({extended: false}));
server.listen(3000, (err) => {
    if(err){
        console.log('error');
    } else {
        console.log('listening on 3000');
    }
});

io.on('connection', socket => {
    console.log(connected);
})