import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from './component/login/Login';
import SignUp from './component/login/SignUp';
import Homepage from './component/login/HomePage';
import { AuthProvider } from "./context/auth";
import Lobby from './component/Game/Lobby';
import { ToastContainer } from "react-toastify";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/*",
    element: <Lobby/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },

  {
    path:"/HomePage",
    element:<Homepage/>
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
        
    <RouterProvider router={router}/>
    <ToastContainer/>
  
  </AuthProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
