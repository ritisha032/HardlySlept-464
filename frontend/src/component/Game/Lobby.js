import React from 'react'
import Logout from '../login/Logout'
import { useContext,useRef } from 'react'
import GameContext from '../../context/GameContext'
import Player from './Player'
import { toast } from "react-toastify";
import SocketContext from '../../context/SocketContext'
import UserContext from '../../context/UserContext'
import ChatBox from './ChatBox'
import GameForm from './GameForm'
import './Lobby.css'

const Lobby = () => {
  const {game} = useContext(GameContext)
  const {socket} = useContext(SocketContext)
  const {user} = useContext(UserContext)
  console.log(game);
  const startGame = () =>{
      socket.emit("start_game",{room : game.roomNo})
      console.log("fired start game")
  }

   const inputRef = useRef(null); //copy to clipboard

    const copyToClipboard = () => {
      if (inputRef.current) {
        inputRef.current.select();
        inputRef.current.setSelectionRange(0, 99999); // For mobile devices

        try {
          document.execCommand('copy');
          toast.success('Copied to clipboard: ' + inputRef.current.value);
        } catch (err) {
          toast.error('Unable to copy to clipboard', err);
        }
      }
    };

  return (
   <div className='lobby-cont'>
      <div className='lobby-header animated-div'>
        <h1 className='lobby-heading'>{game.type} Room</h1>
        <div className='lobby-logout'><Logout/></div>
      </div>

      
      <div className='gameForm-outer animated-div'><GameForm/></div>
  

      <div className='lobby-components'>
        <div className='lobby animated-div'>
          { Object.keys(game.player_names).map((data,index)=>{
          return <Player user={data}/>
          })}
        </div>
        <div className='gameForm-inner animated-div'><GameForm/></div>
        <div className='gamechat animated-div'><ChatBox/></div>
      </div>

      <div class="lobby-copy animated-div">
        <input value={'RoomCode'} ref={inputRef} type="text"/>
        <button className='lobbycopy-copy-btn' type="submit" onClick={copyToClipboard}>
          Copy
        </button>
      </div>
      
      {/* {(user==game.admin_name)? <button onClick={()=>{startGame()}}>StartGame</button>:<div></div>} */}
      
    </div>
  )
}

export default Lobby