var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(8080, function() {
    console.log('listening on port 8080');
});

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

