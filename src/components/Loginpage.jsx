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
  );
}