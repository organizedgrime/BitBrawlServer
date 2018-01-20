// main.js
var classes = require('./classes');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

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
        //client.emit('broad', data.username + ":" + data.password);

  //       // Info sent directly to the other computer
  //       client.broadcast.emit('broad', data.username + ":" + data.password);
    });
});

server.listen(4200);