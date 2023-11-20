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
import Profile from './component/login/Profile'
import { AuthProvider } from "./context/auth";
import Lobby from './component/Game/Lobby';
import { ToastContainer } from "react-toastify";
import GameContextProvider from './context/GameContextProvider';
import UserContext from './context/UserContext';
import UserContextProvider from './context/UserContextProvider';
import SocketContextProvider from './context/SocketContextProvider';
import GameRoom from './component/Game/GameRoom';
import GameForm from './component/Game/GameForm';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/*",
    element: <GameRoom/>,
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
  },
  {
    path:"/profile",
    element:<Profile/>
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
  <GameContextProvider>  
    <UserContextProvider>
      <SocketContextProvider>
        <RouterProvider router={router}/>
        <ToastContainer/>
      </SocketContextProvider>
    </UserContextProvider> 
 </GameContextProvider>
  </AuthProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
