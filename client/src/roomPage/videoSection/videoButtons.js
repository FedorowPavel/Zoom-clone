import React from 'react';
import MicButton from "./micButton";
import CameraButton from "./cameraButton";
import LeaveRoomButton from "./leaveRoomButton";
import SwitchToScreenShareButton from "./switchToScreenShareButton";

const VideoButtons = (props) => {
  return (
    <div className='video_buttons_container'>
      <MicButton/>
      <CameraButton/>
      <LeaveRoomButton/>
      <SwitchToScreenShareButton/>
    </div>
  );
};

export default VideoButtons;
