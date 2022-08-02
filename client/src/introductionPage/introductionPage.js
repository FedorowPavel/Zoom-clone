import React, {useEffect} from 'react';
import logo from '../assets/images/logo.png'
import './introductionPage.css'
import ConnectingButtons from "./ConnectingButtons";
import {setIsRoomHost} from "../store/actions";
import {connect} from "react-redux";

const IntroductionPage = ({setIsRoomHostAction}) => {
  useEffect(() => {
    setIsRoomHostAction(false)
  }, [])

  return (
    <div className="introduction_page_container">
      <div className="introduction_page_panel">
        <img alt='logo' className="introduction_page_image" src={logo} />
        <ConnectingButtons/>
      </div>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost))
  }
}

export default connect(null, mapActionsToProps)(IntroductionPage);
