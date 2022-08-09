import React, {useEffect} from 'react';
import ParticipantSection from "./participantsSection/participantSection";
import VideoSection from "./videoSection/videoSection";
import ChatSection from "./chatSection/chatSection";
import RoomLabel from "./roomLabel";
import './roomPage.css'
import {connect} from "react-redux";
import * as webRTCHandler from '../utils/webRTChandler'
import Spinner from "./spinner";

const RoomPage = ({roomId, isRoomHost, identity, showOverlay}) => {

  useEffect(() => {
    webRTCHandler.getLocalPreviewAndInitRoomConnection(isRoomHost, identity, roomId)
  }, [])

  return (
    <div className='room_container'>
      <ParticipantSection/>
      <VideoSection/>
      <ChatSection/>
      <RoomLabel roomId={roomId}/>
      {showOverlay && <Spinner/>}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {...state}
}

export default connect(mapStoreStateToProps)(RoomPage);
