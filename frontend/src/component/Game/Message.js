import React, { useContext } from 'react'
import './Message.css'
import { useAuth} from "../../context/auth";
function Message(props) {
    //message would be populated in chhat
    //message should have a functionality to be clicked and get an option to mute the player 
    //message should be of a format user - message - message by server (1-normal chat , 2- correct message , 3 - Warning for restrictive message)

    var message = props.message;
    const [auth,setAuth]=useAuth(''); 
    var color = (props.index%2==0?"#a1a7b3":"#9ba4b3");
    const check = props.check;
    if(check==1){
        color="green";
        if(auth.user.username==props.user)
        message = "You have guessed the word"
        else
        message = "guessed the word correctly"
    }
    if(check==2){
      color="red";
    }
  return (
    <div class="dropdown" >
      <button class="dropbtn" style={{backgroundColor:`${color}`}}>{props.user}:-{message}</button>
      <div class="dropdown-content">
        <a href="#">Mute</a>
      </div>
    </div>
  )
}

export default Message