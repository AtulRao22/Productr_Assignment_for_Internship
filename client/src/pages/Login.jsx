import { useState } from "react";
import vector from "../assets/Vector.svg";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");

  return (
    <div className="login-container">
        <div className="login-left">
            <p>Productr&nbsp;<img src={vector} alt="Vector" /></p>
          <div className="small-card">
            <p>Uplist your </p>
            <span>product to market</span>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form">
            <p>Login to your Productr Account</p>

            <label>Email or Phone number</label>

            <input
              type="text"
              placeholder="Enter email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button>Login</button>

            <div className="signup-box">
              <p>Don't have a Productr Account</p>
              <a href="/">SignUp Here</a>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Login;