import React from 'react'
import { useAuth } from "../../context/auth";
import { useNavigate } from 'react-router-dom';
import RoomHandler from './RoomHandler';
import Logout from './Logout';
import './Home-Page.css'


const Homepage = () => {
  const [auth, setAuth] = useAuth();

    
    return (
        <>
            <div className='home-container'>
               <h1 className='animated-div'>Welcome {auth?.user?.name}</h1>
               {/* <Logout/> */}
               <div className='animated-div'><RoomHandler/></div> 
            </div>
            
        </>
    )
}
export default Homepage