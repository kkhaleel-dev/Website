import React, { useEffect, useState } from "react";
import "./AlumniDirectory.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../assets/person-logo.png";

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // New search state

  /* 🔐 Auth & approval check */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCanViewAll(false);
        return;
      }

      const snap = await get(ref(db, `users/${user.uid}`));
      const data = snap.val();

      if (data?.approved === true || data?.role === "admin") {
        setCanViewAll(true);
      } else {
        setCanViewAll(false);
      }
    });

    return () => unsub();
  }, []);

  /* 📦 Fetch alumni */
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        let snapshot;

        if (canViewAll) {
          snapshot = await get(ref(db, "users"));
        } else {
          snapshot = await get(ref(db, "publicTeamPreview"));
        }

        if (!snapshot.exists()) {
          setAlumni([]);
          return;
        }

        const data = snapshot.val();

        const list = Object.keys(data).map((uid) => ({
          id: uid,
          fullname: data[uid].fullname || "Unnamed",
          branch: data[uid].branch || "",
          batch: data[uid].batch || "",
          profession: data[uid].profession || "",
          city: data[uid].city || "",
          state: data[uid].state || "",
          country: data[uid].country || "",
          profileImage: data[uid].profileImage || personLogo,
        }));

        setAlumni(list);
      } catch (err) {
        console.error("Alumni directory fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [canViewAll]);

  /* 💬 Messaging Event */
  const sendMessage = (uid) => {
    window.dispatchEvent(new CustomEvent("openChat", { detail: uid }));
  };

  // Filter alumni based on search query
  const filteredAlumni = alumni.filter((member) =>
    member.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="alumni-loading">Loading alumni...</p>;

  return (
    <div className="alumni-directory-page">
      {/* Header with title and search bar */}
      <div className="alumni-directory-header">
        <h2>CIT Alumni Directory</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="alumni-search"
        />
      </div>

      {/* Alumni grid */}
      <div className={`alumni-grid ${!canViewAll ? "blurred" : ""}`}>
        {filteredAlumni.map((member) => (
          <div className="alumni-card" key={member.id}>
            <div className="alumni-photo">
              <img src={member.profileImage} alt={member.fullname} />
            </div>

            <div className="alumni-info">
              <h3>{member.fullname}</h3>
              <p>
                <strong>Branch:</strong> {member.branch}
              </p>
              <p>
                <strong>Batch:</strong> {member.batch}
              </p>

              {canViewAll && (
                <>
                  <p>
                    <strong>Profession:</strong> {member.profession}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {member.city}, {member.state}, {member.country}
                  </p>

                  <button
                    className="send-message-btn"
                    onClick={() => sendMessage(member.id)}
                  >
                    Send Message
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Locked overlay */}
      {!canViewAll && (
        <div className="alumni-overlay">
          <h3>Want to view full alumni details?</h3>
          <p>Login / Signup & get approved to unlock full access</p>
          <button onClick={() => (window.location.href = "/accounts")}>
            Login / Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
