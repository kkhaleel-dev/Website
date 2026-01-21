import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import personImg from "../assets/person-logo.png";
import { QRCodeSVG } from "qrcode.react";
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
      <div className="scan-container full-center dark-bg">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="scan-container full-center dark-bg">
        <div className="not-found-card">
          <h2>Membership Not Found ❌</h2>
          <p>This membership ID is invalid or expired.</p>
        </div>
      </div>
    );
  }

  const profileImage =
    userData.profileImage && userData.profileImage.trim() !== ""
      ? userData.profileImage
      : personImg;

  return (
    <div className="scan-container full-center dark-bg">
      <div className="scan-wrapper">
        {/* LEFT CARD */}
        <div className="card left-card">
          <img src={profileImage} alt="User" className="profile-img" />
          <h2 className="fullname">{userData.fullname || ""}</h2>
          <p className="info"><strong>Branch:</strong> {userData.branch || ""}</p>
          <p className="info"><strong>Batch:</strong> {userData.batch || ""}</p>
          <p className="membership">
            <strong>Membership ID:</strong>{" "}
            <span className="gold">{userData.membershipId || ""}</span>
            <button className="copy-btn" onClick={copyMembership}>
              Copy
            </button>
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="card right-card">
          <p className="info"><strong>Year of Passing:</strong> {userData.batch || ""}</p>
          <p className="info"><strong>Mobile:</strong> {userData.mobile || ""}</p>
          <p className="info"><strong>Scanner URL:</strong></p>
          <QRCodeSVG
            value={`${window.location.origin}/scan/${userData.membershipId}`}
            size={150}
            bgColor="#1e1e1e"
            fgColor="#f0b429"
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanMembership;
