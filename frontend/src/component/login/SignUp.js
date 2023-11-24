import React, { useState, useEffect,useContext } from "react";

import "./Login-SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DataContext from "../../context/DataContext";


function SignUp() {
  function generateUniqueUsername(username) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const uniqueUsername = `${username}` + "_" + `${randomDigits}`;
    return uniqueUsername;
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [username, setUsername] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { data, setData } = useContext(DataContext);
  useEffect(() => {
    console.log("data= ", data);
  }, [data]);


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));

    if (Object.keys(formErrors).length === 0) {
      const signUpData={
        name:formValues.name,
        email:formValues.email,
        password:formValues.password,
        confirmPassword:formValues.confirmPassword,
        username:formValues.username,
      }
      //console.log("signUpData= ",signUpData);
      try {
        //console.log("formValues= ",formValues);
        setData(signUpData);
    
        const res=await axios.post(`${process.env.REACT_APP_API}/api/v1/sendotp`,
        { email});
        //console.log("otp status= ",res.data.success);
        //console.log("data= ",data);

        if(res.data.success)
        {
          toast.success(res.data.message);

          navigate("/otp");
        }
        else
        {
          toast.warning(res.data.message);
        }

        /*if (res && res.data.success) {
          toast.success("registered successfully");
          navigate("/");
        } else {
          toast.warning(res.data.message);
          if (res.data.message === "Username already registered") {
            toast.success(generateUniqueUsername(username) + " is available");

            //console.log(generateUniqueUsername(username));
          }
        }*/
      } catch (error) {
        toast.warning(error);
      }
    }
  };

  
  const handleChange = (e) => {
    if (e.target.name == "name") setName(e.target.value);
    if (e.target.name == "email") setEmail(e.target.value);
    if (e.target.name == "password") setPassword(e.target.value);
    if (e.target.name == "confirmPassword") setPassword1(e.target.value);
    if (e.target.name == "username") setUsername(e.target.value);

    console.log(name + " " + email + " " + password + " " + password1);
    // console.log(formValues);
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
      errors.username = "Username is required!";
    }
    if (!values.name) {
      errors.name = "Name is required!";
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
      errors.confirmPassword = "Password cannot exceed more than 10 characters";
    } else if (values.confirmPassword != values.password) {
      errors.confirmPassword = "Password Don't Match";
    }

    return errors;
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(formValues,undefined,2)}</pre> */}
      <div class="title">Sign up</div>
      <form class="flip-card__form" action="">
        <input
          class="flip-card__input"
          placeholder="Name"
          name="name"
          type="text"
          onChange={handleChange}
          value={formValues.name}
          required
        />
        {formErrors.name != undefined ? <p>{formErrors.name}</p> : null}

        <input
          class="flip-card__input"
          placeholder="Userame"
          name="username"
          type="text"
          onChange={handleChange}
          value={formValues.username}
          required
        />
        {formErrors.username != undefined ? <p>{formErrors.username}</p> : null}

        <input
          class="flip-card__input"
          name="email"
          placeholder="Email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
        />
        {formErrors.email != undefined ? <p>{formErrors.email}</p> : null}

        <input
          class="flip-card__input"
          name="password"
          placeholder="Password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
        />
        {formErrors.password != undefined ? <p>{formErrors.password}</p> : null}

        <input
          class="flip-card__input"
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          value={formValues.confirmPassword}
          onChange={handleChange}
        />
        {formErrors.confirmPassword != undefined ? (
          <p>{formErrors.confirmPassword}</p>
        ) : null}

        <button class="flip-card__btn" onClick={handleSubmit}>
          Confirm!
        </button>
      </form>
    </div>
  );
}

export default SignUp;
