import React from 'react';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client';

const socket = io.connect('http://localhost:3001');



const RoomHandler = () => {
    const navigate=useNavigate();
    const createPublic= () =>{
        socket.emit("create_pub_room");
        socket.on("room_code", (rm) => {
            console.log(`public room generated code- ${rm}`);
            alert(rm);
          navigate(`/${rm}`);
        })

    };

    const createPrivate= () =>{
        socket.emit("create_pri_room");
        socket.on("room_code", (rm) => {
            console.log(`private room generated code- ${rm}`);
            alert(rm);
          navigate(`/${rm}`);
        })

    };




  
    const[room,setRoom]=useState("");

  return (
    <div>
  <button id="publicButton" onClick={createPublic}>Create Public Room</button>
  <button id="privateButton" onClick={createPrivate}>Create Private Room</button>
    </div>
  )
}

export default RoomHandler