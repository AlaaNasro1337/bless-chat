var express = require('express');
var app = express();

// Settings for CORS
app.use(function (req, res, next) {

// Website you wish to allow to connect
res.header('Access-Control-Allow-Origin', 'http://localhost:8080');

// Request methods you wish to allow
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);

// Pass to next layer of middleware
next();
});

var notas= [];
var users= [];
app.use(express.static(__dirname + '/dist'));
var server = app.listen(3000);
var io = require('socket.io').listen(server);
io.on('connection', function(socket){
  socket.emit('newNotes', JSON.stringify(notas) );
  console.log('a user connected');
  socket.emit('userLog', JSON.stringify(users) );
  socket.on('registered', function(user){
    socket.user = user;
    users.push(
      {
        id:user,
        name: user,
        imageUrl: 'https://i.kym-cdn.com/photos/images/original/000/744/400/8d2.jpg'
    }
    );
    socket.broadcast.emit('newUser', user);
    socket.broadcast.emit('newUserLog', user);
    });

  socket.on('msg', function(data){
    
    data.author = socket.user;
    socket.broadcast.emit('newMsg', data);
  
  });

  socket.on('notes', function(notes){
    notas = JSON.parse(notes);
    io.emit('newNotes', JSON.stringify(notas));
  });
    
  socket.on('Change', function(change){  
    io.emit('noteChange', change);
  });

  socket.on('disconnect', function () {
    io.emit('disconnected', socket.user);
     for(let i = 0;i < users.length ;i++){
          if(users[i].name == socket.user){
            users.splice(i,1);
          }
        }
    

});

});