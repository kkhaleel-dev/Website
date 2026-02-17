import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../assets/person-logo.png";
import "./AlumniInMyCity.scss";

const AlumniInMyCity = () => {
  const [users, setUsers] = useState([]);
  const [myCity, setMyCity] = useState("");
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
        setMyCity(myData.city || "");

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
              u.city === myData.city &&
              u.approved === true &&
              u.id !== user.uid
          );

        setUsers(list);
      } catch (error) {
        console.error("City alumni fetch error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* ========= LOADING ========= */
  if (loading) {
    return (
      <div className="city-empty-state">
        <p>Loading alumni...</p>
      </div>
    );
  }

  /* ========= EMPTY ========= */
  if (users.length === 0) {
    return (
      <div className="city-empty-state">
        <h2>Alumni In {myCity}</h2>
        <p>No alumni found in your city yet.</p>
      </div>
    );
  }

  /* ========= NORMAL UI ========= */
  return (
    <div className="team-page">
      <h2>Alumni In {myCity}</h2>

      <div className="team-grid">
        {users.map((member) => (
          <div className="team-card" key={member.id}>
            <img
              src={member.profileImage || personLogo}
              alt={member.fullname}
              className="team-profile"
            />

            <h3 className="team-name">{member.fullname}</h3>

            {(member.branch || member.batch) && (
              <p className="team-meta">
                {[member.branch, member.batch]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            )}

            {member.profession && (
              <p className="team-meta">
                Profession: {member.profession}
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

export default AlumniInMyCity;
