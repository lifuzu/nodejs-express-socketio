var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var events = require('events'),
    serverEmitter = new events.EventEmitter();

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

  serverEmitter.on('newFeed', function (data) {
    // this message will be sent to all connected users
    console.log(data);
    socket.emit('time', data);
  });
});

// sometime in the future the server will emit one or more newFeed events
serverEmitter.emit('newFeed', "data");

http.listen(3000, function() {
  console.log('listening on *:3000');
  serverEmitter.emit('newFeed', "data");
});
