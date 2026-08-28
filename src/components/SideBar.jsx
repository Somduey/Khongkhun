import "./SideBar.css";
import Home from "../assets/home.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logOut } from "../services/firebase.js";
import cog from "../assets/cog.svg";

export default function SideBar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showPost,setshowPost] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await logOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign out failed", err);
      alert("ออกจากระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  function toggleValue(){
    setShow(!show)
  }

  function showPostitem(){
    setshowPost(!showPost)
  }

  return (
    <aside className="maincontainer-sideL">
      <div className="title-sideL">
        <img src={Home} alt="Home" />
        <div>
          <h1>KhongKhun</h1>
          <p>SSP Lost & Found</p>
        </div>
      </div>
      <div className="menu-container">
        <p>เมนูหลัก</p>
        <ul>
          <li className="menu" onClick={showPostitem}>โพสต์</li>
        </ul>
      </div>
      <button className="option" onClick={toggleValue}>
        <img src={cog} alt="" />
      </button>

      {/* เพิ่มเติม */}
      {show && (
        <div className="sign-out-Ac">
          <button type="button" onClick={handleSignOut} disabled={loading}>
            {loading ? "กำลังออก..." : "ออกจากระบบ"}
          </button>
        </div>
      )}
      
      {showPost && (
        <div className="post">
          <h1 className="headText">โพสต์ของหาย</h1>
        </div>
      )}
    </aside>
  );
}
