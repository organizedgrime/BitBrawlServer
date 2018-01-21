// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

//region board setup start
var cards = [];
var cardnames = ['carp', 'dragon', 'eagle', 'earthworm', 'electriceel', 'halpt', 'hippo', 'jelly', 'mouse', 'octo', 'rhino', 'sparrow', 'tiger', 'tortoise', 'wasp'];
var decksize = 10;
for(var i = 0; i < decksize*2; i++) {
    cards.push(new classes.card(i, cardnames[Math.round(Math.random() * (cardnames.length-1))], classes.type[1], 1, 5, classes.rarity[0]));
}
var p1cards = new classes.deck(cards.slice(0, cards.length/2)), 
    p2cards = new classes.deck(cards.slice(cards.length/2, cards.length));
var board = new classes.board(p1cards, p2cards);
// board setup end

// set server stuff up
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/img', function(req, res, next) {
    res.sendFile(__dirname + '/public/' + req.query.filename);
});

var playerone = null;
var playertwo = null;

var round = Math.round(Math.random());
var winner = -1;

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
        checkwin();

        // Distribute the relevant game information to both players
        if(playerone)
            io.to(playerone.id).emit('update', new classes.clientWorld(board, true, winner, round % 2 == 0));

        if(playertwo)
            io.to(playertwo.id).emit('update', new classes.clientWorld(board, false, winner, round % 2 == 1));
    };

    var checkwin = function() {
        if(round > 2) {
            if(board.deck1.play.length == 0){
                console.log("p2 wins");
                winner = 1;
            }
            else if(board.deck2.play.length == 0) {
                console.log("p1 wins");
                winner = 0;
            }
        }
    };

    socket.on('update', update);
    socket.on('playcard', function(card) {
        board.fortFall();
        if(socket.id == playerone.id) {
            board.deck1.playCard(card);
        }
        else {
            board.deck2.playCard(card);
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