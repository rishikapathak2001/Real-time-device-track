const express = require('express')
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection' , function (socket){
    socket.on('send-location' , function (data) {
        io.emit('received-location' , {id: socket.id,  ...data});
    })
   socket.on('disconnect' , function(){
    io.emit('user-disconnected' , socket.id)
   })
});

// Define a route for the home page
app.get('/', (req, res) => {
    res.render('index'); // Render the 'index.ejs' view
});








server.listen(3000, (err)=>{
    console.log("server is running on port 3000")
})