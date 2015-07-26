module.exports = function(io, rooms){
	var chatrooms = io.of('/roomlist').on('connection', function(socket){
		console.log('Connection established on the server!!');
	
		socket.emit('roomupdate', JSON.stringify(rooms)); // b'cast back to the active socket
				
		socket.on('newroom', function(data){
			console.log('Node received newroom notification!!');
			rooms.push(data);
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms)); // b'cast back to the active socket
		})
	})
	
	
	var messages = io.of('/messages').on('connection', function(socket){
		console.log("connected to the chatroom!");
		
		socket.on('joinroom', function(data){ 
			socket.userName = data.user;
			socket.userPic = data.userPic;
			socket.join(data.room);

		})
		
		socket.on('newMessage', function(data){
			console.log("New message received on the server");
			socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
		})
	})
}