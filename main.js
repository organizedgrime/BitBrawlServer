// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

//region board setup start
var cards = [];
var copycard = new classes.card(0, 'inert aluminum cube', classes.type[1], 0.5, 5, classes.rarity[6]);
var decksize = 10;
for(var i = 0; i < decksize*2; i++) {
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

var round = 0;

io.on('connection', function(socket) {
    var address = socket.handshake.address;
    //console.log('<socket joined at ' + address + '>');

    // Establish players based on IP.
    if(!playerone) {
        // It's player one logging on for the first time.
        console.log('playerone joined for the first time');
        playerone = {ip: address, id: socket.id};
    }
    else if(!playertwo) {
        // It's player two logging on for the first time.
        console.log('playertwo joined for the first time');
        playertwo = {ip: address, id: socket.id};
    }
    else {
        if(playerone.ip == address) {
            // It's player one logging on again.
            playerone.id = socket.id;
            console.log('playerone rejoined');
        }
        else if(playertwo.ip == address) {
            // It's player two logging on again.
            playertwo.id = socket.id;
            console.log('playertwo rejoined');
        }
        else {
            // User is not part of the two IPs already saved.
            console.log('REJECTED');
        }
    }

    var update = function() {
        // Distribute the relevant game information to both players
        if(playerone)
            io.to(playerone.id).emit('update', new classes.clientWorld(board, true));

        if(playertwo)
            io.to(playertwo.id).emit('update', new classes.clientWorld(board, false));
    };

    var checkwin = function() {
        if(round > 2) {
            if(board.deck1.play.length == 0){
                console.log("p2 wins");
            }
            else if(board.deck2.play.length == 0) {
                console.log("p1 wins");
            }
        }
    };

    socket.on('update', update);
    socket.on('playcard', function(card) {
        board.fortFall();
        if(socket.id == playerone.id) {
            board.deck1.playCard();
            board.deck1.drawCard();
        }
        else {
            board.deck2.playCard();
            board.deck2.drawCard();
        }
        round++;
        update();
    });

    socket.on('attackcard', function(attacker, defender) {
        if(socket.id == playerone.id) {
            board.deck2.defendCard(attacker, defender);
        }
        else {
            board.deck1.defendCard(attacker, defender);
        }
        board.fortFall();
        round++;
        update();
    });
});

server.listen(4200);