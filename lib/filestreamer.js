var fs = require('fs');
var basefolder = '/home/ryan/dev/cloudreaper/sounds/';
var filereader = {
	read: function(artist, filename, callback) {
		filename = basefolder + artist + '/' + filename;
		fs.readFile(filename, function(err, data){
			if(err)
			{
				callback(err, null);
			}
			else
			{
				callback(null, data);
			}
		});
	}
};
exports.module = filereader;
