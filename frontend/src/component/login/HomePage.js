import React from 'react'
import { useAuth } from "../../context/auth";
import { useNavigate } from 'react-router-dom';
import RoomHandler from './RoomHandler';
import Logout from './Logout';


const Homepage = () => {
  const [auth, setAuth] = useAuth();

    
    return (
        <>
            <h1>Welcome {auth?.user?.name}</h1>

<Logout/>
            <RoomHandler></RoomHandler>


        </>
    )
}
export default Homepage