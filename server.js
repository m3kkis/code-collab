var express = require('express');
var path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var publicPath = path.resolve(__dirname, 'public');

const PORT = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.get('/', function(req, res){
    res.sendFile('index.html', {root: publicPath});
});

io.on('connection', function(socket){
    console.log('a user connected');
    var room;

    socket.on('roomjoin', (msg) => {
        socket.join(msg);
        room = msg;
    });

    socket.on('message', (msg) => {
        socket.to(room).emit('message', msg)
    });
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});



http.listen(PORT, function(){
  console.log(`listening on ${PORT}`);
});