// import logo from './logo.svg';
import './App.css';
import Login from './component/login/Login.js'
import SignUp from './component/login/SignUp.js'
import Homepage from './component/login/HomePage.js';
import {Routes,Route} from "react-router-dom"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/HomePage" element={<Homepage/>}></Route>

    </Routes>
  );
}

export default App;
