var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var server = require('./server').Server();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.render('index', { simulationIdentifier: "null" });
});

app.get('/simulation-:id(\\d+)', function (req, res) {
    res.render('index', { simulationIdentifier: req.params.id });
});

io.on('connection', function(socket) {
    socket.on('register', function(simulationIdentifier) {
        console.log('register', simulationIdentifier);
        server.addClient(socket, simulationIdentifier);
    });

    socket.on('geoloc-send', function(data) {
        console.log('geoloc', data.simulationIdentifier);
        if (data.simulationIdentifier && data.data) {
            server.emit(data.simulationIdentifier, 'geoloc', data.data, socket);
        }
    });
});

http.listen(3000, function () {
    console.log('App listening on port 3000.');
});
