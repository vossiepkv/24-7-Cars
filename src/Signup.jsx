import { usestate } from "react";
import './styles/Signup.css';

function Signup() {
  return (
<>
<div className="header-text">
  <p>24/7 Cars</p>
</div>

<div className="Signup-Container">
  <form>
    <h2>Sign Up</h2>
    <div className="inputBox">
      <input type="text" required="required"/>
      <span>Username</span>
      <i></i>
    </div>
    <div className="inputBox">
      <input type="email" required="required"/>
      <span>Email</span>
      <i></i>
    </div>
    <div className="inputBox">
      <input type="password" required="required"/>
      <span>Password</span>
      <i></i>
    </div>
    <div className="Links">
      <a href="#">Already Have An Account?</a>
    </div>
    <input type="submit" value="Sign Up" />
  </form>
</div>

</>

  );
}

export default Signup;