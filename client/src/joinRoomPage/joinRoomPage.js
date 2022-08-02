import React, {useEffect} from 'react';
import './joinRoomPage.css'
import { useLocation } from "react-router-dom";
import {setIsRoomHost} from "../store/actions";
import {connect} from "react-redux";
import JoinRoomTittle from "./joinRoomTittle";
import JoinRoomContent from "./joinRoomContent";

const JoinRoomPage = (props) => {
  const {setIsRoomHostAction, isRoomHost} = props;
  const query = useLocation().search;

  useEffect(() => {
    const isHost = new URLSearchParams(query).get('host')
    if(isHost) {
      setIsRoomHostAction(true)
    }
  }, [])

  return (
    <div className='join_room_page_container'>
      <div className='join_room_page_panel'>
        <JoinRoomTittle isRoomHost={isRoomHost}/>
        <JoinRoomContent/>
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost))
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomPage);
