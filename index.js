const app = require('express')()
var cors = require('cors')
var server = require('http').Server(app);
var io = require('socket.io')(server, { cors: {origin:'http://localhost:3000' }});
const PORT = process.env.PORT || 5050
app.use(cors())
// { cors: {origin:'https://deft-jelly-5f3d79.netlify.app' }}
var room = {};

server.listen(PORT);

let broadcaster

io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
      console.log('on broadcaster')
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    console.log('on watcher')
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("disconnect", () => {
    console.log('on disconnect')
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
  socket.on("offer", (id, message) => {
    console.log('on offer')
      socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    console.log('on answer')
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    console.log('on candidate')
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
  })
});

// WARNING: app.listen(80) will NOT work here!

// io.on('connection', function(socket) {
//     console.log(socket.id + ' had connected')
//     console.log(room)

//     socket.on('message', data => {
//         data = JSON.parse(data)
//         if (!room[data.room]) {
//             room[data.room] = [socket.id]
//         } else if (room[data.room].length < 2) {
//             if (room[data.room].filter(i => i === socket.id).length === 0) {
//                 room[data.room].push(socket.id)
//             }
//         }
//         if (room[data.room].length === 2) {
//             for (s of room[data.room]) {
//                 if (s !== socket.id && io.sockets.sockets[s] && room[data.room].length <= 2) {
//                     io.sockets.sockets[s].emit('message', data.data)
//                     console.log('emit: ' + data.data)
//                 }
//             }
//         }
//     })

//     socket.on('join', (roomId) => {
//         console.log('join' + roomId)
//         if (room[roomId] && room[roomId].length === 2) {
//             socket.emit('reject', { error: 'Room is full' })
//         }
//     })

//     socket.on('leave', (roomId) => {
//         console.log('leave' + roomId)
//         for (s in room) {
//             for (let i = 0; i < room[s].length; i++) {
//                 if (room[s][i] === roomId) {
//                     room[s].splice(i, 1)
//                     if (room[s].length == 0) {
//                         delete room[s]
//                     }
//                     break
//                 }
//             }
//         }
//         console.log(room)
//     })

//     socket.on('disconnect', () => {
//         console.log(socket.id + ' has been disconnected')
//         for (s in room) {
//             for (let i = 0; i < room[s].length; i++) {
//                 if (room[s][i] === socket.id) {
//                     room[s].splice(i, 1)
//                     if (room[s].length == 0) {
//                         delete room[s]
//                     }
//                     break
//                 }
//             }
//         }
//         console.log(room)
//     })
// });