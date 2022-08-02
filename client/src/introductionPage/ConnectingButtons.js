import React from 'react';
import ConnectingButton from "./ConnectingButton";
import { useNavigate } from "react-router-dom";

const ConnectingButtons = () => {
  let navigate = useNavigate();


  const pushToJoinRoomPage = () => {navigate('join-room')}
  const pushToJoinRoomPageAsHost = () => {navigate('join-room?host=true')}

  return (
    <div className='connecting_buttons_container'>
      <ConnectingButton buttonText='join a meeting' onClickHandler={pushToJoinRoomPage}/>
      <ConnectingButton buttonText='host a meeting' onClickHandler={pushToJoinRoomPageAsHost} createRoomButton/>
    </div>
  );
};

export default ConnectingButtons;
