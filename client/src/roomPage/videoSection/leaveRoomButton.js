import React from 'react';

const LeaveRoomButton = () => {
  const handleRoomDisconnectionClick = () => {
    window.location.href = window.location.origin
  }

  return (
    <div className='video_button_container'>
      <button className='video_button_end' onClick={handleRoomDisconnectionClick}>
        Leave room
      </button>
    </div>
  );
};

export default LeaveRoomButton;
