const express = require('express')
const http = require('http')
const {v4: uuidv4} = require('uuid')
const cors = require('cors')
const twilio = require('twilio')

const PORT = process.env.PORT || 5002

const app = express()

const server = http.createServer(app)

app.use(cors())

let connectedUsers = [];
let rooms = [];

app.get('/api/room-exists/:roomId', (req,res) => {
  const {roomId} = req.params
  const room = rooms.find(room => room.id === roomId)
  if(room) {
    if(room.connectedUsers.length > 3) {
      return res.send({roomExists: true, full: true})
    } else {
      return res.send({roomExists: true, full: false})
    }
  } else {
    return res.send({roomExists: false})
  }
})

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`user connected to server with wss ${socket.id}`)

  socket.on('create-new-room', (data) => {
    createNewRoomHandler(data, socket)
  })

  socket.on('join-room', (data) => {
    joinRoomHandler(data, socket);
  })

  socket.on('disconnect', () => {
    disconnectHandler(socket)
  })
})

//handlers
const createNewRoomHandler = (data, socket) => {
  console.log('host room is creating new room', data)
  const {identity} = data;

  const roomId = uuidv4();

  //create new user
  const newUser = {
    userName: identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId
  }

  //push user to connected users
  connectedUsers = [...connectedUsers, newUser];

  //create new room
  const newRoom = {
    id: roomId,
    connectedUsers: [newUser]
  }

  //join socket io room
  socket.join(roomId)

  rooms = [...rooms, newRoom]

  //emit to that client which created that room roomid
  socket.emit('room-id', {roomId})

  //emit event to all users connected to that room about new users
  socket.emit('room-update', {connectedUsers: newRoom.connectedUsers})

}

const joinRoomHandler = (data, socket) => {
  const {identity, roomId} = data;

  //create new user
  const newUser = {
    userName: identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId
  }

  //join room as user which is not host with roomId
  const room = rooms.find(room => room.id === roomId)
  room.connectedUsers = [...room.connectedUsers, newUser]

  //join socket io room
  socket.join(roomId)

  //add new user to connected users
  connectedUsers = [...connectedUsers, newUser]

  io.to(roomId).emit('room-update', {connectedUsers: room.connectedUsers})
}

const disconnectHandler = (socket) => {
  //if user registered - remove him
  const user = connectedUsers.find(user => user.socketId === socket.id)
  if(user) {
    //remove user from room in server
    const room = rooms.find(room => room.id === user.roomId)
    room.connectedUsers = room.connectedUsers.filter(user => user.socketId !== socket.id)

    //leave socket io room
    socket.leave(user.roomId)

    //TODO
    //close the room if 0 users left
    if(room.connectedUsers.length) {
      //emit event to rest users in this room
      io.to(room.id).emit('room-update', {
        connectedUsers: room.connectedUsers
      })
    } else {
      rooms = rooms.filter(r => r.id !== room.id);
    }

  }
}


server.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
