import "./Loginpage.css";
import Home from "../assets/home.svg";
import google from "../assets/google.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase";

export default function Loginpage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/Home", { replace: true });
    } catch (authError) {
      console.error(authError);
      setError("ไม่สามารถสมัครด้วย Google ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="deco deco-house">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
      </div>
      <div className="deco deco-bag">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M8 8V6a4 4 0 018 0v2" />
        </svg>
      </div>
      <div className="deco deco-square">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="4" width="16" height="16" rx="4" />
        </svg>
      </div>
      <div className="deco deco-bag2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M8 8V6a4 4 0 018 0v2" />
        </svg>
      </div>

      <div className="deco deco-circle"></div>
      <div className="deco deco-circle2"></div>

      <div className="main-container-lg">
        <div className="container-login">
          <div className="title-login">
            <img src={Home} alt="Home" />
            <h1>KhongKhun</h1>
            <p>เข้าสู่ระบบตามหาของหาย</p>
          </div>

          <div className="btn-signIn-Up">
            <button className="google" type="button" disabled={loading} onClick={handleGoogleLogin}>
              สมัครด้วย <img src={google} alt="Google" />
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
    </>
  );
}
