import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import AuthLayout from "./LoginLayout";
import "./OTP.css";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(50);
  const [resending, setResending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    // Reset error when user starts typing
    if (hasError) setHasError(false);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setHasError(true);
      return;
    }

    try {
      const email = localStorage.getItem("email");

      await API.post("/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });

      navigate("/home");
    } catch (error) {
      setHasError(true);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;

    try {
      setResending(true);
      const email = localStorage.getItem("email");

      await API.post("/auth/send-otp", {
        email,
      });

      alert("OTP resent successfully!");
      setTimer(50);
      setHasError(false); // Reset error on resend
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <p>Login to your Productr Account</p>

      <label>Enter OTP</label>

      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            className={`otp-input ${hasError ? "error" : ""}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
          />
        ))}
      </div>

      {hasError && (
        <p className="otp-error-text">Please enter a valid otp</p>
      )}

      <button onClick={handleVerify}>
        Enter your OTP
      </button>

      <p className="resend">
        Didn't receive OTP ?
        {timer > 0 ? (
          <span className="resend-disabled"> Resend in {timer}s</span>
        ) : (
          <span className="resend-active" onClick={handleResend}>
            {resending ? " Resending..." : " Resend"}
          </span>
        )}
      </p>
    </AuthLayout>
  );
}

export default OTP;