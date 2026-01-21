import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import personImg from "../assets/person-logo.png";
import "./ScanMembership.scss";

const ScanMembership = () => {
  const { membershipId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = ref(db, `publicProfiles/${membershipId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching membership:", err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [membershipId]);

  const copyMembership = () => {
    if (userData?.membershipId) {
      navigator.clipboard.writeText(userData.membershipId);
      alert("Membership ID copied!");
    }
  };

  if (loading) {
    return (
      <div className="scan-container full-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="scan-container full-center">
        <div className="not-found-card">
          <h2>Membership Not Found ❌</h2>
          <p>This membership ID is invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-container full-center">
      <div className="scan-card">
        <img
          src={userData.profileImage || personImg}
          alt="User"
          className="profile-img"
        />
        <h1 className="name">{userData.fullname}</h1>
        <p className="info">
          <strong>Age:</strong> {userData.age || "N/A"}
        </p>
        <p className="info">
          <strong>Department:</strong> {userData.branch || "N/A"}
        </p>
        <p className="membership">
          <strong>Membership ID:</strong>{" "}
          <span className="gold">{userData.membershipId}</span>{" "}
          <button className="copy-btn" onClick={copyMembership}>
            Copy
          </button>
        </p>
        <p className="instructions">
          Show this page to get your exclusive discount at partner shops!
        </p>
      </div>
    </div>
  );
};

export default ScanMembership;
