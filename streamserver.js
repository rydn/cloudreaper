var http = require('http'),
	qs = require('querystring'),
    fileSystem = require('fs'),
    path = require('path'),
basepath = '/home/ryan/dev/cloudreap/sounds/',
    util = require('util');

http.createServer(function(request, response) {
    var filePath = path.join(basepath, qs.unescape(request.url.replace('listen/', '')));
    var stat = fileSystem.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to util.pump()
    util.pump(readStream, response);
})
.listen(3001);
