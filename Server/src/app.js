const express = require('express');
const app = express();
const http = require('http').createServer(app);
const  Server  = require("socket.io");
const io = new Server(http);


app.get('/', (req, res) => {
    // res.send('hello world');
    res.sendFile(__dirname + '/content/register.html');
});

app.get('/saugat', (req, res) => {
    res.sendFile(__dirname + '/content/index.html');
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('username', (msg) => {


        socket.emit('redirect', 'http://localhost:3000/saugat');
      });
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', {'username': msg.username , "message" : msg.msg});
      });
    });

http.listen(3000, () => {
  console.log('listening on *:3000');
});