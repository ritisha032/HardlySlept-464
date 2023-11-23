import {useContext, useEffect,useState} from "react"
import ChatBox from './ChatBox';
import Timer from './Timer';
import SocketContext from '../../context/SocketContext';
import GameContext from '../../context/GameContext';
import DrawingCanvas from '../Game/DrawingCanvas.js'
import Logout from '../login/Logout'
import { useAuth } from '../../context/auth';
import './Game.css'


function Game() {
  const [secondsLeft,setSecondsLeft] = useState(30);
  //const [buttonStatus,setButtonStatus] = useState("disabled");
  const [option,setOption] = useState([]);
  const [drawer,setDrawer] = useState("");
  const {socket} = useContext(SocketContext);
  const {game} = useContext(GameContext);
  const [hint,setHint] = useState("");
  const [auth,setAuth] = useAuth();
  const [phase,setPhase] = useState("");
  const [score,setScore] = useState([]);

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
    })
  },[])

  return (
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
          <div className='game-leaderboard animated-div '>leaderboard</div>
          <DrawingCanvas className='game-drawCanvas animated-div' true={(drawer==auth.user.username)}/>
          <div className='animated-div'><ChatBox className='game-chat' true={(drawer!=auth.user.username)} /></div>
      </div>
      
    </div>
    
  );
}

export default Game;