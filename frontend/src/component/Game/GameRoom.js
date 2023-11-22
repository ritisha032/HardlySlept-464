import React, { useContext, useEffect } from 'react'
import GameContext from '../../context/GameContext'
import Game from './Game'
import Lobby from './Lobby'
import { useNavigate } from 'react-router-dom';
import SocketContext from '../../context/SocketContext'
import { useAuth} from "../../context/auth";

function GameRoom() {
    const {game,setGame} = useContext(GameContext);
    const {socket} = useContext(SocketContext);
    const [auth,setAuth]=useAuth('');
    const navigate=useNavigate();
    const out = new URLSearchParams(window.location.search);
    console.log(out.get("room"))
    useEffect(()=>{
      if(socket!=null){
      
      socket.emit("join_room",{user:auth.user.username});
      socket.on("leave_room",(data)=>{
        navigate(`/HomePage`);
      })
      socket.on("join_room",(data)=>{
        setGame(data);
      })
      }
      
    },[])

    return (
    <div>{(game===null)?<div>Loading</div>:(game.status=="Lobby")?<Lobby/>:<Game/>}</div>
  )
}

export default GameRoom