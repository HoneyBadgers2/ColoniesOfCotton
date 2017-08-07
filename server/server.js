const express = require('express');
const http = require('http');
const parser = require('body-parser');
const socketIo = require('socket.io');

const PORT = 3000;
const App = express();
const server = http.createServer(App);
const io = socketIo(server);
const initial = require('../data.json');

App.use(express.static('client'));
App.use(parser.urlencoded({extended: false}));
server.listen(3000, (err) => {
    if(err){
        console.log('error');
    } else {
        console.log('listening on 3000');
    }
});


var counter = 0;
io.on('connection', socket => {
    counter ++
    io.sockets.emit('identity', counter);


    socket.on('disconnect', ()=> {
        console.log('user disconnected');
    })

    socket.on('message', body => {
        io.sockets.emit('message', body);
    })

    if(counter === 4){
    io.sockets.emit('start', initial);
    counter = 0;
    }

    socket.on('diceRoll', total => {
        io.sockets.emit('diceRoll', total);
    })


})