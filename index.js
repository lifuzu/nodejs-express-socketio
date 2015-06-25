var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var fs = require('fs');
var path = require('path');
var Random = require("random-js");

io.adapter(redis({ host: 'localhost', port: '6379' }));

app.use('/', express.static(path.join(__dirname, 'stream')));
 
 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
var sockets = {};
 
io.on('connection', function(socket) {
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    // no more sockets, kill the stream
    // if (Object.keys(sockets).length == 0) {
    //   app.set('watchingFile', false);
    //   if (proc) proc.kill();
    //   fs.unwatchFile('./stream/image_stream.jpg');
    // }
  });

  socket.on('start-text', function() {
    startRandom(io);
  });

  socket.on('time', function(data) {
    console.log("hello time!");
    console.log(data);
  });
});
 
http.listen(3000, function() {
  console.log('listening on *:3000');
});

function startRandom(io) {
  var random = new Random(Random.engines.mt19937().autoSeed());

  setInterval(function() {
    var value = random.integer(0, 99999);
    io.sockets.emit('text', { text: value });
  }, 1000);
}
