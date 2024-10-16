import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/Signup.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser as setUserAction } from './slices/userSlice'; // Import setUser from userSlice
import { setToken } from './slices/authSlice'; // Adjust the import path

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://localhost:5001/Signup', { name, email, password });
      console.log("API Response:", result.data); // Log the full response for debugging

      const { user, token } = result.data; // Adjust to the new structure of the response
      
      // Check if user object is defined
      if (user && user._id) {
        dispatch(setUserAction(user)); // Dispatching the user object as payload
      } else {
        console.error("User object is undefined", user);
      }

      // Store token if needed
      dispatch(setToken({ token }));
      localStorage.setItem('token', token);
      navigate('/Signin');
    } catch (err) {
      // Improved error logging to handle cases where err.response might be undefined
      const errorMessage = err.response ? err.response.data.message : err.message;
      console.error("Signup error:", errorMessage);
    }
  };

  return (
    <>
      <div className="header-text">
        <p>24/7 Cars</p>
      </div>

      <div className="Signup-Container">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="inputBox">
            <input 
              type="text" 
              required 
              onChange={(e) => setName(e.target.value)} 
            />
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input 
              type="email" 
              required 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input 
              type="password" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span>Password</span>
            <i></i>
          </div>
          <div className="Links">
            <Link to="/Signin">Already Have An Account?</Link>
          </div>
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    </>
  );
}

export default Signup;
