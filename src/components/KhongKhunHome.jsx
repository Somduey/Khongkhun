import SideBar from "./SideBar.jsx";
import List from "./List.jsx";
import "./KhongKhunHome.css";
import { useState } from "react";
import MenuIcon from "../assets/list.svg";

export default function KhongKhunHome() {
  const [postVersion, setPostVersion] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPost, setShowPost] = useState(false);

  return (
    <div className="maincontainer-Khongkhun">
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => {
          setSidebarOpen((isOpen) => !isOpen);
          setShowPost(false);
        }}
        aria-label={sidebarOpen ? "ปิดเมนู" : "เปิดเมนู"}
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
      >
        <img src={MenuIcon} alt="" />
      </button>
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="ปิดเมนู"
        />
      )}
      <div className={`sideBarMain ${sidebarOpen ? "sidebar-open" : ""}`}>
        <SideBar
          showPost={showPost}
          onShowPostChange={setShowPost}
          onPostCreated={() => setPostVersion((version) => version + 1)}
        />
      </div>
      <div className="listMain">
        <List postVersion={postVersion} />
      </div>
    </div>
  );
}
