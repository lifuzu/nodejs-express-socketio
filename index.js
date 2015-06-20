var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var path = require('path');
var Random = require("random-js");
 
var spawn = require('child_process').spawn;
var proc;
 
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
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });

  socket.on('start-image', function() {
    startImaging(io);
  });

  socket.on('start-text', function() {
    startTexting(io);
  });

  socket.on('start-random', function() {
    startRandom(io);
  });

  ss(socket).on('stream', function(stream) {
    realStreaming(stream);
  })
});
 
http.listen(3000, function() {
  console.log('listening on *:3000');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}

function realStreaming (stream) {
  if (app.get('watchingFile')) {
    fs.createReadStream('./stream/image_stream.jpg').pipe(stream);
    return;
  }
 
  var i = 0;
  setInterval(function() {
    gm(100, 100, "#ddff99f3")
    .drawText(10, 50, "Hello " + i)
    .write("./stream/image_stream.jpg", function(err) {
      if (err) console.log(err);
    });
    i = i+1;
  }, 1000);
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    fs.createReadStream('./stream/image_stream.jpg').pipe(stream);
  })
}

function startImaging(io) {

  if (app.get('watchingFile')) {
    fs.readFile('./stream/image_stream.jpg', function(err, buffer) {
      if (err) console.log(err);
      else {
        io.sockets.emit('image', { buffer: buffer });
        return;
      }
    });
  }

  var i = 0;
  setInterval(function() {
    gm(100, 100, "#ddff99f3")
    .drawText(10, 50, "Hello " + i)
    .toBuffer('jpg',function (err, buffer) {
      if (err) return console.log(err);
      io.sockets.emit('image', { buffer: buffer });
      console.log('done!');
    })
    // .write("./stream/image_stream.jpg", function(err) {
    //   if (err) console.log(err);
    // });
    i = i+1;
  }, 20);

  console.log('Watching for changes...');

  app.set('watchingFile', true);

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    fs.readFile('./stream/image_stream.jpg', function(err, buffer) {
      if (err) console.log(err);
      else {
        io.sockets.emit('image', { buffer: buffer });
        return;
      }
    });
  })

}

function startTexting(io) {
  if (app.get('watchingFile')) {
    fs.readFile('./stream/image_stream.txt', function(err, text) {
      if (err) console.log(err);
      else {
        io.sockets.emit('text', { text: text });
        console.log('Emit 1 ' + text);
        return;
      }
    });
  }

  var i = 0;
  setInterval(function() {
    fs.writeFile('./stream/image_stream.txt', 'Hello ' + i, function (err) {
      if (err) throw err;
      console.log('Hello ' + i);
      io.sockets.emit('text', { text: 'Hello ' + i });
    });
    i = i+1;
  }, 1000);

  console.log('Watching for changes...');

  app.set('watchingFile', true);

  // fs.watchFile('./stream/image_stream.txt', function(current, previous) {
  //   fs.readFile('./stream/image_stream.txt', function(err, text) {
  //     if (err) console.log(err);
  //     else {
  //       io.sockets.emit('text', { text: text });
  //       console.log('Emit ' + text);
  //       return;
  //     }
  //   });
  // })
 
}

function startRandom(io) {
  var random = new Random(Random.engines.mt19937().autoSeed());

  setInterval(function() {
    var value = random.integer(1, 100);
    io.sockets.emit('text', { text: value });
  }, 1000);
}

function startStreaming(io) {

  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    return;
  }

  var i = 0;
  setInterval(function() {
    gm(100, 100, "#ddff99f3")
    .drawText(10, 50, "Hello " + i)
    .write("./stream/image_stream.jpg", function(err) {
      if (err) console.log(err);
    });
    i = i+1;
  }, 1000);

  console.log('Watching for changes...');

  app.set('watchingFile', true);

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })

}