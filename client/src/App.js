import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import JoinRoomPage from "./joinRoomPage/joinRoomPage";
import RoomPage from "./roomPage/roomPage";
import IntroductionPage from "./introductionPage/introductionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroductionPage/>}/>
        <Route path="/join-room" element={<JoinRoomPage/>}/>
        <Route path="/room" element={<RoomPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
