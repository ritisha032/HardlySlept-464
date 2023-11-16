import React, { useState } from "react";

import "./SignUp.css";
import nameIcon from "../Assets/person.png";
import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/password.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [username, setUserName] = useState("");

  const navigate = useNavigate();

  //const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !username) {
      toast.warning("Please fill out all fields");
    }
    if (password != password1) {
      toast.warning("Passwords don't match");
      setPassword("");
      setPassword1("");
    } else {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/signup`,
          { name, email, username,password,password1}
        );

        console.log(res);
        if (res && res.data.success) {
          toast.success("registered successfully");
          navigate("/login");
        } else {
          toast.warning(res.data.message);
        }
      } catch (error) {
        toast.warning(error);
      }
    }
  };

  return (
    <div className="container">
      {/* <h1>React</h1> */}
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={nameIcon} alt="b" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input">
          <img src={emailIcon} alt="b" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input">
          <img src={nameIcon} alt="b" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="input">
          <img src={passwordIcon} alt="b" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input">
          <img src={passwordIcon} alt="b" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="submit-cont">
        <button type="submit" className="submit" onClick={handleSubmit}>
          Sign Up
        </button>
        <Link to="/login">
          <button className="submit gray">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
