import React, { useState } from "react";

import './Login.css'
import nameIcon from '../Assets/person.png'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import { Link } from "react-router-dom";



console.log( "done");

function Login(){

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
                    <input type="email" placeholder="Email" />
                </div> 

                <div className="input">
                    <img src={passwordIcon} alt/>
                    <input type="password" placeholder="Password" />
                </div> 
            </div>
            <div className="submit-cont">
            <Link to="/signup">
                <div className="submit gray">Sign Up</div>
                </Link>
                <div className="submit">Login</div>
                
               
            </div> 
        </div>
    )
}

export default Login;