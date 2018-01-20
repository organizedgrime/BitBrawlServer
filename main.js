// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// set up mock deck
var p1cards = [], p2cards = [];
for(var i = 0; i < 10; i++) {
    var card = new classes.card(
        Math.random().toString(36).substring(7), 
        classes.type[Math.round(Math.random() * 3)], 
        Math.round(Math.random() * 100), Math.round(Math.random() * 100), 
        classes.rarity[Math.round(Math.random() * 5)]
    );
    p1cards.push(card);

    var card2 = new classes.card(
        Math.random().toString(36).substring(7), 
        classes.type[Math.round(Math.random() * 3)], 
        Math.round(Math.random() * 100), Math.round(Math.random() * 100), 
        classes.rarity[Math.round(Math.random() * 5)]
    );
    p2cards.push(card2);
}

var board = new classes.board({deck1: p1cards, deck2: p2cards});
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
        }
        else if(data.username == 'p2') {
            client.emit('broad', p2cards.toString());
        }
        else {
            client.emit('broad', 'user not recognized');
        }

  //       // Info sent directly to the other computer
       client.broadcast.emit('broad', data.username);
    });
});

server.listen(4200);