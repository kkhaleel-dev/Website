import React, { useEffect, useState } from "react";
import { db, storage, auth } from "../../firebase";
import { ref, get, push, remove } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import "./Magazines.scss";

const Magazines = () => {
  const [magazines, setMagazines] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 AUTH CHECK
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await get(ref(db, `users/${user.uid}`));
      if (snap.exists() && snap.val().role === "admin") {
        setIsAdmin(true);
      }
    });
  }, []);

  // 📥 FETCH MAGAZINES (PUBLIC)
  const fetchMagazines = async () => {
    try {
      // console.log("Fetched magazines data:", db);
      const snap = await get(ref(db, "magazines"));
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, m]) => ({ id, ...m }));
      setMagazines(list.reverse());
    } catch (err) {
      console.error("Error fetching magazines:", err);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  // 📂 FILE SELECT
  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || selected.type !== "application/pdf") {
      alert("Please select a PDF file only");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setPreviewTitle(selected.name.replace(".pdf", ""));
    setShowPopup(true);
  };

  // 💾 PUBLISH MAGAZINE
  const publishMagazine = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const storageRef = sRef(storage, `magazines/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const pdfUrl = await getDownloadURL(storageRef);

      const newRef = push(ref(db, "magazines"));
      await newRef.set({
        title: file.name.replace(".pdf", ""),
        edition: "Latest",
        description: "Official CIT Publication",
        pdfUrl,
        publishedAt: Date.now(),
        createdBy: auth.currentUser.uid,
      });

      setShowPopup(false);
      setFile(null);
      setPreviewUrl("");
      fetchMagazines();
      alert("Magazine published successfully!");
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Failed to upload magazine. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE MAGAZINE
  const deleteMagazine = async (id) => {
    if (!window.confirm("Delete this magazine?")) return;
    try {
      await remove(ref(db, `magazines/${id}`));
      fetchMagazines();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete magazine.");
    }
  };

  // 👁️ PREVIEW MAGAZINE (END USER)
  const openPreview = (m) => {
    setPreviewUrl(m.pdfUrl);
    setPreviewTitle(m.title);
    setShowPopup(true);
  };

  return (
    <div className="magazines-page">
      {/* CREATE BUTTON - top right corner */}
      {isAdmin && (
        <label className="create-mag-btn">
          Create Magazine
          <input type="file" hidden onChange={onFileChange} />
        </label>
      )}

      <div className="magazines-header">
        <h2>Magazines & Newsletters</h2>
      </div>

      <div className="magazines-grid">
        {magazines.length === 0 ? (
          <p className="empty-magazines">No magazines published yet</p>
        ) : (
          magazines.map((m) => (
            <div className="magazine-card" key={m.id}>
              <div className="magazine-content">
                <h3>{m.title}</h3>
                <span className="magazine-edition">{m.edition}</span>
                <p>{m.description}</p>
                <div className="magazine-actions">
                  <button onClick={() => openPreview(m)}>Preview PDF</button>
                  <a href={m.pdfUrl} target="_blank" rel="noreferrer">
                    Download PDF
                  </a>
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
            </div>
          ))
        )}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{previewTitle}</h3>
            <iframe src={previewUrl} title="preview" />

            {isAdmin && file && (
              <div className="popup-actions">
                <button onClick={publishMagazine} disabled={loading}>
                  {loading ? "Uploading..." : "Publish"}
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setFile(null);
                    setPreviewUrl("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}

            {!file && (
              <div className="popup-actions">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setPreviewUrl("");
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Magazines;
