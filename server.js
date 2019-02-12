var express = require('express');
var app = express();

const port = process.env.PORT;

var notas= [];
var users= [];
app.use(express.static(__dirname + '/dist'));
var server = app.listen( port);
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