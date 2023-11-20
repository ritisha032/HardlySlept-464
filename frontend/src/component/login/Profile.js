import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import {toast} from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate=useNavigate();
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  


//get user data
useEffect(() => {
  const {name,username,email} = auth?.user;
  setName(name);
  setUsername(username);
  setEmail(email);
}, [auth?.user]);
  
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    navigate("/HomePage");
  };
  return (
    <div title={"Your Profile"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            
          </div>
          <div className="col-md-9">
            <div className="form-container ">
              <form onSubmit={handleSubmit}>
                <h4 className="title">USER PROFILE</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Name"
                    autoFocus disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Email "
                    disabled
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                     disabled
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  HOME
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;