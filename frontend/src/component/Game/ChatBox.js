import React from 'react'
import './ChatBox.css'
import Message from './Message'
function ChatBox(props) {
  return (
    <>
    <div className='chatBox'>
    {props.prop.map((ele,index)=>
     <Message {...ele} index={index} username={props.username}/>
    )}
    </div>
    </>
  )
}

export default ChatBox