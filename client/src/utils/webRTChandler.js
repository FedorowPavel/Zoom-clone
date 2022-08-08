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
      localStream = stream;
      showLocalVideoPreview(localStream)
      // isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(roomId, identity)
    })
    .catch(console.log)
}

export const showLocalVideoPreview = (stream) => {
  //show local video
}
