import React, { useState } from "react";

import './SignUp.css'
import nameIcon from '../Assets/person.png'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import { Link } from "react-router-dom";

console.log( "done");

function SignUp(){

    // const [action,setAction]=useState("Login");

    // function LoginHandler(){
    //     setAction("Login");
    // }
    
    // function SignUpHandler(){
    //     setAction("Sign Up");
    // }

    return (
        <div className="container">
            {/* <h1>React</h1> */}
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">

               <div className="input">
                    <img src={nameIcon} alt/>
                    <input type="text" placeholder="Name" />
                </div>

                <div className="input">
                    <img src={emailIcon} alt/>
                    <input type="email" placeholder="Email" />
                </div> 

                <div className="input">
                    <img src={passwordIcon} alt/>
                    <input type="password" placeholder="Password" />
                </div> 
            </div>
            <div className="submit-cont">
                <div className="submit" >Sign Up</div>
                <Link to="/login">
                <div className="submit gray">Login</div>
                </Link>
               
            </div> 
        </div>
    )
}

export default SignUp;