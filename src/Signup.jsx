import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/Signup.css';
import axios from 'axios';


function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:5001/Signup', {name, email, password})
    .then(result => {
      navigate('/Signin')
    })
    .catch(err=> console.log(err))
  }

  return (
<>
<div className="header-text">
  <p>24/7 Cars</p>
</div>

<div className="Signup-Container">
  <form onSubmit={handleSubmit}>
    <h2>Sign Up</h2>
    <div className="inputBox">
      <input type="text" required="required" onChange={(e) => setName(e.target.value)}/>
      <span>Username</span>
      <i></i>
    </div>
    <div className="inputBox">
      <input type="email" required="required" onChange={(e) => setEmail(e.target.value)}/>
      <span>Email</span>
      <i></i>
    </div>
    <div className="inputBox">
      <input type="password" required="required" onChange={(e) => setPassword(e.target.value)}/>
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