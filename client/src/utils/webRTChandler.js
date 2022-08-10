import store from '../store/store'
import {setShowOverlay} from "../store/actions";
import * as wss from '../utils/wss'
import Peer from 'simple-peer'

const defaultConstrains = {
  audio: true,
  video: {
    width: 480
  },

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

export const removePeerConnection = (data) => {
  const {socketId} = data;
  const videoContainer = document.getElementById(socketId)
  const videoElement = document.getElementById(`${socketId}-video`)

  if(videoContainer && videoElement) {
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach(t => t.stop())
    videoElement.srcObject = null;
    videoContainer.removeChild(videoElement)

    videoContainer.parentNode.removeChild(videoContainer)

    if(peers[socketId]) {
      peers[socketId].destroy()
    }
    delete peers[socketId]
  }

}


/////////////////////////////// UI /////////////////////////////
export const showLocalVideoPreview = (stream) => {
  //show local video
  const videosContainer = document.getElementById('videos_portal');
  videosContainer.classList.add('videos_portal_styles')
  const videoContainer = document.createElement('div')
  videoContainer.classList.add('video_track_container')

  const videoElement = document.createElement('video');
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;

  videoElement.onloadedmetadata = () => {
    videoElement.play()
  }

  videoContainer.appendChild(videoElement);
  videosContainer.appendChild(videoContainer)
}

//displaying incoming stream
const addStream = (stream, connUserSocketId) => {
  const videosContainer = document.getElementById('videos_portal');
  const videoContainer = document.createElement('div')
  videoContainer.id = connUserSocketId
  videoContainer.classList.add('video_track_container')

  const videoElement = document.createElement('video');
  videoElement.autoplay = true;
  videoElement.muted = true;

  videoElement.srcObject = stream;
  videoElement.id = `${connUserSocketId}-video`

  videoElement.onloadedmetadata = () => {
    videoElement.play()
  }

  videoElement.addEventListener('click', () => {
    if(videoElement.classList.contains('full_screen')) {
      videoElement.classList.remove('full_screen')
    } else {
      videoElement.classList.add('full_screen')
    }
  })

  videoContainer.appendChild(videoElement);
  videosContainer.appendChild(videoContainer)
}
