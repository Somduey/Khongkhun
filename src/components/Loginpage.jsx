import "./Loginpage.css";
import Home from "../assets/home.svg";
import google from "../assets/google.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase";

const isInAppBrowser = () =>
  /FBAN|FBAV|Instagram|Line|TikTok|Bytedance/i.test(navigator.userAgent);

export default function Loginpage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInAppBrowserNotice, setShowInAppBrowserNotice] =
    useState(isInAppBrowser);
  const [copyStatus, setCopyStatus] = useState("");
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("คัดลอกลิงก์แล้ว");
    } catch (clipboardError) {
      console.error("Could not copy the login link", clipboardError);
      setCopyStatus("ไม่สามารถคัดลอกลิงก์ได้ กรุณาคัดลอกจากแถบที่อยู่");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/Home", { replace: true });
    } catch (authError) {
      console.error(authError);
      setError("ไม่สามารถสมัครด้วย Google ได้");
      if (isInAppBrowser()) {
        setShowInAppBrowserNotice(true);
      }
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

      {showInAppBrowserNotice && (
        <div className="in-app-browser-notice-backdrop">
          <section
            className="in-app-browser-notice"
            role="dialog"
            aria-modal="true"
            aria-labelledby="in-app-browser-notice-title"
          >
            <h2 id="in-app-browser-notice-title">
              โปรดเปิดในเบราว์เซอร์
            </h2>
            <p>
              การเข้าสู่ระบบ Google อาจใช้ไม่ได้เมื่อเปิดจากแอปนี้
              กรุณาเปิดลิงก์ใน Chrome (Android) หรือ Safari (iPhone) ก่อนดำเนินการต่อ
            </p>
            <button type="button" onClick={handleCopyLink}>
              คัดลอกลิงก์
            </button>
            {copyStatus && <p className="copy-status" role="status">{copyStatus}</p>}
            <button
              type="button"
              className="in-app-browser-notice-dismiss"
              onClick={() => setShowInAppBrowserNotice(false)}
            >
              ดำเนินการต่อในหน้านี้
            </button>
          </section>
        </div>
      )}
    </>
  );
}
