import React from 'react';
import {useEffect, useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client';
import GameContext from '../../context/GameContext';
import UserContext from '../../context/UserContext';
import { toast } from "react-toastify";
import SocketContext from '../../context/SocketContext';
const socketTemp = io.connect('http://localhost:3001');


const RoomHandler = () => {
    const {setSocket,socket} =useContext(SocketContext);
    const navigate=useNavigate();
    setSocket(socketTemp);
    const {game,setGame} = useContext(GameContext)
    const {user} = useContext(UserContext)
    //var username = user
    const [room,setRoom] = useState("");
    const handleChange=(e)=>{
    setRoom(e.target.value);
    };

    useEffect(()=>{
      if(socket!=null){
        socket.on("no_game",(data)=>{
          toast.warning(data.message);
        })
        socket.on("game_joined",(data)=>{
          setGame(data);
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
        socket.on("room_created", (data) => {
            setGame(data) // runs use State
            console.log(data);
        })
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
    { (socket==null)?<div>Loading</div>:<div>
  <button id="publicButton" onClick={()=>createRoom("public")}>Create Public Room</button>
  <button id="privateButton" onClick={()=>createRoom("private")}>Create Private Room</button>
  <input placeholder="roomNo" value={room} onChange={handleChange} />
  <button id="publicButton" onClick={()=>joinRoom("private")}>Join Private Room</button>
  <button id="privateButton" onClick={()=>joinRoom("public")}>Join Public Room</button>
    </div>}
    </div>
  )
}

export default RoomHandler