/**
 * Module dependencies.
 */

var express = require('express'),

  hookio = require('hook.io'),
  cloudreaper, fs = require('fs'),
  routes = require('./routes');

var reaper = hookio.createHook({
  name: "reaper",
  debug: true
});

reaper.on('hook::ready', function(data) {
  console.log("HTTP server Hook Started");
  cloudreaper = require('./lib/reaper.js');
});

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

//get artist
app.get('/:artist/', function(req, res) {
  var reqId = uuid();
  fs.readFile('./public/index.html', 'utf8', function(err, data) {
    res.send(data);

    io.sockets.on('connection', function(socket) {
      cloudreaper(reqId, req.params.artist);
      socket.emit('welcome', {
        sid: reqId,
        date: new Date()
      });
      reaper.on('*::fetching', function(data) {
        socket.emit('reaper::fetching', data);
      });
      reaper.on('*::complete', function(data) {
        socket.emit('reaper::complete', data);
      });
    });
  });
});

app.listen(3000, function() {
  reaper.start();
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



function uuid() {
  var chars = '0123456789abcdef'.split('');

  var uuid = [],
    rnd = Math.random,
    r;
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4'; // version 4
  for (var i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | rnd() * 16;

      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
    }
  }

  return uuid.join('');
}
