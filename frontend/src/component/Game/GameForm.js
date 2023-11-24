import React, { useContext,useState } from 'react';
import GameContext from '../../context/GameContext'
import SocketContext from '../../context/SocketContext'
import  './gameForm.css'

function GameForm() {
    const [rounds,setRounds]=useState(1);
    const [duration,setDuration]=useState(30);
    const {game} = useContext(GameContext)
    const {socket} = useContext(SocketContext)

    const startGame = () =>{
      socket.emit("start_game",{room : game.roomNo})
      console.log("fired start game")
    }

    return (
      <div className="gf-cont">
        <h1 className='gf-h1'>Game Settings</h1>
        <form  className='gf-form'>
          
          <div className='gf-div'>
            <label className='gf-label'>No of Rounds:</label>
            <select
              id="rounds"
              name="rounds"
              className='gf-select'
              value={rounds}
              onChange={(e) =>setRounds(e.target.value)}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>

          <div className='gf-div'>
            <label className='gf-label'>Round Duration:</label>
            <select
              id="time"
              name="time"
              className='gf-select'
              value={duration}
              onChange={(e) =>setDuration(e.target.value)}
            >
              <option>30</option>
              <option>45</option>
              <option>60</option>
              <option>75</option>
              <option>90</option>
            </select>
          </div>
      </form>
      <button className="gf-start-btn" onClick={()=>{startGame()}}>Start Game</button>
    </div> 
    );
}

export default GameForm;
