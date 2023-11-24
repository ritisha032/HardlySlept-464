import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import LoginSignUp from "./component/login/Login-SignUp";
import Homepage from "./component/login/HomePage";
import Profile from "./component/login/Profile";
import { AuthProvider } from "./context/auth";
import Lobby from "./component/Game/Lobby";
import { ToastContainer } from "react-toastify";
import GameContextProvider from "./context/GameContextProvider";
import UserContext from "./context/UserContext";
import UserContextProvider from "./context/UserContextProvider";
import SocketContextProvider from "./context/SocketContextProvider";
import GameRoom from "./component/Game/GameRoom";
import GameForm from "./component/Game/GameForm";
import DataContextProvider from "./context/DataContextProvider";

/*const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginSignUp/>,
  },
  {
    path: "/*",
    element: <GameRoom/>,
  },

  {
    path:"/HomePage",
    element:<Homepage/>
  },
  {
    path:"/profile",
    element:<Profile/>
  }
]);*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <DataContextProvider>
      <GameContextProvider>
        <UserContextProvider>
          <SocketContextProvider>
            <App />
            <ToastContainer />
          </SocketContextProvider>
        </UserContextProvider>
      </GameContextProvider>
      </DataContextProvider>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
