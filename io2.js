var io = require('socket.io').listen(8000);
    events = require('events'),
    serverEmitter = new events.EventEmitter();

io.sockets.on('connection', function (socket) {
  // here you handle what happens on the 'newFeed' event
  // which will be triggered by the server later on
  serverEmitter.on('newFeed', function (data) {
    // this message will be sent to all connected users
    console.log(data);
    socket.emit(data);
  });
});

// sometime in the future the server will emit one or more newFeed events
serverEmitter.emit('newFeed', "data");
