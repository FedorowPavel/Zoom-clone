import React, {useState} from 'react';
import JoinRoomInputs from "./joinRoomInputs";
import {connect} from "react-redux";
import OnlyWithAudioCheckBox from "./OnlyWithAudioCheckBox";
import {setConnectOnlyWithAudio, setIdentity, setIdentityAction, setRoomId, setRoomIdAction} from "../store/actions";
import ErrorMessage from "./ErrorMessage";
import JoinRoomButtons from "./joinRoomButtons";
import {getRoomExists} from "../utils/api";
import {useNavigate} from "react-router-dom";

const JoinRoomContent = (props) => {
  const {isRoomHost, setConnectOnlyWithAudio, connectOnlyWithAudio, setIdentityAction, setRoomIdAction} = props;
  let navigate = useNavigate();


  const [roomIdValue, setRoomIdValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleJoinRoom = async () => {
    setIdentityAction(nameValue)

    if(isRoomHost) {
      createRoom()
    } else {
      await joinRoom()
    }
    console.log('joining')
  }

  const joinRoom = async () => {
    const response = await getRoomExists(roomIdValue)
    const {roomExists, full} = response

    if(roomExists) {
      if(full) {
        setErrorMessage('Meeting is full')
      } else {
        setRoomIdAction(roomIdValue)
        navigate('/room')
      }
    } else {
      setErrorMessage('Meeting not found. Check roomId')
    }
  }

  const createRoom = () => {
    navigate('/room')
  }


  return (
    <>
      <JoinRoomInputs
        roomIdValue={roomIdValue}
        setRoomIdValue={setRoomIdValue}
        nameValue={nameValue}
        setNameValue={setNameValue}
        isRoomHost={isRoomHost}
      />
      <OnlyWithAudioCheckBox
        setConnectOnlyWithAudio={setConnectOnlyWithAudio}
        connectOnlyWithAudio={connectOnlyWithAudio}
      />
      <ErrorMessage errorMessage={errorMessage}/>
      <JoinRoomButtons handleJoinRoom={handleJoinRoom} isRoomHost={isRoomHost}/>
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    setConnectOnlyWithAudio: (onlyWithAudio) => dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
    setIdentityAction: (identity) => dispatch(setIdentityAction(identity)),
    setRoomIdAction: (roomId) => dispatch(setRoomIdAction(roomId)),
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomContent);
