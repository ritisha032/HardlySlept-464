import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import LeaveButton from "./LeaveBtn";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [ishistory, setIsHistory] = useState("true");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getGames`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleHistory = () => {
    setIsHistory(!ishistory);
  };

  return (
    <div className="profile-main-cont">
      <button className="profile-btn" onClick={handleHistory}>
        {ishistory ? "Player Profile" : "Player History"}
      </button>

      {ishistory ? (
        <div className=" profile-body animated-div">
          <div className="profile-card">
            <h1 className="history-heading">Game History:</h1>
            <ul className="history-cont">
              {data.map((item, index) => (
                <li key={index} className="history-card">
                  <p>
                    <strong>ROUND</strong>
                  </p>
                  <p>Date: {item.date}</p>
                  <p>Participants: {item.no_participants}</p>
                  <p>Rank: {item.rank}</p>
                  <p>Score: {item.score}</p>
                  <p>Guesses Made: {item.no_guesses_made}</p>
                  <p>Rounds: {item.no_rounds}</p>
                  {/* Add more fields as needed */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="profile-body animated-div">
            <div class="profile-card">
              <div class="profile-photo-container">
                <svg viewBox="0 0 220 220">
                  <circle
                    shape-rendering="geometricPrecision"
                    class="indicator"
                    cx="110"
                    cy="110"
                    r="96"
                  />
                </svg>
                <div class="profile-img-box">
                  <img
                    className="profile-img"
                    src="https://community.aseprite.org/uploads/default/original/2X/d/d139873489b95dbf0f22a9e75b403ce75393ca80.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="profile-h3">User Name</h3>
              <span className="profile-span">beginner</span>
              <div class="profile-box-container">
                <div class="profile-box">
                  <div>Total Game Played:25</div>
                </div>
                <div class="profile-box">
                  <div>Total Win:17</div>
                </div>
              </div>
              <div className="profile-leaveBtn">
                <LeaveButton />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyComponent;
