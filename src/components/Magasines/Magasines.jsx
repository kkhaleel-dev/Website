import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { ref, get, push, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import thumbnailImg from "../../assets/CITAlumniFull.png"; // Local thumbnail image
import "./Magazines.scss";

const extractFileId = (url) => {
  if (!url) return null;
  const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
  return match ? match[1] : null;
};

const Magazines = () => {
  const [magazines, setMagazines] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Popups
  const [showPopup, setShowPopup] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Admin form
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [driveLink, setDriveLink] = useState("");

  // 🔐 Admin check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await get(ref(db, `users/${user.uid}`));
      if (snap.exists() && snap.val().role === "admin") setIsAdmin(true);
    });
    return () => unsub();
  }, []);

  // 📥 Fetch magazines
  const fetchMagazines = async () => {
    const snap = await get(ref(db, "magazines"));
    const data = snap.val() || {};
    const list = Object.entries(data).map(([id, m]) => ({
      id,
      ...m,
    }));
    setMagazines(list.reverse());
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  // ➕ Create magazine
  const createMagazine = async () => {
    const fileId = extractFileId(driveLink);
    if (!title || !fileId) {
      alert("Please enter title and valid Google Drive link");
      return;
    }

    await push(ref(db, "magazines"), {
      title,
      fileId,
      createdAt: Date.now(),
    });

    setTitle("");
    setDriveLink("");
    setShowCreate(false);
    fetchMagazines();
  };

  // 🗑 Delete magazine
  const deleteMagazine = async (id) => {
    if (!window.confirm("Delete this magazine?")) return;
    await remove(ref(db, `magazines/${id}`));
    fetchMagazines();
  };

  // 👁 Preview
  const openPreview = (m) => {
    setPreviewTitle(m.title);
    setPreviewUrl(`https://drive.google.com/file/d/${m.fileId}/preview`);
    setShowPopup(true);
  };

  // ⬇ Download
  const downloadPDF = (m) => {
    window.open(
      `https://drive.google.com/uc?export=download&id=${m.fileId}`,
      "_blank"
    );
  };

  return (
    <div className="magazines-page">
      {/* Admin Create */}
      {isAdmin && (
        <button
          className="create-mag-btn"
          onClick={() => setShowCreate(true)}
        >
          Publish New Magazine
        </button>
      )}

      <h2 className="magazines-header">Magazines & Newsletters</h2>

      {/* Grid */}
      {magazines.length === 0 ? (
        <div className="empty-state">No Magazines Published</div>
      ) : (
        <div className="magazines-grid">
          {magazines.map((m) => (
            <div className="magazine-card" key={m.id}>
              {/* 70% Thumbnail Image */}
              <div
                className="magazine-thumbnail"
                onClick={() => openPreview(m)}
              >
                <img src={thumbnailImg} alt={m.title} />
              </div>

              {/* 20% Title */}
              <div className="magazine-title">{m.title}</div>

              {/* 10% Actions */}
              <div className="magazine-actions">
                <button onClick={() => openPreview(m)}>Read Magazine</button>
                <button onClick={() => downloadPDF(m)}>Download PDF</button>
                {isAdmin && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteMagazine(m.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Popup */}
      {showCreate && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Create Magazine</h3>
            <input
              type="text"
              placeholder="Magazine Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Google Drive Viewer Link"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={createMagazine}>Publish</button>
              <button onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup large">
            <h3>{previewTitle}</h3>
            <iframe
              src={previewUrl}
              width="100%"
              height="500"
              allow="autoplay"
              title="PDF Preview"
            ></iframe>
            <div className="popup-actions">
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Magazines;
