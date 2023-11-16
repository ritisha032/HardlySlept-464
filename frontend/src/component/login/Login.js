import React, { useState } from "react";

import './Login.css'
import nameIcon from '../Assets/person.png'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth
 } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";


function Login(){

    
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [auth,setAuth]=useAuth('');


    const navigate=useNavigate();
    
    //const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/login`,
            {email,password}
            
          );
    
          if (res && res.data.success) {
                toast.success("Logged in successfully");
                
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token,
          
                  });
                  localStorage.setItem('auth',JSON.stringify(res.data));
        	    navigate("/HomePage");
                
          } else {
            
                alert("not logged in")
          }
        } catch (erorr) {
            toast.warning("Something went wrong");
            
        }
      };
    


    return (
        <div className="container">
            {/* <h1>React</h1> */}
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">

               {/* {action=="Login"?<div></div>:<div className="input">
                    <img src={nameIcon} alt/>
                    <input type="text" placeholder="Name" />
                </div> } */}

                <div className="input">
                    <img src={emailIcon} alt/>
                    <input type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </div> 

                <div className="input">
                    <img src={passwordIcon} alt/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </div> 
            </div>
            <div className="submit-cont">
            <Link to="/signup">
                <div className="submit gray">Sign Up</div>
                </Link>
                <button type="submit" className="submit" onClick={handleSubmit}>Login</button>
                
               
            </div> 
        </div>
    )
}

export default Login;