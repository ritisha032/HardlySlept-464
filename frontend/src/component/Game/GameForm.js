import React, { useState } from 'react';

import  '../../css/GameForm.css'
function GameForm() {
  // State to store form data
  const [formData, setFormData] = useState({
    numberOfRounds: 1,
    time: ''
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add any additional logic for form submission here
  };

  // Function to handle changes in form fields
  const handleChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  return (
    <div className="App">
      <h1>Game Settings</h1>
      <form onSubmit={handleSubmit}>
        {/* No of Rounds Component */}
        <div>
          <label htmlFor="rounds">No of Rounds:</label>
          <select
            id="rounds"
            name="rounds"
            value={formData.numberOfRounds}
            onChange={(e) => handleChange('numberOfRounds', e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>

        {/* Time Component */}
        <div>
          <label htmlFor="time">Time:</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
          >
            {[30, 45, 60, 90].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default GameForm;
