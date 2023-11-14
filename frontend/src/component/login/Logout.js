import React from 'react'
import { useAuth } from "../../context/auth";
import { useNavigate } from 'react-router-dom';
import RoomHandler from './RoomHandler';

const Logout = () => {
    const [auth, setAuth] = useAuth();
    const navigate=useNavigate();

    const handleLogout = () => {
        setAuth({
          ...auth,
          user: null,
          token: "",
        });
        
        localStorage.removeItem("auth");
        navigate("/login");

        
      };

  return (
    <div>
            <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default Logout