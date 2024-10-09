import { useState } from "react";
import './styles/Signin.css';

function Signin() {
  return (
    <>
      <div className="header-text">
        <p>24/7 Cars</p>
      </div>

      <div className="Signup-Container">
        <span className="borderLine"></span>
        <form>
          <h2>Sign In</h2>
          <div className="inputBox">
            <input type="text" required="required" />
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input type="password" required="required" />
            <span>Password</span>
            <i></i>
          </div>
          <div className="Links">
            <a href="#">Forgot Password</a>
            <a href="#">Create An Account?</a>
          </div>
          <input type="submit" value="Login" />
        </form>
      </div>
    </>
  );
}

export default Signin;
