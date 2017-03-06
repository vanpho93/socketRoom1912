let express = require('express');
let app = express();

let server = require('http').Server(app);//1
let io = require('socket.io')(server);//2
server.listen(3000, () => console.log('Server started'));//3

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.get('/', (req, res) => res.render('home'));

io.on('connection', socket => {
  socket.on('CLIENT_SIGN_UP', username => {
    socket.username = username;
  });

  socket.on('CLIENT_JOIN_ROOM', roomName => {
    socket.join(roomName, () => {
      console.log(`${socket.username} da join vao ${roomName}`);
    });
  });

  socket.on('CLIENT_SEND_MESSAGE', data => {
    let { message, room } = data;
    io.in(room).emit('NEW_MESSAGE', socket.username + ': ' +message)
  });
});
