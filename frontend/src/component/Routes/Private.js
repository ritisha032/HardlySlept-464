import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false); // State variable to track authentication status
  const [auth, setAuth] = useAuth(); // Custom hook to access authentication information

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/user-auth`); // Making an API request to check user authentication
      if (res.data.ok) {
        setOk(true); // Set ok state to true if authentication is successful
      } else {
        setOk(false); // Set ok state to false if authentication fails
      }
    };

    if (auth?.token) {
      authCheck(); // Call the authentication check function if a token exists
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />; // Render Outlet component if authentication is successful, otherwise render Spinner component
}
