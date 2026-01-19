import React, { useEffect, useState } from "react";
import "./Team.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../assets/person-logo.png";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const SPECIAL_ROLES = ["admin", "CEO", "Chairperson"]; // filtered roles

  // 🔐 Auth & approval check
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
        let snapshot;
        if (canViewAll) {
          snapshot = await get(ref(db, "users")); // all users
        } else {
          snapshot = await get(ref(db, "publicTeamPreview")); // limited public preview
        }

        if (!snapshot.exists()) {
          setMembers([]);
          return;
        }

        const data = snapshot.val();

        let list = Object.keys(data).map((uid) => ({
          id: uid,
          fullname: data[uid].fullname || "Unnamed",
          branch: data[uid].branch || "",
          batch: data[uid].batch || "",
          profession: data[uid].profession || "",
          role: data[uid].role || "",
          city: data[uid].city || "",
          state: data[uid].state || "",
          country: data[uid].country || "",
          profileImage: data[uid].profileImage || personLogo,
        }));

        // 🔹 Apply role filter only for logged-in users
        if (canViewAll) {
          list = list.filter(member => SPECIAL_ROLES.includes(member.role));
        }

        setMembers(list);
      } catch (err) {
        console.error("Team fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [canViewAll]);

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="team-page">
      <h2>Team Members</h2>

      <div className={`team-grid ${!canViewAll ? "blurred" : ""}`}>
        {members.map((member) => (
          <div className="team-card" key={member.id}>
            <img src={member.profileImage} alt={member.fullname} className="team-profile" />
            <h3 className="team-name">{member.fullname}</h3>
            <p className="team-meta">{member.branch} • {member.batch}</p>
            {canViewAll && (
              <>
                <p className="team-meta">Profession: {member.profession}</p>
                <p className="team-meta">Role: {member.role}</p>
                <p className="team-meta">Location: {member.city}, {member.state}, {member.country}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {!canViewAll && (
        <div className="team-overlay">
          <h3>Want to view full team details?</h3>
          <p>Login / Signup & get approved to unlock full access</p>
          <button onClick={() => (window.location.href = "/accounts")}>Login / Signup</button>
        </div>
      )}
    </div>
  );
};

export default Team;
