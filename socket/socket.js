module.exports = function(io, rooms){
	var chatrooms = io.of('/roomlist').on('connection', function(socket){
		console.log('Connection established on the server!!');
	
		socket.on('newroom', function(data){
			console.log('Node received newroom notification!!');
			rooms.push(data);
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms)); // b'cast back to the active socket
		})
	})
}