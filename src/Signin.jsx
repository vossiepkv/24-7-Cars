import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice'; // Adjust the import path
import { setToken } from './slices/authSlice'; // Adjust the import path
import axios from 'axios';
import './styles/Signin.css';


function Signin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [bannerMessage, setBannerMessage] = useState(''); // Manage banner message
  const [bannerClass, setBannerClass] = useState('hidden'); // Manage banner visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showBanner = (message, isSuccess = false) => {
    setBannerMessage(message);
    setBannerClass(isSuccess ? 'visible banner-success' : 'visible banner-error');

    // Hide the banner after 3 seconds
    setTimeout(() => setBannerClass('hidden'), 3000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await axios.post('https://two4-7-cars.onrender.com/Signin', { name, password });
    console.log(result.data); // Log the response to inspect its structure

    if (result.data && result.data.message === "success") {
      const { token, user } = result.data;

      // Check if the user object is present
      if (user) {
        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Dispatch actions to update the Redux store
        dispatch(setToken({token}));
        dispatch(setUser({
          userId: user._id || '',  
          username: user.name || '', 
          email: user.email || '', 
        }));

        showBanner('Login Successfull!', true);

        // Redirect the user to the home page
        navigate('/home');
      } else {
        // Handle the case where user is undefined
        console.error("User data is not present in the response");
        setErrorMessage("User data is not available. Please try again.");
        showBanner('User data is not available. Please try again.');
      }
    } else {
      console.error("Sign-in failed:", result.data.message);
      setErrorMessage("Sign-in failed: " + result.data.message);
      showBanner(`Sign-in failed: ${result.data.message}`);
    }
  } catch (err) {
    console.error("Error during sign-in:", err);
    setErrorMessage("An error occurred during sign-in. Please try again.");
    showBanner('An error occurred during sign-in. Please try again.');
  }
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
          {errorMessage && <div className="error-message">{errorMessage}</div>} 
          <div className="inputBox">
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
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
      <div id="banner" className="hidden"></div>
    </>
  );
}

export default Signin;
