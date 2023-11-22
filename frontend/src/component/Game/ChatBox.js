import React, { useContext ,useState,useEffect} from 'react'
import './ChatBox.css'
import Message from './Message'
import UserContext from '../../context/UserContext';
import GameContext from '../../context/GameContext';
import SocketContext from '../../context/SocketContext';



function ChatBox() {
  const [message,setMessage] = useState("");
  const [messageReceived,setMessageReceived] = useState([]);
  const {user} = useContext(UserContext);
  const {game} = useContext(GameContext)
  const {socket} = useContext(SocketContext)
  
  const sendMessage = () =>{
    const room = game.roomNo
    socket.emit("send_message",{message,room,user});
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

      <div className='chatBox'>

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

        <button className='chatSend-btn' onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatBox