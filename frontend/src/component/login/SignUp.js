import React, { useState } from "react";

import './SignUp.css'
import nameIcon from '../Assets/person.png'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


console.log( "done");

function SignUp(){

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[password1,setPassword1]=useState("");

    const navigate=useNavigate();
    
    //const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {

          if(password!=password1)
          {
            alert("passwords do not match");
            setPassword("");
            setPassword1("");
          }
          const res = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/signup`,
            {name,email,password,password1}
          );

          if(res.message=="passwords do not match")
              alert("passwords do not match");
          if (res && res.data.success) {
                  alert("registered successfully");
                  navigate("/login");
          } else {
                alert("not registered")
          }
        } catch (erorr) {
            alert("Something Went Wrong");
        }
      };
    


    return (
        <div className="container">
            {/* <h1>React</h1> */}
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">

               <div className="input">
                    <img src={nameIcon} alt="b"/>
                    <input type="text" placeholder="Name"  value={name}
              onChange={(e) => setName(e.target.value)}/>
                </div>

                <div className="input">
                    <img src={emailIcon} alt="b"/>
                    <input type="email" placeholder="Email"  value={email}
              onChange={(e) => setEmail(e.target.value)}/>
                </div> 

                <div className="input">
                    <img src={passwordIcon} alt="b"/>
                    <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}/>
                </div> 

                <div className="input">
                    <img src={passwordIcon} alt="b"/>
                    <input type="password" placeholder="Confirm Password" value={password1}
              onChange={(e) => setPassword1(e.target.value)}/>
                </div> 

            </div>
            <div className="submit-cont">
                <button type="submit" className="submit" onClick={handleSubmit}>Sign Up</button>
                <Link to="/login">
                <button className="submit gray">Login</button>
                </Link>
               
            </div> 
        </div>
    )
}

export default SignUp;