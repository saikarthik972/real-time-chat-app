const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('sendMessage', (message) => {
    console.log(`Message from ${socket.id}: ${message}`);
    io.emit('receiveMessage', message); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });

  // Handle errors
  socket.on('error', (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
