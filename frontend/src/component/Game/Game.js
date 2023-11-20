import io from 'socket.io-client'
import {useContext, useEffect,useState} from "react"
import Message from './Message';
import ChatBox from './ChatBox';
import Timer from './Timer';
import SocketContext from '../../context/SocketContext';
import GameContext from '../../context/GameContext';
import DrawingCanvas from '../Game/DrawingCanvas.js'



function Game() {
  const [secondsLeft,setSecondsLeft] = useState(30);
  //const [buttonStatus,setButtonStatus] = useState("disabled");
  const [option,setOption] = useState([]);
  const {socket} = useContext(SocketContext);
  const {game} = useContext(GameContext);
  const [hint,setHint] = useState("");

   function sendChosenWord(word){
    socket.emit("word_chosen",{word:word});
    setOption([]);
    //setButtonStatus("disabled");
    console.log(word);
    console.log("sendChosenWord");
    }
  
  useEffect(()=>{
    console.log("useEffect")
    setHint(game.hint);

    socket.on("timer_change",(data)=>{
      setSecondsLeft(data);
      console.log("time_change");
    })
    socket.on("feedback",(data)=>{
      console.log(data);
    })
    socket.on("send_options",(data)=>{
      setOption(data);
      console.log(data);
      console.log("option word received");
    })
    socket.on("send_hint",(data)=>{
        setHint(data);
    })
  },[])

  return (
    <div >
    {
      (option.length!=0)?option.map((data,index)=>{
       return <button onClick={()=>{sendChosenWord(data)}}>{data}</button>
      }):<div></div>
    }
    <ChatBox />
    <Timer time={secondsLeft}/>
    <div>{hint}</div>
    <DrawingCanvas/>
    </div>
    
  );
}

export default Game;