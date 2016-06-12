var express = require('express');
var app = express();

app.listen(8080, function() {
    console.log('listening on port 8080');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

