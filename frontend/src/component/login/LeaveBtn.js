import React, { useEffect } from "react";
import "./LeaveBtn.css";
import GameContext from "../../context/GameContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SocketContext from "../../context/SocketContext";
const LeaveButton = () => {
  const { game, setGame } = useContext(GameContext);
  const { socket, setSocket } = useContext(SocketContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (game == null) {
      navigate("/HomePage");
    }
  }, [game]);

  function backToHomePage() {
    setGame(null);
    socket.disconnect();
  }

  return (
    <div>
      <button
        className="leave-btn"
        onClick={() => {
          backToHomePage();
        }}
      >
        Leave
      </button>
    </div>
  );
};

export default LeaveButton;
