import React, {useState} from 'react';
import sendMessageButton from '../../assets/images/send.svg'

const NewMessage = () => {
  const [message, setMessage] = useState('')

  const handleTextChange = (e) => {
    setMessage(e.target.value)
  }

  const handleKeyPressed = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      //send message to other users
      console.log('sending message....')
      setMessage('')

    }
  }

  const sendMessage = () => {
    if(message.length) {
      console.log('sending message to other users', message)
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
