import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";

const VerifyMember = () => {
  const { membershipId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      const snapshot = await get(ref(db, "users"));
      if (!snapshot.exists()) return setLoading(false);

      const users = snapshot.val();

      const found = Object.values(users).find(
        (u) => u.membershipId === membershipId
      );

      setMember(found || null);
      setLoading(false);
    };

    fetchMember();
  }, [membershipId]);

  if (loading) return <p>Verifying...</p>;
  if (!member) return <p>❌ Invalid Membership ID</p>;

  return (
    <div className="verify-page">
      <h2>Verified Alumni Member</h2>
      <p><strong>Name:</strong> {member.fullname}</p>
      <p><strong>Membership ID:</strong> {member.membershipId}</p>
      <p><strong>Role:</strong> {member.role || "Alumni"}</p>
      <p><strong>Profession:</strong> {member.profession}</p>
      <p><strong>Age:</strong> {member.age}</p>
      <p><strong>Location:</strong> {member.city}, {member.state}, {member.country}</p>
      <p style={{ color: "green", fontWeight: "bold" }}>✔ Active Member</p>
    </div>
  );
};

export default VerifyMember;
