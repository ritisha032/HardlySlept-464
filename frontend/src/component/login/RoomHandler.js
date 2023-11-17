import React from 'react';
import {useEffect, useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client';
import GameContext from '../../context/GameContext';
import UserContext from '../../context/UserContext';

const socket = io.connect('http://localhost:3001');



const RoomHandler = () => {
    const navigate=useNavigate();
    const {game,setGame} = useContext(GameContext)
    const {user} = useContext(UserContext)
    //var username = user
    const [room,setRoom] = useState("");
    const handleChange=(e)=>{
    setRoom(e.target.value);
    };

    const createRoom = (type) =>{
        console.log(user + "in create room call")
        socket.emit("create_room",{type:type,user:user});
        socket.on("room_created", (data) => {
          setGame(data)
          console.log(data);
          console.log("game data = " + game);
          navigate(`/${data.roomNo}`);
        })

    };
    const joinRoom = (type) =>{

    }

  return (
    <div>
  <button id="publicButton" onClick={()=>createRoom("public")}>Create Public Room</button>
  <button id="privateButton" onClick={()=>createRoom("private")}>Create Private Room</button>
  <input placeholder="roomNo" value={room} onChange={handleChange} />
  <button id="publicButton" onClick={()=>joinRoom("public")}>Create Public Room</button>
  <button id="privateButton" onClick={()=>joinRoom("private")}>Create Private Room</button>
    </div>
  )
}

export default RoomHandler