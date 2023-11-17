import React, { useContext } from 'react'
import { useAuth } from "../../context/auth";
import { useNavigate } from 'react-router-dom';
import RoomHandler from './RoomHandler';
import { toast } from 'react-toastify';
import UserContext from '../../context/UserContext';
import GameContext from '../../context/GameContext';

const Logout = () => {
    const [auth, setAuth] = useAuth();
    const navigate=useNavigate();
    const {setGame}=useContext(GameContext)
    const {setUser}=useContext(UserContext)
    const handleLogout = () => {
        setAuth({
          ...auth,
          user: null,
          token: "",
        });
        setGame(null);
        setUser(null);
        
        localStorage.removeItem("auth");
        toast.success("Logged out successfully");
        navigate("/login");

        
      };

  return (
    <div>
            <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default Logout