import React, { useContext ,useState,useEffect} from 'react'
import './ChatBox.css'
import Message from './Message'
import GameContext from '../../context/GameContext';
import SocketContext from '../../context/SocketContext';
import { useAuth} from "../../context/auth";



function ChatBox(props) {
  const [message,setMessage] = useState("");
  const [messageReceived,setMessageReceived] = useState([]);
  const {game} = useContext(GameContext)
  const {socket} = useContext(SocketContext)
  const [auth,setAuth]=useAuth('');

  const sendMessage = () =>{
    const room = game.roomNo
    socket.emit("send_message",{message,room,user:auth.user.username});
     console.log("send Message");
  }

  useEffect(()=>{
    socket.on("receive_message",(data)=>{
      setMessageReceived(prev=>
       [...prev,data]
      )})
  },[])


  return (
     <div className='chat-container'>

      <div className='chatArea'>
        {messageReceived.map((ele,index)=>
        <Message {...ele} index={index}/>
        )}
      </div >
<div className='send'>
        <input 
          className='chat-msg-field'
          placeholder="Message..." 
          onChange={(event)=>{
          setMessage(event.target.value);
        }}/>

        {(auth.user.username!==game.drawer)?<button className='chatSend-btn' onClick={sendMessage}>Send</button>:<></>}
      </div>:<></>

    </div>
  )
}

export default ChatBox