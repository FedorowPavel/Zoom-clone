import React from 'react';
import ChatLabel from "./chatLabel";
import Messages from "./messages";
import NewMessage from "./newMessage";

const ChatSection = () => {
  return (
    <div className='chat_section_container'>
      <ChatLabel/>
      <Messages />
      <NewMessage/>
    </div>
  );
};

export default ChatSection;
