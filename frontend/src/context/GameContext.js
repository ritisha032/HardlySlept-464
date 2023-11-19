import {useState,useEffect,useContext,createContext} from "react";
import axios from "axios";
const GameContext=createContext();
const GameProvider= ({children}) =>{
    const[game,setGame]=useState({
        game:""
    });

    //refresh hone ke baad bi rhega issee
    //set headers///if auth exists then get token
    //axios.defaults.headers.common["Authorization"] = auth?.token;
    useEffect(() => {
      const data = localStorage.getItem("game");
      if (data) {
        const parseData = JSON.parse(data);
        console.log("i am in game context");
        console.log(parseData);
        setGame({
            parseData
        });
      }
      //eslint-disable-next-line
    }, []);}
export default GameContext;