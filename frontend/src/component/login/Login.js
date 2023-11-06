import React, { useState } from "react";

import './Login.css'
import nameIcon from '../Assets/person.png'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'


console.log( "done");

function Login(){

    const [action,setAction]=useState("Login");

    function LoginHandler(){
        setAction("Login");
    }
    
    function SignUpHandler(){
        setAction("Sign Up");
    }

    return (
        <div className="container">
            {/* <h1>React</h1> */}
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">

               {action=="Login"?<div></div>:<div className="input">
                    <img src={nameIcon} alt/>
                    <input type="text" placeholder="Name" />
                </div> }

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
                <div className={action=="Login"?"submit gray":"submit"} onClick={SignUpHandler}>Sign Up</div>
                <div className={action=="Sign Up"?"submit gray":"submit"} onClick={LoginHandler}>Login</div>
            </div> 
        </div>
    )
}

export default Login;