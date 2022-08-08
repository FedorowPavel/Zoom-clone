import React, {useState} from 'react';
import switchImage from '../../assets/images/switchToScreenSharing.svg'

const SwitchToScreenShareButton = () => {
  const [isSharing, setIsSharing] = useState(false)

  const toggleHandler = () => {
    setIsSharing(!isSharing)
  }
  return (
    <div className='video_button_container'>
      <img
        src={switchImage}
        onClick={toggleHandler}
        className='video_button_image'/>
    </div>
  );
};

export default SwitchToScreenShareButton;
