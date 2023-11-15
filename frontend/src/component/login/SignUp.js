import React, { useState,useEffect } from "react";

import "./SignUp.css";
import nameIcon from "../Assets/person.png";
import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/password.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

console.log("done");

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [formValues,setFormValues]=useState({
        username:"",
        email:"",
        password:"" ,
        confirmPassword:""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    console.log("yes");
    e.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));

    if (password != password1) {
      alert("passwords do not match");
      setPassword("");
      setPassword1("");
    } else {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/signup`,
          { name, email, password, password1 }
        );

        if (res.message == "passwords do not match")
          alert("passwords do not match");
        if (res && res.data.success) {
          alert("registered successfully");
          navigate("/login");
        } else {
          alert("not registered");
        }
      } catch (erorr) {
        alert("Something Went Wrong");
      }
    }
  };

  const handleChange=(e)=>{
      if(e.target.name=='username') setName(e.target.value);
      if(e.target.name=='email') setEmail(e.target.value);
      if(e.target.name=='password') setPassword(e.target.value);
      if(e.target.name=='confirmPassword') setPassword1(e.target.value);

      console.log(name+" "+email+" "+password+" "+password1);
      console.log(formValues);
      setFormValues({...formValues,[e.target.name]:e.target.value});
  };

     useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
        console.log(formValues);
        }
    }, [formErrors]);

    const validate=(values)=>{

    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
    errors.username = "Name is required!";
    }
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

    if (!values.confirmPassword) {
    errors.confirmPassword = "Password is required";
    } else if (values.confirmPassword.length < 4) {
    errors.confirmPassword = "Password must be more than 4 characters";
    } else if (values.confirmPassword.length > 10) {
    errors.confirmPassword= "Password cannot exceed more than 10 characters";
    }
    else if(values.confirmPassword!=values.password){
        errors.confirmPassword="Password Didn't Match"
    }

    return errors;
}

  return (
    <div className="container">
      <pre>{JSON.stringify(formValues,undefined,2)}</pre>
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={nameIcon} alt="b" />
          <input
            type="text" 
            name="username"
            placeholder="Name" 
            onChange={handleChange}
            value={formValues.username}
          />
        </div>
        {formErrors.username!=undefined?<p>{formErrors.username}</p>:null}

        <div className="input">
          <img src={emailIcon} alt="b" />
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
          <img src={passwordIcon} alt="b" />
          <input
            type="password" 
            name="password"
            placeholder="Password" 
            value={formValues.password} 
            onChange={handleChange}
          />
        </div>
        {formErrors.password!=undefined?<p>{formErrors.password}</p>:null}

        <div className="input">
          <img src={passwordIcon} alt="b" />
          <input
            type="password"
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={formValues.confirmPassword} 
            onChange={handleChange}
          />
        </div>
        {formErrors.confirmPassword!=undefined?<p>{formErrors.confirmPassword}</p>:null}
      </div>
      <div className="submit-cont">
        <button type="submit" className="submit" onClick={handleSubmit}>
          Sign Up
        </button>
        <Link to="/login">
          <button className="submit gray">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
