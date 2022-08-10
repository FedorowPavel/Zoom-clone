import store from '../store/store'
import {setMessages, setShowOverlay} from "../store/actions";
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

const messengerChanel = 'messenger'

export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
  const configuration = getConfiguration()

  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
    channelName: messengerChanel
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

  peers[connUserSocketId].on('data', (data) => {
    const messageData = JSON.parse(data);
    console.log('peers[connUserSocketId]')
    appendNewMessage(messageData);
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


///////////////////////// buttons logic ///////////////////////////////
export const toggleMic = (isMuted) => {
  localStream.getAudioTracks()[0].enabled = isMuted
}

export const toggleCamera = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled
}

export const toggleScreenSharing = (isScreenSharingActive, screenSharingStream = null) => {
  if(isScreenSharingActive) {
    switchVideoTracks(localStream)
  } else {
    switchVideoTracks(screenSharingStream)
  }
}

export const switchVideoTracks = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
          break;
        }
      }
    }
  }
}



//////////////////////// messages /////////////////////////

export const appendNewMessage = (messageData) => {
  const messages = store.getState().messages;
  store.dispatch(setMessages([...messages, messageData]))
}


export const sendMessageUsingDataChannel = (messageContent) => {
  const identity = store.getState().identity;
  const localMessageData = {
    content: messageContent,
    identity,
    messageCreatedByMe: true
  }

  appendNewMessage(localMessageData)


  const messageData = {
    content: messageContent,
    identity,
    messageCreatedByMe: false
  }
  const stringifiedMessageData = JSON.stringify(messageData)

  for (let socketId in peers) {
    const connection = peers[socketId]
    connection.send(stringifiedMessageData)
  }

}
