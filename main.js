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
    console.log('Client connected...');
    var x = new classes.card('Gorgonzo', classes.type[0], 100, 90, classes.rarity[3]);

    client.on('join', function(data) {
    	console.log(data);
	});

	client.on('messages', function(data) {
		// Info sent to the local server
        client.emit('broad', data+"side1" + x);

        // Info sent directly to the other computer
        client.broadcast.emit('broad', data+"side2");
    });
});

server.listen(4200);