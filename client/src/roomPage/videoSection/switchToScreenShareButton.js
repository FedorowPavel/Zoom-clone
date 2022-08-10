import React, {useState} from 'react';
import switchImage from '../../assets/images/switchToScreenSharing.svg'
import LocalScreenSharingPreview from "./localScreenSharingPreview";
import * as webRTCHandler from '../../utils/webRTChandler'

const constrains = {
  audio: false,
  video: true
}

const SwitchToScreenShareButton = () => {
  const [isSharing, setIsSharing] = useState(false)
  const [screenSharingStream, setScreenSharingStream] = useState(null)

  const toggleHandler = async () => {
    if(!isSharing) {
      let stream = null;
      try{
        stream = await navigator.mediaDevices.getDisplayMedia({constrains})
      } catch (err) {
        console.log('error getting screen sharing stream',err)
      }
      if (stream) {
        setScreenSharingStream(stream)
        webRTCHandler.toggleScreenSharing(isSharing, stream)
        setIsSharing(true)
      }
    }  else {
      webRTCHandler.toggleScreenSharing(isSharing)
      setIsSharing(false)
      screenSharingStream.getTracks().forEach(t => t.stop())
      screenSharingStream(null)
    }
  }
  return (
    <>
      <div className='video_button_container'>
        <img
          src={switchImage}
          onClick={toggleHandler}
          className='video_button_image'/>
      </div>
      {isSharing && <LocalScreenSharingPreview stream={screenSharingStream}/>}
    </>

  );
};

export default SwitchToScreenShareButton;
