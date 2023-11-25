import React, { useContext,useEffect,useState } from 'react';
import GameContext from '../../context/GameContext'
import SocketContext from '../../context/SocketContext'
import { useAuth} from "../../context/auth";
import  './gameForm.css'

function GameForm() {
    const [rounds,setRounds]=useState(1);
    const [duration,setDuration]=useState(30);
    const {game} = useContext(GameContext)
    const {socket} = useContext(SocketContext)
    const [auth,setAuth]=useAuth('');
    const [disabled,setDisabled] = useState("disabled");
    const startGame = () =>{
      socket.emit("start_game",{room : game.roomNo})
      console.log("fired start game")
    }

    useEffect(()=>{
     socket.on("lobby_round_emit",(data)=>{
        setRounds(data);
     }) 
     socket.on("lobby_duration_emit",(data)=>{
        setDuration(data);
     })
    })

    useEffect(()=>{
      socket.emit("lobby_round_emit",rounds);
    },[rounds]);
    
    useEffect(()=>{
      socket.emit("lobby_duration_emit",duration);
    },[duration])

    useEffect(()=>{
      if(auth.user.username===game.admin_name)
      setDisabled("");
    },[game])
 
     // document.getElementById("rounds").disabled = true;

  

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
              {...{disabled}}
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
              {...{disabled}}
            >
              <option>30</option>
              <option>45</option>
              <option>60</option>
              <option>75</option>
              <option>90</option>
            </select>
          </div>
      </form>
      {(disabled!=="disabled")?<button className="gf-start-btn" onClick={()=>{startGame()}}>Start Game</button>:<></>}
    </div> 
    );
}

export default GameForm;
