import React from 'react';
import {connect} from "react-redux";

const Participant = (props) => {
  const {identity, lastItem, participant} = props

  return <>
    <p className='participants_paragraph'>{identity}</p>
    {!lastItem && <span className='participants_separator_line'></span>}
  </>
}

const Participants = ({participants}) => {
  return (
    <div className='participants_container'>
      {participants.map((item, index) => {
        return (
          <Participant
            identity={item.userName}
            key={item.id}
            lastItem={participants.length - 1 === index}
            participant={item}/>
        )
      })}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStoreStateToProps)(Participants);
