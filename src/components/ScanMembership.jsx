import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

const ScanMembership = () => {
  const { membershipId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Query user by membershipId
        const usersRef = ref(db, "users");
        const q = query(usersRef, orderByChild("membershipId"), equalTo(membershipId));
        const snapshot = await get(q);

        if (snapshot.exists()) {
          const users = snapshot.val();
          // There should be only 1 match
          const firstUser = Object.values(users)[0];
          setUserData(firstUser);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching membership:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [membershipId]);

  if (loading) return <p>Loading...</p>;

  if (!userData)
    return (
      <div>
        <h2>Membership not found</h2>
        <p>Invalid or expired membership ID</p>
      </div>
    );

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Smart Card Verified ✅</h2>
      <p>
        Name: <strong>{userData.fullname}</strong>
      </p>
      <p>
        Branch: <strong>{userData.branch}</strong>
      </p>
      <p>
        Membership ID: <strong>{userData.membershipId}</strong>
      </p>
      <p>Show this page to get your exclusive discount!</p>
    </div>
  );
};

export default ScanMembership;
