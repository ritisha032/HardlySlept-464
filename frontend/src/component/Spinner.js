import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Spinner.css";
const Spinner = ({ path = "login" }) => {
  //timer of 5s before redirecting to login page
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    //when count=0 redirect to login page
    count === 0 && navigate(`/`);
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  //location and state:location.pathname are used to redirect to the page user wanted to before logging in
  return (
    <div class="spinner"></div>

  );
};

export default Spinner;
