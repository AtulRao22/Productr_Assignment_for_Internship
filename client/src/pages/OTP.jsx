import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";
import AuthLayout from "./LoginLayout";
import "./OTP.css";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentOtp, setCurrentOtp] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOtp = sessionStorage.getItem("currentOtp");
    if (savedOtp) {
      setCurrentOtp(savedOtp);
    }
  }, []);

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

      sessionStorage.removeItem("currentOtp");
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

      const response = await API.post("/auth/send-otp", {
        email,
      });

      if (response.data.otp) {
        sessionStorage.setItem("currentOtp", response.data.otp);
        setCurrentOtp(response.data.otp);
      }

      setToast({ message: "OTP resent Successfully" });
      setTimer(30);
      setHasError(false);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to resend OTP"
      });
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

      {currentOtp && timer > 0 && (
        <div className="otp-inline-toast">
          <span className="otp-inline-message">
            <h4>😅 F12 wasn't invited today.</h4>
            Life is short.Deadlines are shorter.<br></br>
            <strong>OTP: {currentOtp}</strong>
          </span>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </AuthLayout>
  );
}

export default OTP;