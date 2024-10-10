import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/Signin.css';
import axios from 'axios';

function Signin() {

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/Signin', { name, password })
        .then(result => { 
            console.log(result);
            // Check if the response data has a message property
            if (result.data && result.data.message === "success") {
                navigate('/home'); // Navigate to /home on success
            } else {
                // Optionally handle the case where the message is not "success"
                console.error("Sign-in failed:", result.data.message);
            }
        })
        .catch(err => {
            console.error("Error during sign-in:", err);
        });
};


  return (
    <>
      <div className="header-text">
        <p>24/7 Cars</p>
      </div>

      <div className="Signup-Container">
        <span className="borderLine"></span>
        <form onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="inputBox">
            <input type="text" required="required" onChange={(e) => setName(e.target.value)}/>
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input type="password" required="required" onChange={(e) => setPassword(e.target.value)}/>
            <span>Password</span>
            <i></i>
          </div>
          <div className="Links">
            <a href="#">Forgot Password</a>
            <Link to="/Signup">Create An Account?</Link>
          </div>
          <input className="login-button" type="submit" value="Login" />
        </form>
      </div>
    </>
  );
}

export default Signin;
