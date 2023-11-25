import React, { useContext, useState } from "react";
import "./Player.css";
import SocketContext from "../../context/SocketContext";
import GameContext from "../../context/GameContext";
import { useAuth} from "../../context/auth";

function Player(props) {
  const [isShow, setIsShow] = useState("false");
  const {socket,setSocket} = useContext(SocketContext)
  const {game,setGame} =useContext(GameContext);
  const [auth,setAuth]=useAuth('');
  function kick(){
      socket.emit("kick",props.user);
  }
  function mute(){
    socket.emit("mute",props.user);
  }

  const handleKick = () => {
    setIsShow(!isShow);
  };

  return (
    <>
      <div className="player-cont" onClick={handleKick}>
        {props.user}{" "}
        {props.score != undefined ? <div>score-{props.score.score}</div> : ""}
      </div>
      {(!isShow && (auth.user.username==game.admin_name) && (auth.user.username!=props.user) )? (
        <div className="player-btn animated-div">
          <button className="kick-btn animated div" onClick={()=>{kick()}} >Kick</button>
          <button className="mute-btn animated div" onClick={()=>{mute()}}>Mute</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Player;
