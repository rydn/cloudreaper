#!/usr/bin/env node

(function() {
  var argLen, download, fs, http, init, page, params, parse, rootHost, scrape;

  http = require('http');

  fs = require('fs');

  rootHost = 'soundcloud.com';

  page = 1;

  argLen = process.argv.length;

  params = {};

  scrape = function() {
    return http.get({
      host: rootHost,
      path: '/' + params.artist + '/' + (params.trackName != null ? params.trackName : 'tracks?page=' + page)
    }, function(res) {
      var data;
      data = '';
      res.on('data', function(chunk) {
        return data += chunk;
      });
      return res.on('end', function() {
        var track, tracks, _i, _len;
        tracks = data.match(/(window\.SC\.bufferTracks\.push\().+(?=\);)/gi);
        if (params.trackName != null) {
          download(parse(tracks[0]));
          return console.log('##');
        } else {
          for (_i = 0, _len = tracks.length; _i < _len; _i++) {
            track = tracks[_i];
            download(parse(track));
          }
          if (tracks.length === 10) {
            page++;
            return scrape();
          } else {
            return console.log('##');
          }
        }
      });
    });
  };

  parse = function(raw) {
    var chaff;
    chaff = raw.indexOf('{');
    if (chaff === -1) return false;
    try {
      return JSON.parse(raw.substr(chaff));
    } catch (e) {
      console.log('#error#couldn\'t parse this page.' );
      return process.exit(1);
    }
  };

  download = function(obj) {
    var artist, title;
    if (!obj) return;
    artist = obj.user.username;
    title = obj.title;
    try {
      fs.mkdirSync('./sounds/' + artist);
    } catch (e) {}
    console.log('#fetching#' + title);
    return http.get({
      host: 'media.' + rootHost,
      path: obj.streamUrl.match(/\/stream\/.+/)
    }, function(res) {
      return res.on('end', function() {
        var host;
        host = 'ak-media.' + rootHost;
        return http.get({
          host: host,
          path: res.headers.location.substr(('http://' + host).length)
        }, function(res) {
          var file;

          file = fs.createWriteStream('./sounds/' + artist + '/' + artist + ' - ' + title + '.mp3');
          res.on('data', function(chunk) {
            return file.write(chunk);
          });
          return res.on('end', function() {
            file.end();
            return console.log('#done#' + title + '\x1b[0m');
          });
        });
      });
    });
  };

  init = function() {
    var testFile, writeTest;
    if (argLen <= 2) {
      console.log('#error#pass an artist name!');
      process.exit(1);
    }
    testFile = '.soundscrape_' + Date.now();
    try {
      writeTest = fs.createWriteStream(testFile);
    } catch (e) {
      console.log('#error#you don\'t have permission to write files here' );
      process.exit(1);
    }
    writeTest.end();
    fs.unlink(testFile, function(err) {
      if (err != null) return console.log(err);
    });
    params.artist = process.argv[2];
    if (argLen > 3) params.trackName = process.argv[3];
    return scrape();
  };

  init();

}).call(this);