import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import RoomHandler from "./RoomHandler";
import Logout from "./Logout";
import "./Home-Page.css";
import Spinner from "../Spinner";

const Homepage = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/user-auth`
        );
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);



  return (
    <>
      {!ok ? (
          <Spinner/>
      ) : (
        <div className="home-container">
          <h1>Welcome {auth?.user?.name}</h1>
          {/* <Logout/> */}
               <div className='room-handler animated-div'><RoomHandler/></div> 
        </div>
      )}
    </>
  );
};
export default Homepage;
