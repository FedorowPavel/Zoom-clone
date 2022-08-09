import store from '../store/store'
import {setShowOverlay} from "../store/actions";

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
      // isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(roomId, identity)
    })
    .catch(console.log)
}

export const showLocalVideoPreview = (stream) => {
  //show local video
}
