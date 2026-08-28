import SideBar from "./SideBar.jsx";
import List from "./List.jsx";
import "./KhongKhunHome.css";

export default function KhongKhunHome() {
  return (
    <div className="maincontainer-Khongkhun">
      <div className="sideBarMain">
        <SideBar />
      </div>
      <div className="listMain">
        <List />
      </div>
    </div>
  );
}
