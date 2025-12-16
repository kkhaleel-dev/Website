import React, { useEffect, useState } from "react";
import "./Team.scss";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import personLogo from "../../assets/person-logo.png";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const snapshot = await get(ref(db, "users"));

        if (snapshot.exists()) {
          const data = snapshot.val();

          const list = Object.keys(data).map((uid) => ({
            id: uid,
            fullname: data[uid].fullname || "Unnamed",
            branch: data[uid].branch || "—",
            batch: data[uid].batch || "—",
            photo: { personLogo },
          }));

          setMembers(list);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Unable to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="team-page">
      <h2>MEMBERS</h2>

      <div className="team-grid">
        {members.map((member) => (
          <div className="team-card" key={member.id}>
            <img
              src={personLogo}
              alt={member.fullname}
              className="team-profile"
            />

            <h3 className="team-name">{member.fullname}</h3>

            <p className="team-meta">
              {member.branch} • {member.batch}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
