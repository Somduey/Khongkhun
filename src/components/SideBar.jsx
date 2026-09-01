import "./SideBar.css";
import Home from "../assets/home.svg";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { logOut, auth } from "../services/firebase.js";
import { addPost } from "../services/supabase.js";
import { onAuthStateChanged } from "firebase/auth";

export default function SideBar({
  showPost,
  onShowPostChange,
  onPostCreated,
  postFilter,
  onPostFilterChange,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("lost");
  const [uploading, setUploading] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const profileInitial = user?.email?.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setProfileImageFailed(false);
    });
    return () => unsubscribe();
  }, []);

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

  function toggleValue() {
    setShow(!show);
  }

  function showPostitem() {
    onShowPostChange(!showPost);
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmitPost = async () => {
    if (!selectedImage || !description.trim()) {
      alert("กรุณาเลือกรูปภาพและเขียนรายละเอียด");
      return;
    }

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      setUploading(true);

      await addPost({
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        postType,
        imageFile: selectedImage,
        description,
      });

      alert("โพสต์เสร็จแล้ว");

      setSelectedImage(null);
      setImagePreview(null);
      setDescription("");
      setPostType("lost");
      onShowPostChange(false);
      onPostCreated();
    } catch (err) {
      console.error("Upload failed", err);
      alert("อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside id="sidebar" className="maincontainer-sideL">
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
          <li className="menu" onClick={showPostitem}>
            โพสต์
          </li>
        </ul>
        <div className="post-filter-menu" aria-label="กรองประเภทประกาศ">
          <button
            type="button"
            className={postFilter === null ? "active" : ""}
            onClick={() => onPostFilterChange(null)}
            aria-pressed={postFilter === null}
          >
            แสดงทั้งหมด
          </button>
          <button
            type="button"
            className={postFilter === "lost" ? "active" : ""}
            onClick={() => onPostFilterChange("lost")}
            aria-pressed={postFilter === "lost"}
          >
            ตามหาของ
          </button>
          <button
            type="button"
            className={postFilter === "search" ? "active" : ""}
            onClick={() => onPostFilterChange("search")}
            aria-pressed={postFilter === "search"}
          >
            ตามหาเจ้าของ
          </button>
        </div>
      </div>
      <button className="option" onClick={toggleValue}>
        {user?.photoURL && !profileImageFailed ? (
          <img
            src={user.photoURL}
            alt="Profile"
            onError={() => setProfileImageFailed(true)}
          />
        ) : (
          <span className="sidebar-profile-placeholder" aria-label="Profile">
            {profileInitial}
          </span>
        )}
      </button>

      {/* เพิ่มเติม */}
      {show && (
        <div className="sign-out-Ac">
          <button type="button" onClick={handleSignOut} disabled={loading}>
            {loading ? "กำลังออก..." : "ออกจากระบบ"}
          </button>
        </div>
      )}

      {showPost && createPortal(
        <>
          <button
            type="button"
            className="post-backdrop"
            onClick={() => onShowPostChange(false)}
            aria-label="ปิดหน้าต่างโพสต์"
          />
          <div className="post" role="dialog" aria-modal="true" aria-label="สร้างโพสต์">
            <h1 className="headText">โพสต์</h1>
            <div className="addPicture">
              <fieldset className="postTypeInput">
                <legend>ฉันต้องการ...</legend>
                <label>
                  <input
                    type="radio"
                    name="postType"
                    value="lost"
                    checked={postType === "lost"}
                    onChange={(event) => setPostType(event.target.value)}
                  />
                  ตามหาของ
                </label>
                <label>
                  <input
                    type="radio"
                    name="postType"
                    value="search"
                    checked={postType === "search"}
                    onChange={(event) => setPostType(event.target.value)}
                  />
                  ตามหาเจ้าของ
                </label>
              </fieldset>
              <label htmlFor="imageInput">กรุณาเลือกรูปภาพ</label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => document.getElementById("imageInput").click()}
              >
                เลือกรูป
              </button>

              {imagePreview && (
                <div className="imagePreviewContainer">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="removeBtn"
                  >
                    ลบ
                  </button>
                </div>
              )}

              <textarea
                placeholder="เขียนรายละเอียด...หรือสถานที่รับของ"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="descriptionInput"
              />

              <button
                type="button"
                onClick={handleSubmitPost}
                disabled={uploading}
                className="submitBtn"
              >
                {uploading ? "กำลังส่ง..." : "ส่ง"}
              </button>
            </div>
          </div>
        </>
      , document.body)}
    </aside>
  );
}
