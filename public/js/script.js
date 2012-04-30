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
			$('#completeList').append('<li>' + data.data + '<audio controls src="http://localhost:3000/listen/Twelv/Speak%20To%20Me%20Computer.mp3"></audio></li>');

		}
	}
});
socket.on('reaper::error', function(data) {
	if (data) {
		if (data.reqId == $('#sid').html()) {
			$('#completeList').append('<li> ERROR </li>');
		}
	}
});