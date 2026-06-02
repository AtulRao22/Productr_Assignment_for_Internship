import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import AuthLayout from "./LoginLayout";
import vector from "../assets/Vector.svg";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await API.post("/auth/send-otp", {
        email,
      });

      console.log(response.data);

      localStorage.setItem("email", email);

      navigate("/otp");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout>

      <p>Login to your Productr Account</p>

      <label>Email or Phone number</label>

      <input className="login-input"
        type="text"
        placeholder="Enter email or phone number"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Sending OTP..." : "Login"}
      </button>

      <div className="signup-box">
        <p>Don't have a Productr Account</p>
        <a href="/">SignUp Here</a>
      </div>
    </AuthLayout>
  );
}

export default Login;