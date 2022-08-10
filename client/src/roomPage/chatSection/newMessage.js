import React, {useState} from 'react';
import sendMessageButton from '../../assets/images/send.svg'
import {sendMessageUsingDataChannel} from "../../utils/webRTChandler";
import * as webRTCHandler from '../../utils/webRTChandler'

const NewMessage = () => {
  const [message, setMessage] = useState('')

  const handleTextChange = (e) => {
    setMessage(e.target.value)
  }

  const handleKeyPressed = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      sendMessage()
      setMessage('')

    }
  }

  const sendMessage = () => {
    if(message.length) {
      webRTCHandler.sendMessageUsingDataChannel(message)
      setMessage('')
    }
  }

  return (
    <div className='new_message_container'>
      <input
        className='new_message_input'
        value={message}
        onChange={handleTextChange}
        placeholder='Type your message'
        type='text'
        onKeyDown={handleKeyPressed}
      />
      <img
        className='new_message_button'
        src={sendMessageButton}
        onClick={sendMessage}
      />
    </div>
  );
};

export default NewMessage;
