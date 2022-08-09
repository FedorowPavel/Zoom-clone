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

}

server.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
