import React, { useEffect, useRef, useState } from "react";
import { ref, onValue, push, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import "./Carousel7.scss";

const Carousel7 = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const scrollTimer = useRef(null);

  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [popupPost, setPopupPost] = useState(null);

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  /* ===== AUTH ===== */
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u || null);
      if (!u) return;

      const snap = await get(ref(db, `users/${u.uid}`));
      if (snap.exists()) setUserData(snap.val());
    });
  }, []);

  const isAdmin = userData?.role === "admin";
  const canPost =
    currentUser &&
    (isAdmin ||
      (userData?.approved === true &&
        userData?.isPaidMember === true));

  /* ===== LOAD APPROVED POSTS ===== */
  useEffect(() => {
    const postsRef = ref(db, "postsList");
    return onValue(postsRef, (snap) => {
      if (!snap.exists()) {
        setPosts([]);
        return;
      }

      const approved = Object.values(snap.val())
        .filter((p) => p.approved === true)
        .sort((a, b) => b.createdAt - a.createdAt);

      setPosts(approved);
    });
  }, []);

  /* ===== LOOP AUTO SCROLL ===== */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || posts.length <= 4) return;

    const startScroll = () => {
      if (scrollTimer.current) return;
      scrollTimer.current = setInterval(() => {
        el.scrollLeft += 1;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }, 25);
    };

    const stopScroll = () => {
      clearInterval(scrollTimer.current);
      scrollTimer.current = null;
    };

    if (!popupPost) startScroll();

    el.addEventListener("mouseenter", stopScroll);
    el.addEventListener("mouseleave", () => {
      if (!popupPost) startScroll();
    });

    return () => {
      stopScroll();
      el.removeEventListener("mouseenter", stopScroll);
    };
  }, [posts, popupPost]);

  /* ===== IMAGE PICK FROM DEVICE → BASE64 ===== */
  const handleImagePick = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ===== CREATE POST ===== */
  const handleCreatePost = async () => {
    if (!content.trim() && !image) return;

    const postRef = push(ref(db, "postsList"));
    await set(postRef, {
      id: postRef.key,
      content,
      image,
      createdAt: Date.now(),
      createdBy: currentUser.uid,
      createdByName: userData?.fullname || "User",
      approved: isAdmin ? true : false,
    });

    setContent("");
    setImage("");
    setShowCreate(false);
  };

  return (
    <section className="carousel7">
      <div className="carousel7-header">
        <h2>Posts / Announcements</h2>

        {canPost && (
          <div className="header-actions">
            <button
              className="create-post-btn"
              onClick={() => setShowCreate(true)}
            >
              + Create Post
            </button>

            <button
              className="post-management-btn"
              onClick={() => navigate("/posts-management")}
            >
              My Post Management
            </button>
          </div>
        )}
      </div>

      <div className="carousel7-feed" ref={scrollRef}>
        {posts.length === 0 && (
          <div className="no-posts">No posts available</div>
        )}

        {posts.map((p) => (
          <div className="post-card" key={p.id}>
            {p.image ? (
              <div className="media-box">
                <img src={p.image} alt="" />
              </div>
            ) : (
              <div className="media-placeholder">No Image</div>
            )}

            <div className="post-body">
              <strong className="author">{p.createdByName}</strong>
              <p className="post-text">{p.content}</p>
            </div>

            <div className="post-footer">
              <span className="date">
                Posted On: {new Date(p.createdAt).toLocaleDateString()}
              </span>
              <button
                className="view-btn"
                onClick={() => setPopupPost(p)}
              >
                View Post →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CREATE POST POPUP ===== */}
      {showCreate && (
        <div className="popup">
          <div className="popup-inner">
            <button className="close" onClick={() => setShowCreate(false)}>
              ✕
            </button>

            <h3 className="popup-title">Create Post</h3>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something…"
            />

            <div className="image-picker-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImagePick(e.target.files[0])}
              />
              {/* {image && (
                <div className="image-preview">
                  <img src={image} alt="preview" />
                </div>
              )} */}
            </div>

            <button className="submit-btn" onClick={handleCreatePost}>
              {isAdmin ? "Publish" : "Send for Approval"}
            </button>
          </div>
        </div>
      )}

      {/* ===== VIEW POST POPUP ===== */}
      {popupPost && (
        <div className="popup">
          <div className="popup-inner">
            <button className="close" onClick={() => setPopupPost(null)}>
              ✕
            </button>
            {popupPost.image && <img src={popupPost.image} alt="" />}
            <p>{popupPost.content}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Carousel7;
