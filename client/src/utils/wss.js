import io from 'socket.io-client'
import store from '../store/store'
import {setParticipants, setRoomIdAction} from "../store/actions";
import * as webRTCHandler from './webRTChandler'


const SERVER = 'http://localhost:5002';

let socket = null;

export const connectWithSocketIOServer = () => {
  socket = io(SERVER)

  socket.on('connect', () => {
    console.log('WSS connected!')
    console.log(socket.id)
  })

  socket.on('room-id', (data) => {
    const {roomId} = data
    store.dispatch(setRoomIdAction(roomId))
  })

  socket.on('room-update', (data) => {
    const {connectedUsers} = data;
    store.dispatch(setParticipants(connectedUsers))
  })

  socket.on('connection-prepare', (data) => {
    const {connUserSocketId} = data;

    webRTCHandler.prepareNewPeerConnection(connUserSocketId, false)

    //inform user which just join room that we have prepared for incoming connection
    socket.emit('connection-init', {connUserSocketId: connUserSocketId})
  })

  socket.on('connection-signal', (data) => {
    webRTCHandler.handleSignalingData(data)
  })

  socket.on('connection-init', data => {
    const {connUserSocketId} = data;
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, true)
  })

  socket.on('user-disconnected', data => {
    webRTCHandler.removePeerConnection(data)
  })

}


export const createNewRoom = (identity) => {
  const data = {
    identity
  }

  socket.emit('create-new-room', data)
}

export const joinRoom = (identity, roomId) => {
  const data = {
    roomId,
    identity
  }
  socket.emit('join-room', data)

}

export const signalPeerData = (signalData) => {
  socket.emit('connection-signal', signalData);
}
