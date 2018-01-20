// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// set up mock deck
var cards = [
    new classes.card(0, 'earthworm', classes.type[1], 0.5, 2, classes.rarity[0]),
    new classes.card(1, 'carp', classes.type[0], 0.25, 3, classes.rarity[0]),
    new classes.card(2, 'sparrow', classes.type[3], 0.5, 2, classes.rarity[0]),
    new classes.card(3, 'inert aluminum cube', classes.type[1], 0.5, 2, classes.rarity[6])          
];

var p1cards = new classes.deck([cards[0], cards[1]]), 
    p2cards = new classes.deck([cards[2], cards[3]]);

var board = new classes.board(p1cards, p2cards);
//console.log(board.toString());

// set stuff up
app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

var pOneIP, pTwoIP;

io.on('connection', function(client) {
    var address = client.handshake.address;
    console.log('<client joined at ' + address + '>');

    if(!pOneIP) {
        pOneIP = address;
    }
    else {
        pTwoIP = address;
    }

    client.on('update', function(data) {
        if(address == pOneIP) {
            // Display all information pertinent to Player 1
            client.emit('update', board.deck1.toString());
        }
        else {
            // Display all information pertinent to Player 2
            client.emit('update', board.deck2.toString());
        }
    });

    client.on('playcard', function(cardID) {
        if(address == pOneIP) {
            // Player one playcard
        }
        else {
            // Player two playcard
        }
    });
});

server.listen(4200);