import React from 'react';

const Input = ({placeHolder, value, changeHandler}) => {
  return (
    <input
      value={value}
      placeholder={placeHolder}
      onChange={changeHandler}
      className='join_room_input'
    />
  )
}

const JoinRoomInputs = (props) => {
  const {roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost} = props

  const handleRoomIdValueChange = (event) => {
    setRoomIdValue(event.target.value)
  }

  const handleNameValueChange = (event) => {
    setNameValue(event.target.value)
  }

  return (
    <div className='join_room_inputs_container'>
      {!isRoomHost && (<Input
        placeHolder='enter meeting id'
        value={roomIdValue}
        changeHandler={handleRoomIdValueChange}
      />)}
        <Input
        placeHolder='enter your name'
        value={nameValue}
        changeHandler={handleNameValueChange}
        />
    </div>
  );
};

export default JoinRoomInputs;

