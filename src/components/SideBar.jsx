import "./SideBar.css";
import Home from "../assets/home.svg";
import { UserButton } from "@clerk/react";

export default function SideBar() {
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
          <li className="menu">โพสต์</li>
        </ul>
      </div>
      <div className="profile">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                width: "40px",
                height: "40px",
                boxShadow: "0px 0px 5px 1px rgb(30, 61, 52)",
              },
            },
          }}
        />
      </div>
    </aside>
  );
}
