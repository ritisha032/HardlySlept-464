import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth.js';
import { Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './../Spinner.js';

export default function PrivateRoute({ path, element }) {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/user-auth`);
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

  // Return a Route component with a condition to render either the element or redirect to the login page
  return (
    <Route
      path={path}
      element={ok ? element : <Navigate to="/login" />}
    />
  );
}
