const express = require('express');
const { join } = require('path');
const app = express();
const http = require('http').createServer(app);
const Server = require("socket.io");
const io = new Server(http);

var rooms = [];
var clientList = [];



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/content/register.html');
});



app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/content/index.html');
});



io.on('connection', (socket) => {
  socket.joinRooms = [];
  clientList.push(socket.id);
  socket.on('find-room', (msg) => {
    var roomId = []
    if (rooms.length == 0 || rooms.every(x => x.users.length == 2)) {
       roomId.id = Math.floor(Math.random() * 1000000);
      rooms.push({ id: roomId.id, users: [socket.id] });
      socket.join(roomId.id);
      socket.joinRooms.push(roomId.id);
    }
    else {
      var roomId = rooms.find(x => x.users.length != 2);
      socket.join(roomId.id);
      rooms.find(x => x.id == roomId.id).users.push(socket.id);
    }
    if(rooms.find(x => x.id == roomId.id).users.length == 2)
      io.to(roomId.id).emit('connected', { 'roomId': roomId.id, "message": "User connected" });
  });

  

  socket.on('message', (msg) => {
    socket.broadcast.to(msg.roomId).emit('message', { 'username': socket.handshake.query.token, "message": msg.msg });
  });
  socket.on('disconnect', () => {
    clientList.splice(clientList.indexOf(socket.id), 1);
    var disconnectedRoom = rooms.filter(x => socket.joinRooms.includes(x.id));
    if (disconnectedRoom.length > 0)
      io.to(disconnectedRoom[0].id).emit('disconnect', { 'username': "Server", "message": "User disconnected" });

  });
});



io.use((socket, next) => {
  try {
    if (!socket.handshake.query.token) {
      return next(new Error("invalid username"));
    }
    socket.emit('redirect', 'http://localhost:3000/chat');

    next();
  }
  catch (err) {
    console.log(err);
  }
});




http.listen(3000, () => {
  console.log('listening on *:3000');
});