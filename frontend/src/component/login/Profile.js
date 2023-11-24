import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    about: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   //  console.log("formData= ", formData);

   if(formData.contactNumber.length>10)
      toast.warning("Invalid phone number");
    else{
      const res = await axios
      .put(
        `${process.env.REACT_APP_API}/api/v1/profile/updateProfile`,
        formData
      )
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });

    }

  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/get-user`
        );

        //console.log("retrieved user= ",response.data.additionalDetails.contactNumber);
        setFormData({
          gender: response.data.additionalDetails.gender,
          dateOfBirth:response.data.additionalDetails.dateOfBirth,
          contactNumber:response.data.additionalDetails.contactNumber,
          about:response.data.additionalDetails.about,
      

        })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUser();
  }, []);

  const navigate = useNavigate();
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            onChange={handleChange}
            value={formData.gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            onChange={handleChange}
            value={formData.dateOfBirth}
          />
        </div>
        <div>
          <label htmlFor="contactNumber">Phone Number:</label>
          <input
            type="number"
            id="contactNumber"
            name="contactNumber"
            pattern="[0-9]{10}"
            onChange={handleChange}
            value={formData.contactNumber}
          />
        </div>
        <div>
          <label htmlFor="about">About:</label>
          <textarea
            id="about"
            name="about"
            onChange={handleChange}
            value={formData.about}
          />
        </div>
        <button type="submit">Update</button>
      </form>

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

      <button
        onClick={() => {
          navigate("/HomePage");
        }}
      >
        HomePage
      </button>
      <Logout />
    </div>
  );
};

export default MyComponent;
