const express = require('express');
const app = express();
const http = require('http').createServer(app);
const Server = require("socket.io");
const io = new Server(http);



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/content/register.html');
});



app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/content/index.html');
});



io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log(msg);
    io.emit('message', { 'username': socket.username, "message": msg.msg });
  });
});




io.use((socket, next) => {
  try {
    console.log("middleware connection")
    if (!socket.handshake.query.token) {
      return next(new Error("invalid username"));
    }
    socket.username = socket.handshake.query.token;
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