import store from '../store/store'
import {setShowOverlay} from "../store/actions";
import * as wss from '../utils/wss'
import Peer from 'simple-peer'

const defaultConstrains = {
  audio: true,
  video: true
}

let localStream;

export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost,
  identity,
  roomId = null
) => {
  navigator.mediaDevices.getUserMedia(defaultConstrains)
    .then(stream => {
      console.log('successfully received local stream')
      localStream = stream;
      showLocalVideoPreview(localStream)
      store.dispatch(setShowOverlay(false))

      isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(identity, roomId)
    })
    .catch(console.log)
}

export const showLocalVideoPreview = (stream) => {
  //show local video
}


//peer connections logic
let peers = {}
let streams = []

const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302' //free stun server, gives info about our internet connection
      }
    ]
  }
}

export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
  const configuration = getConfiguration()

  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
  });

  peers[connUserSocketId].on('signal', (data) => {

    //webRTC offer, webRTC answer, ice candidates

    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId
    }

    wss.signalPeerData(signalData)
  })

  peers[connUserSocketId].on('stream', (stream) => {
    console.log('new stream came')

    addStream(stream, connUserSocketId)
    streams = [...streams, stream]
  })

}

export const handleSignalingData = (data) => {
  //add signaling data to peer connection
  peers[data.connUserSocketId].signal(data.signal)
}

//displaying incoming stream
const addStream = (stream, connUserSocketId) => {

}
