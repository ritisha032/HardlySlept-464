import React from 'react';
import {useEffect, useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client';
import GameContext from '../../context/GameContext';
import { useAuth} from "../../context/auth";
import { toast } from "react-toastify";
import SocketContext from '../../context/SocketContext';
import './RoomHandler.css'
import Logout from './Logout';
import GameRoom from '../Game/GameRoom'
const socketTemp = io.connect('http://localhost:3001');

const RoomHandler = () => {
    
    const navigate=useNavigate();
    const {setSocket,socket} =useContext(SocketContext);
    const {game,setGame} = useContext(GameContext);
    const [auth,setAuth]=useAuth('');
    const [room,setRoom] = useState("");
    const handleChange=(e)=>{
        setRoom(e.target.value);
    };
    const params = new URLSearchParams(window.location.search);

    useEffect(()=>{
      if(socket==null){
        setSocket(socketTemp);
        console.log(socketTemp);
        console.log("sokcet is null");
      }
        
      if(socket!=null){
        const roomurl = params.get("room")
        roomurl?socket.emit("join_room",{type:"url",user:auth.user.username,room:roomurl}):
        socket.on("no_game",(data)=>{ toast.warning(data.message);  })
        socket.on("game_data",(data)=>{ setGame(data);})
      }
    },[socket])


    useEffect(()=>{
      if(game!=null){
        console.log("game data = " + game);
        navigate(`/game/?room=${game.roomNo}`);
      }
      
    },[game])

 async function createRoom(type){
        await socket.emit("create_room",{type:type,user:auth.user.username});
    };

    async function joinRoom(type){
      await socket.emit("join_room",{type:type,user:auth.user.username,room:room});
      socket.on("room_created",(data) => {
          setGame(data) // runs use State
          console.log(data);
      })
    }
    

  return (
    <div>
        {
          (game==null)?
          (socket==null)?
            <div>Loading</div>:
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

        </div>:<GameRoom/>
        }
    </div>
  )
}

export default RoomHandler