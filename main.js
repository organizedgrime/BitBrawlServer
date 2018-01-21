// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

//region board setup start
var cards = [];
var copycard = new classes.card(0, 'inert aluminum cube', classes.type[1], 0.5, 2, classes.rarity[6]);
for(var i = 0; i < 20; i++) {
    cards.push(copycard);
    copycard = copycard.copy();
}
var p1cards = new classes.deck(cards.slice(0, cards.length/2)), 
    p2cards = new classes.deck(cards.slice(cards.length/2, cards.length));
var board = new classes.board(p1cards, p2cards);
// board setup end

// set server stuff up
app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

var playerone = null;
var playertwo = null;

io.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log('<socket joined at ' + address + '>');

    // Establish players based on IP.
    if(!playerone) {
        // It's player one logging on for the first time.
        playerone = {ip: address, id: socket.id};
    }
    else if(!playertwo) {
        // It's player two logging on for the first time.
        playertwo = {ip: address, id: socket.id};
    }
    else {
        if(playerone.ip == address) {
            // It's player one logging on again.
            playerone.id = socket.id;
        }
        else if(playertwo.ip == address) {
            // It's player two logging on again.
            playertwo.id = socket.id;
        }
        else {
            // User is not part of the two IPs already saved.
        }
    }

    var update = function(data) {
        io.to(playerone.id).emit('update', new classes.clientWorld(board, true));
        io.to(playertwo.id).emit('update', new classes.clientWorld(board, false));
    };

    socket.on('update', update);
    socket.on('playcard', function(card) {
        if(socket.id == playerone.id) {
            board.deck1.playCard();
        }
        else {
            board.deck2.playCard();
        }
        update();
    });

    socket.on('attackcard', function(attacker, defender) {
        if(socket.id == playerone.id) {
            board.deck2.defendCard(attacker, defender);
        }
        else {
            board.deck1.defendCard(attacker, defender);
        }
        update();
    });
});

server.listen(4200);