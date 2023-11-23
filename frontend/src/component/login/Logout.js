import React, { useContext } from 'react'
import { useAuth } from "../../context/auth";
import { useNavigate } from 'react-router-dom';
import RoomHandler from './RoomHandler';
import { toast } from 'react-toastify';
import GameContext from '../../context/GameContext';
import './Logout.css'

const Logout = () => {
    const [auth, setAuth] = useAuth();
    const navigate=useNavigate();
    const {setGame}=useContext(GameContext)
    const handleLogout = () => {
        setAuth({
          ...auth,
          user: null,
          token: "",
        });
        setGame(null);
        
        localStorage.removeItem("auth");
        toast.success("Logged out successfully");
        navigate("/");

        
      };

  return (
    <div>
       <button onClick={handleLogout} className='logout-btn'>Logout</button>
    </div>
  )
}

export default Logout