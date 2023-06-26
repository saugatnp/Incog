const express = require('express');
const { join } = require('path');
const app = express();
const http = require('http').createServer(app);
const Server = require("socket.io");
const io = new Server(http);
const path = require("path")



var rooms = [];
var clientList = [];




app.get('/', (req, res) => {
  res.sendFile(__dirname + '/content/register.html');
});

app.get('/demo', (req, res) => {
  res.sendFile(__dirname + '/content/chat.html');
});

app.get('/room', (req, res) => {
  var room = JSON.stringify(rooms);
  res.end(room);
});
app.get('/client', (req, res) => {
  var client =  JSON.stringify(clientList);
   res.end(client);
 });


app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/content/index.html');
});




app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/content/style.css');
});

app.get('/bootstrap.css', (req, res) => {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
)




io.on('connection', (socket) => {

  socket.joinRooms = [];

  clientList.push(socket.id);



  socket.on('find-room', (msg) => {
    var roomId = []
    if (rooms.length != 0 && rooms.every(x => x.users.length != 2)) {
      var roomId = rooms.find(x => x.users.length != 2);
      socket.join(roomId.id);
      socket.joinRooms.push(roomId.id);
      rooms.find(x => x.id == roomId.id).users.push(socket.id);

    
    }
    else {
        
      roomId.id = Math.floor(Math.random() * 1000000);
      rooms.push({ id: roomId.id, users: [socket.id] });
      socket.join(roomId.id);
      socket.joinRooms.push(roomId.id);
    }


    // if (rooms.length == 0 || rooms.every(x => x.users.length == 2)) {
    //   roomId.id = Math.floor(Math.random() * 1000000);
    //   rooms.push({ id: roomId.id, users: [socket.id] });
    //   socket.join(roomId.id);
    //   socket.joinRooms.push(roomId.id);
    // }
    // else {
    //   var roomId = rooms.find(x => x.users.length != 2);
    //   socket.join(roomId.id);
    //   socket.joinRooms.push(roomId.id);
    //   rooms.find(x => x.id == roomId.id).users.push(socket.id);
    // }
    if (rooms.find(x => x.id == roomId.id).users.length == 2){
      io.to(roomId.id).emit('connected', { 'roomId': roomId.id, "message": "User connected" });
    }
  });



  socket.on('message', (msg) => {
    console.log("message" ,msg);
    socket.broadcast.to(msg.roomId).emit('message', { 'username': socket.handshake.query.token, "message": msg.msg });
  });


  socket.on('disconnect', () => {
    const { type } = socket.handshake.query;
    if (type !== "register") {
      clientList.splice(clientList.indexOf(socket.id), 1);
      var disconnectedRoom = rooms.filter(x => socket.joinRooms.includes(x.id));
      // console.log("disconnected room :" , disconnectedRoom)
      // console.log("rooms :" , rooms)
      rooms.splice(rooms.indexOf(disconnectedRoom.users) - 1  , 1);
      // console.log("rooms :" , rooms)
      if (disconnectedRoom.length > 0)
        io.to(disconnectedRoom[0].id).emit('disconnect', { 'username': "Server", "message": "User disconnected" });
    }
    else {
      clientList.splice(clientList.indexOf(socket.id), 1);

    }
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