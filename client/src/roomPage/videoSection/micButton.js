import React, {useState} from 'react';
import mic from '../../assets/images/mic.svg'
import micOff from '../../assets/images/micOff.svg'
import * as webRTChandler from '../../utils/webRTChandler'

const MicButton = () => {
  const [isMicMuted, setIsMicMuted] = useState(false)

  function handleMicButtonClicked() {
    webRTChandler.toggleMic(isMicMuted)
    setIsMicMuted(!isMicMuted)
  }

  return (
    <div className='video_button_container'>
      <img
        src={isMicMuted ? micOff : mic}
        onClick={handleMicButtonClicked}
        className='video_button_image'
      />
    </div>
  );
};

export default MicButton;
