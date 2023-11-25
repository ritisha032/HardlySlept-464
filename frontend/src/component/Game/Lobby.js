import React from "react";
import Logout from "../login/Logout";
import { useContext, useRef } from "react";
import GameContext from "../../context/GameContext";
import Player from "./Player";
import { toast } from "react-toastify";
import SocketContext from "../../context/SocketContext";
import UserContext from "../../context/UserContext";
import ChatBox from "./ChatBox";
import GameForm from "./GameForm";
import LeaveBtn from "../login/LeaveBtn";
import "./Lobby.css";

const Lobby = () => {
  const { game } = useContext(GameContext);
  const { socket } = useContext(SocketContext);

  console.log(game);
  const startGame = () => {
    socket.emit("start_game", { room: game.roomNo });
    console.log("fired start game");
  };

  const inputCode = useRef(null); //copy to clipboard
  const inputLink = useRef(null);

  const copyCode = () => {
    if (inputCode.current) {
      inputCode.current.select();
      inputCode.current.setSelectionRange(0, 99999); // For mobile devices

      try {
        document.execCommand("copy");
        toast.success("Copied to clipboard: " + inputCode.current.value);
      } catch (err) {
        toast.error("Unable to copy to clipboard", err);
      }
    }
  };

  const copyLink = () => {
    if (inputLink.current) {
      inputLink.current.select();
      inputLink.current.setSelectionRange(0, 99999); // For mobile devices

      try {
        document.execCommand("copy");
        toast.success("Copied to clipboard: " + inputLink.current.value);
      } catch (err) {
        toast.error("Unable to copy to clipboard", err);
      }
    }
  };

  return (
    <div className="lobby-cont">
      <div className="lobby-header animated-div">
        <h1 className="lobby-heading">{game.type} Room</h1>
        <div className="lobby-head-btn">
          <div>
            <LeaveBtn />
          </div>
          <div className="lobby-logout">
            <Logout />
          </div>
        </div>
      </div>

      <div className="gameForm-outer animated-div">
        <GameForm />
      </div>

      <div className='lobby-components'>
        <div className='lobby animated-div'>
          { Object.keys(game.player_names).map((data,index)=>{
            if(game.player_names[data].active==true)
          return <Player user={data}/>
          })}
        </div>
        <div className="gameForm-inner animated-div">
          <GameForm />
        </div>
        <div className="gamechat animated-div">
          <ChatBox />
        </div>
      </div>

      <div class="lobby-copy animated-div">
        <input value={(new URLSearchParams(window.location.search)).get("room")} ref={inputCode} type="text" />
        <input value={window.location.href} ref={inputLink} type="text" />

        <button className="lobby-copy-btn" type="submit" onClick={copyCode}>
          Copy Room Code
        </button>
        <button className="lobby-copy-btn" type="submit" onClick={copyLink}>
          Copy Link
        </button>
      </div>

      {/* {(user==game.admin_name)? <button onClick={()=>{startGame()}}>StartGame</button>:<div></div>} */}
    </div>
  );
};

export default Lobby;
