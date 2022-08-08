import React from 'react';
import ParticipantSection from "./participantsSection/participantSection";
import VideoSection from "./videoSection/videoSection";
import ChatSection from "./chatSection/chatSection";
import RoomLabel from "./roomLabel";
import './roomPage.css'
import {connect} from "react-redux";

const RoomPage = ({roomId}) => {
  return (
    <div className='room_container'>
      <ParticipantSection/>
      <VideoSection/>
      <ChatSection/>
      <RoomLabel roomId={roomId}/>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {...state}
}

export default connect(mapStoreStateToProps)(RoomPage);
