import React, { useRef } from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
import "./GameResult.css";
import { useNavigate } from "react-router-dom";
import GameContext from "../../context/GameContext";
import SocketContext from "../../context/SocketContext";
import { useContext } from "react";
const GameResult = (props) => {
  const dados = props.score;
  const navigate = useNavigate();
  const { game, setGame } = useContext(GameContext);
  const { socket, setSocket } = useContext(SocketContext);
  return (
    <div className="game-result-container">
      <div className="game-result-topLeadersList">
        {Object.keys(dados).map((leader, index) => (
          <div className="game-result-leader" key={1}>
            {index + 1 <= 3 && (
              <div className="game-result-containerImage">
                <img
                  className="game-result-image"
                  loading="lazy"
                  src="https://cdn-icons-png.flaticon.com/512/186/186037.png"
                />
                <div className="game-result-crown">
                  <svg
                    id="game-result-crown1"
                    fill="#0f74b5"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 50"
                  >
                    <polygon
                      className="game-result-cls-1"
                      points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
                    />
                  </svg>
                </div>
                <div className="game-result-leaderName">{leader}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="game-result-playerslist">
        <div className="game-result-table">
          <div>#</div>
          <div>Name</div>
          <div>Score</div>
        </div>
        <div className="game-result-list">
          {Object.keys(dados).map((leader, index) => (
            <div className="game-result-player" key={1}>
              <span> {index + 1}</span>
              <div className="game-result-user">
                <img
                  className="game-result-image"
                  src="https://cdn-icons-png.flaticon.com/512/186/186037.png"
                />
                <span> {leader} </span>
              </div>
              <span> {dados[leader].score}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="lobby-back-button"
        onClick={() => {
          navigate(`/HomePage`);
          setGame(null);
          socket.disconnect();
        }}
      >
        Back to Lobby
      </button>
    </div>
  );
};

export default GameResult;
// document.getElementById("root"))
