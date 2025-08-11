const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join( __dirname , 'public')));

io.on('connection', (socket) => {
  socket.on('send-location', (coords) => {
    console.log('Location received:', coords);
    io.emit('new-location',{ id :socket.id,...coords});
  });
  console.log('A user connected');
  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
  }); 
});
app.get('/', (req, res) => {
  res.render("index");
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})