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




// set stuff up
app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

var pOneIP, pTwoIP;

io.on('connection', function(client) {
    var address = client.handshake.address;
    console.log('<client joined at ' + address + '>');

    var updateFunc = function(data) {
        client.emit('update', new classes.clientWorld(board, address == pOneIP));
        client.broadcast.emit('update', new classes.clientWorld(board, address != pOneIP));
    };

    // Establish players based on IP.
    if(!pOneIP) {
        pOneIP = address;
    }
    else {
        pTwoIP = address;
    }

    client.on('update', updateFunc);

    client.on('playcard', function(cardID) {
        if(address == pOneIP) {
            // Player one playcard
        }
        else {
            // Player two playcard
        }
    });

    client.on('drawcard', function() {
        if(address == pOneIP) {
            // Player one playcard
            board.deck1.drawCard();
            updateFunc();
        }
        else {
            // Player two playcard
            board.deck2.drawCard();
            updateFunc();
        }
    });
});

server.listen(4200);