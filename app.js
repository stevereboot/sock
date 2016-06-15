var express = require('express');
var app = express();

var http = require('http').Server(app);

var io = require('./sockets').listen(http);

http.listen(8080, function() {
    console.log('listening on port 8080');
});

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

