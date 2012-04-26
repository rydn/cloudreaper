var socket = io.connect('http://localhost');


socket.on('welcome', function(data) {
	if (data) {
		$('#sid').html(data.sid);
	}
});
socket.on('reaper::fetching', function(data) {
	if (data) {
		if (data.reqId == $('#sid').html()) {
			$('#procList').append('<li>' + data.data + '</li>');
		}
	}

});
socket.on('reaper::complete', function(data) {
	if (data) {
		if (data.reqId == $('#sid').html()) {
			$('#completeList').append('<li>' + data.data + '</li>');
		}
	}
});
