import React, { useEffect, useState, useMemo } from "react";
import "./ChennaiChapter.scss";
import { db, auth } from "../../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../../assets/person-logo.png";

const ChennaiChapter = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canView, setCanView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const PRIORITY_MEMBERS = [
    { name: "Saravana Raja", batch: "1988" },
    { name: "Ashok Raj Vadivelu", batch: "1993" },
    { name: "Ramesh M", batch: "1983" },
    { name: "Karnan Ramamurthy", batch: "1996" },
    { name: "Satheesh S", batch: "1985" },
    { name: "Anitha S", batch: "1989" },
  ];

  /* 🔐 Login Check */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCanView(!!user);
    });
    return () => unsub();
  }, []);

  /* 📦 Fetch Users */
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snapshot = await get(ref(db, "users"));
        if (!snapshot.exists()) {
          setMembers([]);
          return;
        }

        const data = snapshot.val();

        let allMembers = Object.keys(data).map((uid) => ({
          uid,
          fullname: data[uid].fullname || "Unnamed",
          designation: data[uid].designation || "",
          branch: data[uid].branch || "",
          batch: data[uid].batch || "",
          profession: data[uid].profession || "",
          profileImage: data[uid].profileImage || personLogo,
        }));

        /* ✅ Priority Sorting */
        const priorityList = [];
        const remainingList = [];

        allMembers.forEach((member) => {
          const matchIndex = PRIORITY_MEMBERS.findIndex(
            (p) =>
              p.name === member.fullname &&
              p.batch === member.batch
          );

          if (matchIndex !== -1) {
            priorityList[matchIndex] = member;
          } else {
            remainingList.push(member);
          }
        });

        const orderedPriority = priorityList.filter(Boolean);

        setMembers([...orderedPriority, ...remainingList]);
      } catch (err) {
        console.error("Chennai chapter fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* 🔎 Search Filter */
  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.fullname
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  /* 💬 Send Message */
  const sendMessage = (uid) => {
    window.dispatchEvent(
      new CustomEvent("openChat", { detail: uid })
    );
  };

  if (loading) {
    return <p className="chapter-loading">Loading members...</p>;
  }

  return (
    <div className="chennai-chapter-page">
      <div className="chapter-hero">
        <div>
          <h1>Chennai Alumni Chapter</h1>
          <p>CIT Alumni Chennai Chapter</p>
        </div>

        {canView && (
          <div className="chapter-search">
            <input
              type="text"
              placeholder="Search member by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {!canView ? (
        <div className="locked-box">
          <h3>🔒 Login Required</h3>
          <p>Please login to view members</p>
          <button onClick={() => (window.location.href = "/accounts")}>
            Login / Signup
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <p className="no-members">No members found</p>
      ) : (
        <div className="members-grid">
          {filteredMembers.map((member) => (
            <div className="member-card" key={member.uid}>
              <div className="member-photo">
                <img
                  src={member.profileImage}
                  alt={member.fullname}
                />
              </div>

              <h3>{member.fullname}</h3>

              {member.designation && (
                <p className="designation">
                  {member.designation}
                </p>
              )}

              {(member.branch || member.batch) && (
                <p className="branch-batch">
                  {member.branch}
                  {member.branch && member.batch && " | "}
                  {member.batch}
                </p>
              )}

              {member.profession && (
                <p className="profession">
                  {member.profession}
                </p>
              )}

              {/* ✅ Send Message Button */}
              <button
                className="send-message-btn"
                onClick={() => sendMessage(member.uid)}
              >
                Send Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChennaiChapter;
