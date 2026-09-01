import "./List.css";
import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase.js";
import {
  addComment,
  deletePost,
  getComments,
  getPosts,
} from "../services/supabase.js";

const formatDate = (date) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const getProfileInitial = (email) => email?.charAt(0).toUpperCase() || "?";

export default function List({ postVersion, postFilter }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingPostId, setSubmittingPostId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [failedProfileImages, setFailedProfileImages] = useState({});
  const [deletingPostId, setDeletingPostId] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const postData = await getPosts();
      const commentData = await getComments(postData.map((post) => post.id));
      const groupedComments = commentData.reduce((comments, comment) => {
        const postComments = comments[comment.post_id] || [];
        postComments.push(comment);
        comments[comment.post_id] = postComments;
        return comments;
      }, {});

      setPosts(postData);
      setCommentsByPost(groupedComments);
    } catch (loadError) {
      console.error("Could not load posts", loadError);
      setError("ไม่สามารถโหลดรายการโพสต์ได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadPosts);
  }, [loadPosts, postVersion]);

  const handleCommentSubmit = async (event, postId) => {
    event.preventDefault();
    const content = commentInputs[postId]?.trim();

    if (!content) {
      return;
    }

    if (!user) {
      setError("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      return;
    }

    try {
      setSubmittingPostId(postId);
      setError("");
      const comment = await addComment({
        postId,
        uid: user.uid,
        profileImageURL: user.photoURL,
        content,
      });

      setCommentsByPost((currentComments) => ({
        ...currentComments,
        [postId]: [...(currentComments[postId] || []), comment],
      }));
      setCommentInputs((currentInputs) => ({
        ...currentInputs,
        [postId]: "",
      }));
    } catch (commentError) {
      console.error("Could not add comment", commentError);
      setError("ไม่สามารถเพิ่มความคิดเห็นได้");
    } finally {
      setSubmittingPostId(null);
    }
  };

  const handleDeletePost = async (post) => {
    if (!user || post.uid !== user.uid) {
      setError("คุณไม่มีสิทธิ์ลบโพสต์นี้");
      return;
    }

    if (!window.confirm("ต้องการลบโพสต์นี้ใช่หรือไม่?")) {
      return;
    }

    try {
      setDeletingPostId(post.id);
      setError("");
      await deletePost({ postId: post.id, uid: user.uid });
      setPosts((currentPosts) =>
        currentPosts.filter((currentPost) => currentPost.id !== post.id),
      );
      setCommentsByPost((currentComments) => {
        const remainingComments = { ...currentComments };
        delete remainingComments[post.id];
        return remainingComments;
      });

      if (selectedPostId === post.id) {
        setSelectedPostId(null);
      }
    } catch (deleteError) {
      console.error("Could not delete post", deleteError);
      setError("ไม่สามารถลบโพสต์ได้");
    } finally {
      setDeletingPostId(null);
    }
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId);
  const selectedComments = selectedPost
    ? commentsByPost[selectedPost.id] || []
    : [];
  const filteredPosts = postFilter
    ? posts.filter((post) => post.post_type === postFilter)
    : posts;

  return (
    <main className="post-list">
      <h1>รายการประกาศ</h1>
      <p className="post-list-description">
        ดูประกาศตามหาของและตามหาเจ้าของจากผู้ใช้ทั้งหมด
      </p>
      {error && <p className="post-list-error" role="alert">{error}</p>}
      {loading ? (
        <p className="post-list-loading">กำลังโหลดรายการ...</p>
      ) : filteredPosts.length === 0 ? (
        <section className="empty-post-list" aria-label="รายการโพสต์">
          <h2>{postFilter ? "ยังไม่มีประกาศประเภทนี้" : "ยังไม่มีรายการประกาศ"}</h2>
          <p>
            {postFilter
              ? "ลองเลือกตัวกรองอีกประเภท หรือกดเมนู “โพสต์” เพื่อเพิ่มรายการใหม่"
              : "กดเมนู “โพสต์” ทางด้านซ้ายเพื่อเพิ่มรายการใหม่"}
          </p>
        </section>
      ) : (
        <section className="post-cards" aria-label="รายการโพสต์">
          {filteredPosts.map((post) => {
            const isOwner = user?.uid === post.uid;
            const comments = commentsByPost[post.id] || [];

            return (
              <article
                key={post.id}
                className={`post-card ${isOwner ? "post-card-owner" : "post-card-other"}`}
              >
                <header className="post-card-header">
                  {post.profile_image_url && !failedProfileImages[post.id] ? (
                    <img
                      className="post-profile-image"
                      src={post.profile_image_url}
                      alt=""
                      onError={() =>
                        setFailedProfileImages((currentImages) => ({
                          ...currentImages,
                          [post.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <span className="post-profile-placeholder" aria-label="รูปโปรไฟล์">
                      {getProfileInitial(post.email)}
                    </span>
                  )}
                  <div>
                    <strong>{isOwner ? "โพสต์ของคุณ" : "โพสต์จากผู้ใช้อื่น"}</strong>
                    <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                  </div>
                  <span className={`post-type post-type-${post.post_type}`}>
                    {post.post_type === "lost"
                      ? "ตามหาของ"
                      : "ตามหาเจ้าของ"}
                  </span>
                  {isOwner && (
                    <button
                      type="button"
                      className="delete-post-button"
                      onClick={() => handleDeletePost(post)}
                      disabled={deletingPostId === post.id}
                    >
                      {deletingPostId === post.id ? "กำลังลบ..." : "ลบโพสต์"}
                    </button>
                  )}
                </header>

                <button
                  type="button"
                  className="post-image-button"
                  onClick={() => setSelectedImageUrl(post.image_url)}
                  aria-label="ดูรูปภาพประกอบประกาศแบบเต็มขนาด"
                >
                  <img
                    className="post-image"
                    src={post.image_url}
                    alt="รูปภาพประกอบประกาศ"
                  />
                </button>
                <p className="post-description">{post.description}</p>
                <button
                  type="button"
                  className="comments-trigger"
                  onClick={() => setSelectedPostId(post.id)}
                  aria-haspopup="dialog"
                  aria-expanded={selectedPostId === post.id}
                >
                  ดูและแสดงความคิดเห็น ({comments.length})
                </button>
              </article>
            );
          })}
        </section>
      )}

      {selectedPost && (
        <div
          className="comment-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedPostId(null)}
        >
          <section
            className="comment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comment-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="comment-modal-header">
              <div>
                <h2 id="comment-modal-title">ความคิดเห็น</h2>
                <p>{selectedPost.description}</p>
              </div>
              <button
                type="button"
                className="comment-modal-close"
                onClick={() => setSelectedPostId(null)}
                aria-label="ปิดหน้าต่างความคิดเห็น"
              >
                ออก
              </button>
            </header>

            <div className="comments" aria-label="รายการความคิดเห็น">
              {selectedComments.length === 0 ? (
                <p className="no-comments">ยังไม่มีความคิดเห็น</p>
              ) : (
                selectedComments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    {comment.profile_image_url ? (
                      <img src={comment.profile_image_url} alt="" />
                    ) : (
                      <span className="comment-profile-placeholder" aria-hidden="true">?</span>
                    )}
                    <div>
                      <p>{comment.content}</p>
                      <time dateTime={comment.created_at}>
                        {formatDate(comment.created_at)}
                      </time>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              className="comment-form"
              onSubmit={(event) => handleCommentSubmit(event, selectedPost.id)}
            >
              <input
                type="text"
                value={commentInputs[selectedPost.id] || ""}
                onChange={(event) =>
                  setCommentInputs((currentInputs) => ({
                    ...currentInputs,
                    [selectedPost.id]: event.target.value,
                  }))
                }
                placeholder="เขียนความคิดเห็น..."
                aria-label="เขียนความคิดเห็น"
                maxLength="500"
              />
              <button
                type="submit"
                disabled={submittingPostId === selectedPost.id}
              >
                {submittingPostId === selectedPost.id ? "กำลังส่ง..." : "ส่ง"}
              </button>
            </form>
          </section>
        </div>
      )}

      {selectedImageUrl && (
        <div
          className="image-lightbox"
          role="presentation"
          onClick={() => setSelectedImageUrl(null)}
        >
          <img
            src={selectedImageUrl}
            alt="รูปภาพประกอบประกาศแบบเต็มขนาด"
          />
        </div>
      )}
    </main>
  );
}