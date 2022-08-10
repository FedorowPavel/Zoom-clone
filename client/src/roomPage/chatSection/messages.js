import React from 'react';

const mock = [
  {
    content: 'hey',
    identity: 'Pavel',
    messageCreatedByMe: true,
  },
  {
    content: 'yes i see you',
    identity: 'Max',
    messageCreatedByMe: false,
  },
  {
    content: 'bla bla bla',
    identity: 'Marek',
    messageCreatedByMe: false,
  },
  {
    content: 'yuhoooooo',
    identity: 'Marek',
    messageCreatedByMe: false,
  },
]

const Message = ({author, content, sameAuthor, messageCreatedByMe}) => {
  const alignClass = messageCreatedByMe ? 'message_align_right' : 'message_align_left'

  const authorText = messageCreatedByMe ? 'You' : author;

  const contentAdditionalStyles = messageCreatedByMe ? 'message_right_styles' : 'message_left_styles'

  return (
    <div className={`message_container ${alignClass}`}>
      {!sameAuthor && <p className='message_title'>{authorText}</p>}
      <p className={`message_content ${contentAdditionalStyles}`}>{content}</p>
    </div>
  )

}

const Messages = () => {
  return (
    <div className='messages_container'>
      {mock.map((message, index) => {
        const sameAuthor = index > 0 && message.identity === mock[index-1].identity

        return (
          <Message
            key={`${message.content}${index}`}
            author={message.identity}
            content={message.content}
            sameAuthor={sameAuthor}
            messageCreatedByMe={message.messageCreatedByMe}
          />
        )
      })}
    </div>
  );
};

export default Messages;
