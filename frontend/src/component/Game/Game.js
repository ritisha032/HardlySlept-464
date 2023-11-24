import {useContext, useEffect,useState} from "react"
import ChatBox from './ChatBox';
import Timer from './Timer';
import SocketContext from '../../context/SocketContext';
import GameContext from '../../context/GameContext';
import Player from './Player'
import GameResult from './GameResult.js'
import DrawingCanvas from '../Game/DrawingCanvas.js'
import Logout from '../login/Logout'
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import './Game.css'
import RoundResult from "./RoundResult.js";
var i=0;

function Game() {
  const [secondsLeft,setSecondsLeft] = useState(30);
  const navigate=useNavigate();
  //const [buttonStatus,setButtonStatus] = useState("disabled");
  const [option,setOption] = useState([]);
  const [drawer,setDrawer] = useState("");
  const {socket,setSocket} = useContext(SocketContext);
  const {game,setGame} = useContext(GameContext);
  const [hint,setHint] = useState("");
  const [auth,setAuth] = useAuth();
  const [phase,setPhase] = useState("");
  const [score,setScore] = useState(null);
  const [displayScore,setDisplayScore] = useState(false);

   function sendChosenWord(word){
    socket.emit("word_chosen",{word:word});
    console.log(word);
    console.log("sendChosenWord");
    }
  
    useEffect(()=>{
      if(score!=null){
        console.log(score);
      }
    },[score])
  
  useEffect(()=>{
    console.log("useEffect")
    setHint(game.hint);
    setDrawer(game.drawer);
    setPhase(game.phase);
    setScore(game.player_names);
    socket.on("timer_change",(data)=>{
      setSecondsLeft(data);
      console.log("time_change");
    })
    socket.on("feedback",(data)=>{
      console.log(data);
    })
    socket.on("phase_change",(data)=>{
      setPhase(data);
      console.log(data);
    })
    socket.on("drawer_change",(data)=>{
      setDrawer(data.drawer);
      //Highlight the drawer in the leaderboard
      if(data.drawer==auth.user.username){
        setOption(data.options)
      }
    })
    socket.on("send_hint",(data)=>{
        setHint(data);
    })
    socket.on("score",(data)=>{
      setScore(data);
      setDisplayScore(true);
      setTimeout(()=>setDisplayScore(false),5000);
    })
  },[])

  return (
    <div>
    <div className='game-cont'>

      <div className='game-header animated-div'>

          <div className='game-timer'><Timer time={secondsLeft}/></div>
          <div className='game-words'>
            {
                (option.length!=0)?option.map((data,index)=>{
                return <button onClick={()=>{sendChosenWord(data)}}>{data}</button>
                }):<div></div>
            }
          </div>
          <div className='game-hint'>{hint}</div>
          <div className='game-logout'><Logout/></div>
      </div>

      <div className='game-component'>
          <div className='game-leaderboard animated-div'>
            {(score!=null)? Object.keys(game.player_names).map((data,index)=>{
              if(score[data].active==true)
            return <Player user={data} score={score[data]}/>
            }):<></>}
          </div>
          <div className='game-drawCanvas animated-div'><DrawingCanvas/></div>
          <div className='game-chat animated-div'><ChatBox/></div>
      </div>
      
    </div>
    {/* {
     (displayScore==true)?<div className="game-result animated-div">
      <h3 className="result-heading">Final Score</h3>
      <GameResult score={score}/>
    </div>:<></>
    } */}
    {
      (displayScore==true)?<div className="round-result">
      <h3 className='result-heading'>ScoreCard</h3>
      <RoundResult score={score}/>
      </div>:<></>
   }
    </div>
  );
}

export default Game;