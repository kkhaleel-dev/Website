import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../assets/person-logo.png";
import "./MyBatchMates.scss";


const MyBatchmates = () => {
  const [users, setUsers] = useState([]);
  const [myBatch, setMyBatch] = useState("");
  const [loading, setLoading] = useState(true);

  const sendMessage = (uid) => {
    window.dispatchEvent(new CustomEvent("openChat", { detail: uid }));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const mySnap = await get(ref(db, `users/${user.uid}`));
        if (!mySnap.exists()) {
          setLoading(false);
          return;
        }

        const myData = mySnap.val();
        setMyBatch(myData.batch || "");

        const allSnap = await get(ref(db, "users"));
        if (!allSnap.exists()) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const list = Object.entries(allSnap.val())
          .map(([uid, u]) => ({ id: uid, ...u }))
          .filter(
            (u) =>
              u.batch === myData.batch &&
              u.approved === true &&
              u.id !== user.uid
          );

        setUsers(list);
      } catch (error) {
        console.error("Batchmates fetch error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="batch-empty-state">
        <p>Loading batchmates...</p>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (users.length === 0) {
    return (
      <div className="batch-empty-state">
        <h2>My Batchmates {myBatch ? myBatch : ""}</h2>
        <p>There are no batchmates in your batch yet.</p>
      </div>
    );
  }

  /* ================= NORMAL UI ================= */
  return (
    <div className="team-page">
      <h2>My Batchmates {myBatch ? myBatch : ""}</h2>

      <div className="team-grid">
        {users.map((member) => (
          <div className="team-card" key={member.id}>
            <img
              src={member.profileImage || personLogo}
              alt={member.fullname}
              className="team-profile"
            />

            <h3 className="team-name">{member.fullname}</h3>

            {member.branch && (
              <p className="team-meta">{member.branch}</p>
            )}

            {member.city && (
              <p className="team-meta">
                {member.city}, {member.state}
              </p>
            )}

            <button
              className="send-message-btn"
              onClick={() => sendMessage(member.id)}
            >
              Send Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBatchmates;
