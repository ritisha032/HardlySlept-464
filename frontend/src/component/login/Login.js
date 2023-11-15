import React, { useState,useEffect } from "react";

import './Login.css'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth
 } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";


console.log("done");

function Login(){

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [auth,setAuth]=useAuth('');
    const [formValues,setFormValues]=useState({
        email:'',
        password:'',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        console.log(formErrors.email);
        console.log(formErrors.password);
        e.preventDefault();

        setIsSubmit(true);
        setFormErrors(validate(formValues));
    
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

     const handleChange=(e)=>{
        if(e.target.name=='email') setEmail(e.target.value);
        if(e.target.name=='password') setPassword(e.target.password);

        console.log(email+" "+password);
        console.log(formValues);
        setFormValues({...formValues,[e.target.name]:e.target.value});
    };

     const validate=(values)=>{

        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
        errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
        errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
        errors.password = "Password is required";
        } else if (values.password.length < 4) {
        errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
        errors.password = "Password cannot exceed more than 10 characters";
        }

        return errors;
    }

     useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
        console.log(formValues);
        }
    }, [formErrors]);
      
    return (
        <div className="container">

            <pre>{JSON.stringify(formValues,undefined,2)}</pre>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">

                <div className="input">
                    <img src={emailIcon} alt/>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formValues.email}
                        onChange={handleChange} 
                    />
                </div> 
                {formErrors.email!=undefined?<p>{formErrors.email}</p>:null}

                <div className="input">
                    <img src={passwordIcon} alt/>
                    <input 
                        type="password"
                        name="password" 
                        placeholder="Password" 
                        value={formValues.password}
                        onChange={handleChange} 
                    />
                </div> 
                {formErrors.password!=undefined?<p>{formErrors.password}</p>:null}

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