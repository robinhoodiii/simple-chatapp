const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Store connected users
const users = {};

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user login
  socket.on('login', (username) => {
    users[socket.id] = username;
    io.emit('user joined', username);
  });

  // Handle chat messages
  socket.on('chat message', (message) => {
    const username = users[socket.id];
    io.emit('chat message', { username, message });
  });

  // Handle user disconnections
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('user left', username);
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
