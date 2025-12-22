import React, { useEffect, useState } from "react";
import "./Team.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../assets/person-logo.png";

const PUBLIC_LIMIT = 5;

const Team = () => {
  const [members, setMembers] = useState([]);
  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Determine access
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCanViewAll(false);
        return;
      }

      const snap = await get(ref(db, `users/${user.uid}`));
      const data = snap.val();

      if (data?.role === "admin" || data?.approved === true) {
        setCanViewAll(true);
      } else {
        setCanViewAll(false);
      }
    });

    return () => unsub();
  }, []);

  // 📦 Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snapshot = await get(ref(db, "users"));

        if (!snapshot.exists()) {
          setMembers([]);
          return;
        }

        const data = snapshot.val();

        const list = Object.keys(data).map((uid) => ({
          id: uid,
          fullname: data[uid].fullname || "Unnamed",
          branch: data[uid].branch || "—",
          batch: data[uid].batch || "—",
        }));

        setMembers(canViewAll ? list : list.slice(0, PUBLIC_LIMIT));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [canViewAll]);

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="team-page">
      <h2>MEMBERS</h2>

      <div className={`team-grid ${!canViewAll ? "blurred" : ""}`}>
        {members.map((member) => (
          <div className="team-card" key={member.id}>
            <img src={personLogo} alt={member.fullname} className="team-profile" />
            <h3 className="team-name">{member.fullname}</h3>
            <p className="team-meta">
              {member.branch} • {member.batch}
            </p>
          </div>
        ))}
      </div>

      {!canViewAll && (
        <div className="team-overlay">
          <h3>Want to see all alumni members?</h3>
          <p>Signup & get admin approval to unlock full access</p>
          <button onClick={() => (window.location.href = "/accounts")}>
            Signup & Get Approved
          </button>
        </div>
      )}
    </div>
  );
};

export default Team;
///working