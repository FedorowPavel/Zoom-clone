import React from 'react';

const list = [
  {
    identity: 'Pavel',

  },
  {
    identity: 'Anna',

  },
  {
    identity: 'Marek',

  },
  {
    identity: 'Darius',
  }
]

const Participant = (props) => {
  const {identity, lastItem, participant} = props

  return <>
    <p className='participants_paragraph'>{identity}</p>
    {!lastItem && <span className='participants_separator_line'></span>}
  </>
}

const Participants = () => {
  return (
    <div className='participants_container'>
      {list.map((item, index) => {
        return (
          <Participant
            identity={item.identity}
            key={item.identity}
            lastItem={list.length - 1 === index}
            participant={item}/>
        )
      })}
    </div>
  );
};

export default Participants;
