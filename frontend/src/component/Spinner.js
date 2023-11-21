import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Spinner = ({path="login"}) => {

  //timer of 5s before redirecting to login page
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    //when count=0 redirect to login page
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location,path]);

  //location and state:location.pathname are used to redirect to the page user wanted to before logging in
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1 className="Text-center">redirecting to you in {count} second </h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;