var util = require('util'),
	EventEmitter2 = require('eventemitter2').EventEmitter2,
	hookio = require('hook.io'),
	spawn = require('child_process').spawn;
var hookEmitter = hookio.createHook({
	name: 'reaper',
	debug: false
});

hookEmitter.on('hook::ready', function(data) {
	console.log('Soundcloud Reaper Hook Ready');
});

module.exports = function(reqId, artist) {
	hookEmitter.emit('startDL', {
		data: "#start#starting to download",
		reqId: reqId,
		date: new Date()
	});
	scrape = spawn('node', ['./lib/cloudscrape.js', artist]);

	scrape.stdout.on('data', function(data) {
		if (data) {
			data = data.toString();
			switch (data.substring(0, data.lastIndexOf("#") + 1)) {
			case "#fetching#":
				hookEmitter.emit('fetching', {
					data: data.substring(data.lastIndexOf("#") + 1, data.length),
					reqId: reqId,
					date: new Date()
				});
				break;
			case "#done#":
				hookEmitter.emit('complete', {
					data: data.substring(data.lastIndexOf("#") + 1, data.length),
					reqId: reqId,
					date: new Date()
				});
				break;
			case "#error#":
				hookEmitter.emit('error', {
					data: data.substring(data.lastIndexOf("#") + 1, data.length),
					reqId: reqId,
					date: new Date()
				});
				break;
			default:
				hookEmitter.emit('stdout', {
					data: data,
					reqId: reqId,
					date: new Date()
				});
				break;
			}
		}
	});

	scrape.stderr.on('data', function() {
			hookEmitter.emit('stderr', {
				data: 'stderr',
				reqId: reqId,
				date: new Date()
			});
	});

	scrape.on('exit', function(code) {
		if (code) {
			hookEmitter.emit('exit', {
				data: code.toString(),
				reqId: reqId,
				date: new Date()
			});
		}
	});
};
hookEmitter.connect();
