// import logo from './logo.svg';
import './App.css';
import Sample from './component/login/Login-SignUp.js';
import Login from './component/login/Login.js'
import SignUp from './component/login/SignUp.js'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Routes,Route} from "react-router-dom";
import Homepage from './component/login/HomePage.js';
import PrivateRoute from './component/Routes/Private.js';
import GameRoom from './component/Game/GameRoom.js';
import Otp from './component/login/Otp.js';
import Profile from './component/login/Profile.js';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Sample/>}></Route>
        <Route path="/HomePage" element={<Homepage/>}></Route>
        <Route path="/game/" element={<Homepage/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/otp" element={<Otp/>}></Route>
      </Routes>
    </>

  );
}

export default App;