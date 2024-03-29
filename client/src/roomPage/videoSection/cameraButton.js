import React, {useState} from 'react';
import camera from '../../assets/images/camera.svg'
import cameraOff from '../../assets/images/cameraOff.svg'
import * as webRTChandler from '../../utils/webRTChandler'


const CameraButton = () => {
  const [disabled, setIsDisabled] = useState(false)

  const handleCameraClick = () => {
    webRTChandler.toggleCamera(disabled)
    setIsDisabled(!disabled)
  }

  return (
    <div className='video_button_container'>
      <img
        className='video_button_image'
        src={disabled ? cameraOff : camera}
        onClick={handleCameraClick}
      />
    </div>
  );
};

export default CameraButton;
