import React, { useState } from "react";
import "./Player.css";

function Player(props) {
  const [isShow, setIsShow] = useState("false");

  const handleKick = () => {
    setIsShow(!isShow);
  };

  return (
    <>
      <div className="player-cont" onClick={handleKick}>
        {props.user}{" "}
        {props.score != undefined ? <div>score-{props.score.score}</div> : ""}
      </div>
      {!isShow ? (
        <div className="player-btn animated-div">
          <button className="kick-btn animated div">Kick</button>
          <button className="mute-btn animated div">Mute</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Player;
