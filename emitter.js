// var port = 6379, host = 'localhost';
// var redis = require('redis').createClient(
    // port, host, {return_buffers: true});
// var pub = redis(port, host);
// var sub = redis(port, host, { detect_buffers: true });
// var emitter = require('socket.io-emitter')(redis);
// var emitter = require('socket.io-emitter')({ host: 'localhost', port: '6379' });
// var debug = require('debug')('luckyemit');

// setInterval(function(){
// emitter.broadcast.emit('time', "new Date()");
// emitter.to('exclusive room').broadcast.emit('broadcast event', 'broadcast payload');
// }, 5000)

// setInterval(function () {
  // debug('emit time event');
  // emitter.emit('time', new Date());
// }, 2000);

// var ioc = require('socket.io-client');
// var http = require('http').Server();
// var ioc = require('socket.io-client')('http://localhost');
// var socket = require('socket.io-client')('http://localhost');
// socket.on('connect', function(){console.log("connected");});
// socket.emit('time', 'broadacast payload');

// window.navigator.userAgent = "react-native";
var io = require('socket.io-client');

socket = io('http://localhost:3000/', { jsonp: false });
socket.on('text', function(data) {
  console.log(data.text);
  process.exit();
});
socket.emit('time', new Date());

// function client(srv, nsp, opts){
//   if ('object' == typeof nsp) {
//     opts = nsp;
//     nsp = null;
//   }
//   var addr = srv.address();
//   if (!addr) addr = srv.listen().address();
//   // var url = 'http://' + addr.address + ':' + addr.port + (nsp || '');
//   console.log("port:" + addr.port);
//   console.log("address:" + addr.address);
//   var url = 'http://localhost:' + addr.port + (nsp || '');
//   return ioc(url, opts);
// }

// var emitter = require('socket.io-emitter')({ host: 'localhost', port: '6379' });
// var cli = client(http, { forceNew: true });
// cli.on('connect', function() {
//   emitter.emit('time', 'broadacast payload');
//   emitter.emit('broadcast event', 'broadacast payload');
// });

// cli.on('broadcast event', function(payload) {
//   console.log("cli:" + payload);
//   cli.emit('time', new Date());
//   cli.close()
// });