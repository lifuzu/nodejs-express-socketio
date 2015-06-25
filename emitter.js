// var port = 6379, host = 'localhost';
// var redis = require('redis').createClient(
    // port, host, {return_buffers: true});
// var pub = redis(port, host);
// var sub = redis(port, host, { detect_buffers: true });
// var emitter = require('socket.io-emitter')(redis);
var emitter = require('socket.io-emitter')({ host: 'localhost', port: '6379' });
var debug = require('debug')('luckyemit');

// setInterval(function(){
// emitter.broadcast.emit('time', "new Date()");
// emitter.to('exclusive room').broadcast.emit('broadcast event', 'broadcast payload');
// }, 5000)

// setInterval(function () {
  debug('emit time event');
  emitter.emit('time', new Date());
// }, 2000);