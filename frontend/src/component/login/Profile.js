import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";
import LeaveButton from "./LeaveBtn";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    gender: "female",
    dateOfBirth: "2002-01-03",
    contactNumber: 123456789,
    about: "abc",
    image:"",
  });
  const [ishistory, setIsHistory] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  console.log("formData= ", formData);

    if (formData.contactNumber.length > 10)
      toast.warning("Invalid phone number");
    else {
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

        console.log("retrieved user= ",response.data.image);
        setFormData({
          gender: response.data.additionalDetails.gender,
          dateOfBirth: response.data.additionalDetails.dateOfBirth,
          contactNumber: response.data.additionalDetails.contactNumber,
          about: response.data.additionalDetails.about,
          image: response.data.image,
        });
        console.log("formData= ",formData.image);
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

  const handleHistory = () => {
    setIsHistory(!ishistory);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (confirmDelete) {
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/profile/deleteProfile`
        );

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/");
        } else {
          toast.warning(res.data.message);
        }
      } catch (error) {
        toast.warning(error);
      }
    }
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
            <label htmlFor="image">Image:</label>
            <img src={formData.image} alt="Profile" />

            <button type="submit">Update</button>
          </form>
          <button type="submit" onClick={handleDelete}>
            Delete Account
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;
