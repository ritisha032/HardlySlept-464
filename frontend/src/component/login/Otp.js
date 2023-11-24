import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DataContext from "../../context/DataContext";
import "./Otp.css";

function Otp() {
  const { data } = useContext(DataContext);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("data= ", data);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/signup`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          username: data.username,
          otp: otp,
        }
      );

      if (response.data.success) {
        toast.success("Signup successful!");
        navigate("/"); // Redirect to the login page after successful signup
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      toast.warning("Error during signup:", error.message);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="otp-cont">
      <h2 className="otp-heading">Enter OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="otp-label">
          <label>OTP:</label>
          <input
            type="text"
            className="otp-input"
            value={otp}
            onChange={handleOtpChange}
          />
        </div>
        <button className="otp-submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Otp;
