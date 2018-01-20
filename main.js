// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// set up mock deck
var cards = [
    new classes.card('earthworm', classes.type[1], 0.5, 2, classes.rarity[0]),
    new classes.card('carp', classes.type[0], 0.25, 3, classes.rarity[0]),
    new classes.card('sparrow', classes.type[3], 0.5, 2, classes.rarity[0]),
    new classes.card('inert aluminum cube', classes.type[1], 0.5, 2, classes.rarity[6])          
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

io.on('connection', function(client) {
    // Accept join from client and log client connection message
    client.on('join', function(data) {
    	console.log(data);
	});

    // Receive the message from the client, send it back to both clients
	client.on('login', function(data) {
        /*
        Check the credentials of the user, query the blockchain, and store their cards in a deck object.
        */

		// // Info sent to the local server
        console.log('data' + data.username);
        if(data.username == 'p1') {
            client.emit('broad', p1cards.toString());
            client.broadcast.emit('broad', 'the other player had drawn their deck');
        }
        else if(data.username == 'p2') {
            client.emit('broad', p2cards.toString());
            client.broadcast.emit('broad', 'the other player had drawn their deck');
        }
        else {
            client.emit('broad', 'user not recognized');
        }
    });


    client.on('update', function(data) {
        if(data.username == 'p1') {
            // Display all information pertinent to Player 1
            client.emit('update', board.deck1.toString());
        }
        else if(data.username == 'p2') {
            // Display all information pertinent to Player 2
            client.emit('update', board.deck2.toString());
        }
        else {
            // Display error
            client.emit('update', 'cannot retrieve deck, invalid user.');
        }
    });
});

server.listen(4200);