import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import AuthLayout from "./LoginLayout";
import vector from "../assets/Vector.svg";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = /^\d{10}$/.test(email);

    if (!email.trim() || (!isValidEmail && !isValidPhone)) {
      setHasError(true);
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/send-otp", {
        email,
      });

      console.log(response.data);

      localStorage.setItem("email", email);
      if (response.data.otp) {
        sessionStorage.setItem("currentOtp", response.data.otp);
      }

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

      <input className={`login-input ${hasError ? "error" : ""}`}
        type="text"
        placeholder="Enter email or phone number"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (hasError) setHasError(false);
        }}
      />

      {hasError && (
        <p className="login-error-text">Enter Valid Email or Phone</p>
      )}

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