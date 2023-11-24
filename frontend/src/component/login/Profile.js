import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getGames`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Game History:</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
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
  );
};

export default MyComponent;
