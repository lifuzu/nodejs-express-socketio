var io = require('socket.io')();
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');

// var port = '6379', host = 'localhost';
// var pub = redis(port, host, { auth_pass: "pwd" });
// var sub = redis(port, host, { detect_buffers: true, auth_pass: "pwd" });
var pub = redis(null, null);
var sub = redis(null, null, { detect_buffers: true });
io.adapter(adapter({ pubClient: pub, subClient: sub }));

// var emitter = require('socket.io-emitter')({ host: 'localhost', port: '6379' });
// setInterval(function () {
//   console.log('emit time event');
//   emitter.emit('time', new Date());
// }, 2000);

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

  socket.emit('text', { hello: 'world' });
  
  // Listen on msg: time
  socket.on('time', function (data) {
    console.log(data);
  });
});

module.exports = io;