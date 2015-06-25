
var io = require('socket.io-client');

socket = io('http://localhost:3000/', { jsonp: false });
socket.on('text', function(data) {
  console.log(data.text);
  // socket.emit('disconnect');
  process.exit();
});
socket.emit('time', new Date());
