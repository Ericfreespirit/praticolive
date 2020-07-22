const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));


function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  socket.on('drawing2', (data) => socket.broadcast.emit('drawing2', data));
  socket.on('drawing3', (data) => socket.broadcast.emit('drawing3', data));
  socket.on('drawing4', (data) => socket.broadcast.emit('drawing4', data));
  socket.on('drawing5', (data) => socket.broadcast.emit('drawing5', data));
  socket.on('drawing6', (data) => socket.broadcast.emit('drawing6', data));
  socket.on('drawing7', (data) => socket.broadcast.emit('drawing7', data));
  socket.on('drawing8', (data) => socket.broadcast.emit('drawing8', data));
  socket.on('drawing9', (data) => socket.broadcast.emit('drawing9', data));
  socket.on('drawing10', (data) => socket.broadcast.emit('drawing10', data));
  
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
