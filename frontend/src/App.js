// import logo from './logo.svg';
import './App.css';
import Login from './component/login/Login.js'
import SignUp from './component/login/SignUp.js'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <div>
              <Login/>
      <SignUp/>
    </div>

  );
}

export default App;
