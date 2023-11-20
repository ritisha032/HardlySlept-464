import React from 'react';
import {useEffect, useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client';
import GameContext from '../../context/GameContext';
import UserContext from '../../context/UserContext';
import { toast } from "react-toastify";
import SocketContext from '../../context/SocketContext';
import './RoomHandler.css'
import Logout from './Logout';
const socketTemp = io.connect('http://localhost:3001');

const RoomHandler = () => {
    
    const navigate=useNavigate();
    const {setSocket,socket} =useContext(SocketContext);
    const {game,setGame} = useContext(GameContext);
    const {user} = useContext(UserContext)
    //var username = user
    const [room,setRoom] = useState("");
    const handleChange=(e)=>{
        setRoom(e.target.value);
    };

    useEffect(()=>{
      if(socket==null)
      setSocket(socketTemp);
      if(socket!=null){
        socket.on("no_game",(data)=>{
          toast.warning(data.message);
        })
        socket.on("game_data",(data)=>{
          setGame(data);
          console.log("i am in room handler");
        console.log(data);
          localStorage.setItem('game',JSON.stringify(data));

          
        })
      }
    },[socket])


    useEffect(()=>{
      if(game!=null){
        console.log("game data = " + game);
        navigate(`/${game.roomNo}`);
      }
      
    },[game])
    const createRoom = async (type) =>{
        console.log(user + "in create room call")
        await socket.emit("create_room",{type:type,user:user});
        // socket.on("room_created", (data) => {
        //     setGame(data) // runs use State
        //     console.log(data);
        // })
    };

    const joinRoom = async (type) =>{
      await socket.emit("join_room",{type:type,user:user,room:room});
      socket.on("room_created",(data) => {
          setGame(data) // runs use State
          console.log(data);
      })
    }
    

  return (
    <div>
        {/* { (socket==null)?<div>Loading</div>: */}
        <div className="room-cont">

            <button id="publicButton" className='btn'
             onClick={()=>createRoom("public")}
            >Create Public Room</button>

            <button id="privateButton" className='btn'
             onClick={()=>createRoom("private")}
            >Create Private Room</button>

            <div className='publicRoom-cont'>
                <input placeholder="Enter Room Code" className='msg-field' 
                value={room} onChange={handleChange} 
                />
                <button id="publicButton"className='btn'
                onClick={()=>joinRoom("private")}
                >Join Private Room</button>
            </div>
            
            <button id="privateButton" className='btn'
            onClick={()=>joinRoom("public")}
            >Join Public Room</button>

            <Logout className='btn'/>

        </div>
        {/* } */}
    </div>
  )
}

export default RoomHandler