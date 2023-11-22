import React from 'react'
import Logout from '../login/Logout'
import { useContext,useRef } from 'react'
import GameContext from '../../context/GameContext'
import Player from './Player'
import SocketContext from '../../context/SocketContext'
import ChatBox from './ChatBox'
import GameForm from './GameForm'
import { useAuth} from "../../context/auth";
import './Lobby.css'

const Lobby = () => {
  const {game} = useContext(GameContext)
  const {socket} = useContext(SocketContext)
  const [auth,setAuth]=useAuth('');
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
          alert('Copied to clipboard: ' + inputRef.current.value);
        } catch (err) {
          console.error('Unable to copy to clipboard', err);
        }
      }
    };

  return (
   <div className='lobby-cont'>
      <div className='lobby-header animated-div'>
        <h1>{game.type} Room</h1>
        <div className='lobby-logout'><Logout/></div>
      </div>

      <div className='lobby-components'>
        <div className='lobby animated-div'>
          { Object.keys(game.player_names).map((data,index)=>{
            if(game.player_names[data].active==true)
              return <Player user={data}/>
          })}
        </div>
        <div className='gameForm animated-div'><GameForm/></div>
        <div className='animated-div'><ChatBox/></div>
      </div>

      <div class="lobby-copy animated-div">
        <input value={'RoomCode'} ref={inputRef} type="text"/>
        <button className='lobbycopy-copy-btn' type="submit" onClick={copyToClipboard}>Copy</button>
      </div>
      
      {(auth.user.username==game.admin_name)? <button onClick={()=>{startGame()}}>StartGame</button>:<div></div>}
      
    </div>
  )
}

export default Lobby