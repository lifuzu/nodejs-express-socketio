var io = require('socket.io')();

var sockets = {};

io.on('connection', function (socket) {
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    delete sockets[socket.id];
    console.log("socket " + socket.id + " is diconnected...");
    // no more sockets, kill the stream
    // if (Object.keys(sockets).length === 0) {
    // }
  });

  // socket.emit('text', { hello: 'world' });
  
  // Listen on msg: time
  socket.on('time', function(data) {
    console.log("hello time!");
    console.log(data);
    io.sockets.emit('text', { text: 98 });
  });
});

module.exports = io;