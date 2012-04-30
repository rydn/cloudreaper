var fs = require('fs'),
	qs = require('querystring'),
	async = require('async');

var songs = {
	getArtists: function(callback) {
		fs.readdir('./sounds', function(err, result) {
			if (err) {
				callback(err, result);
			} else {
				async.map(result, songs.populateObject, function(result) {
					callback(null, result);
				});
			}

		});
	},
	getSongs: function(artist, callback) {
		var SYNCDIR = './sounds/' + artist + '/';
		fs.readdir(SYNCDIR, function(err1, files) {
			var filesOnly = [];
			if (!err1) {
				callback(null, files);
			} else {
				callback(err1, null);
			}
		});
	},
	getUrls: function(artist, callback) {
		songs.getSongs(artist, function(err, tracks) {
			if (err) {
				callback(err, null);
			} else {
				var returnVar = [];
				tracks.forEach(function(track){
					returnVar.push('http://localhost:3000/listen/'+qs.escape(artist)+'/'+qs.escape(track)+'/');
				});
				callback(null,returnVar);
			}
		});
	},
	populateObject: function(item, callback) {
		if (item) {
			var tempObj = {
				artist: item,
				tracks: null,
				urls: null
			};
			songs.getSongs(item, function(err, result) {
				if (err) {
					console.log(err);
					callback(null);
				} else {
					tempObj.tracks = result;
					songs.getUrls(item, function(err, urls) {
						tempObj.urls = urls;
						callback(tempObj);
					});

				}
			});
		} else {
			callback(null);
		}

	},
	formatTracks: function(item, callback) {
		if (item) {
			var tempObj = {
				track: item,
				url: 'http://localhost:3000/listen/Twelv/' + qs.escape(item) + '/'
			};
			callback(tempObj);
		} else {
			callback(null);
		}

	}
};
exports.songs = songs;