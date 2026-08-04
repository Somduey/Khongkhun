import "./Loginpage.css";
import Home from "../assets/home.svg";
import { Show, SignInButton, SignUpButton, useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";

export default function Loginpage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // กันกระพริบระหว่างเช็คสถานะ

  if (isSignedIn) {
    return <Navigate to="/test" replace />;
  }

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
          <div className="signIn-Up">
            <Show when="signed-out">
              <SignInButton asChild forceRedirectUrl="/test">
                <button className="login-btn">เข้าสู่ระบบ</button>
              </SignInButton>
              <SignUpButton asChild forceRedirectUrl="/test">
                <button className="signup-btn">สมัครสมาชิก</button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </div>
    </>
  );
}
