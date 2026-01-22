import React, { useEffect, useState } from "react";
import "./ChennaiChapter.scss";
import { db, auth } from "../../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../../assets/person-logo.png";

const ChennaiChapter = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canView, setCanView] = useState(false);

  /* 🔐 Check login (paid members page) */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCanView(true);
      } else {
        setCanView(false);
      }
    });

    return () => unsub();
  }, []);

  /* 📦 Fetch Chennai Chapter members */
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snapshot = await get(ref(db, "users"));

        if (!snapshot.exists()) {
          setMembers([]);
          return;
        }

        const data = snapshot.val();

        const filteredMembers = Object.keys(data)
          .map((uid) => ({
            uid,
            ...data[uid],
          }))
          .filter(
            (user) =>
              user.isPaidMember === true &&
              user.approved === true &&
              user.membershipId &&
              user.membershipId.trim() !== "" &&
              user.state === "Tamil Nadu"
          )
          .map((user) => ({
            uid: user.uid,
            fullname: user.fullname || "Unnamed",
            profession: user.profession || "",
            membershipId: user.membershipId,
            email: user.email || "",
            mobile: user.mobile || "",
            profileImage: user.profileImage || personLogo,
          }));

        setMembers(filteredMembers);
      } catch (err) {
        console.error("Chennai chapter fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p className="chapter-loading">Loading chapter members...</p>;
  }

  return (
    <div className="chennai-chapter-page">
      {/* Hero */}
      <div className="chapter-hero">
        <h1>Chennai Alumni Chapter</h1>
        <p>
          Verified paid members of CIT Alumni Chennai Chapter
        </p>
      </div>

      {/* Members Section */}
      {!canView ? (
        <div className="locked-box">
          <h3>🔒 Login Required</h3>
          <p>Please login to view Chennai chapter members</p>
          <button onClick={() => (window.location.href = "/accounts")}>
            Login / Signup
          </button>
        </div>
      ) : members.length === 0 ? (
        <p className="no-members">
          No approved paid members found for Chennai Chapter
        </p>
      ) : (
        <div className="members-grid">
          {members.map((member) => (
            <div className="member-card" key={member.uid}>
              <div className="member-photo">
                <img
                  src={member.profileImage}
                  alt={member.fullname}
                />
              </div>

              <h3>{member.fullname}</h3>
              <p>{member.profession}</p>

              <span className="member-id">
                ID: {member.membershipId}
              </span>

              <div className="member-contact">
                {member.email && (
                  <a href={`mailto:${member.email}`}>
                    {member.email}
                  </a>
                )}
                {/* {member.mobile && <p>{member.mobile}</p>} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChennaiChapter;
