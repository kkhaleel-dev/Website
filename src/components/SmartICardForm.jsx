import React, { useEffect, useState } from "react";
import "./SmartICardForm.scss";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import Signup from "../../src/pages/Signup";
import logo from "../assets/Favicon.png";
import personImg from "../assets/person-logo.png";
import { QRCodeSVG } from "qrcode.react";

const SmartICardForm = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  // 🔐 Not logged in
  if (!userData) return <Signup />;

  // ✅ PROFILE IMAGE FALLBACK LOGIC
  const profileImage =
    userData.profileImage && userData.profileImage.trim() !== ""
      ? userData.profileImage
      : personImg;

  return (
    <div className="smart-i-card-container">
      <h2>Smart ID Card</h2>

      <div className="smart-i-card-wrapper">
        {/* LEFT CARD */}
        <div className="card left-card">
          <div className="card-content">
            <img src={logo} alt="Logo" className="logo" />

            {/* ✅ PROFILE IMAGE */}
            <img
              src={profileImage}
              alt="User"
              className="person-img"
              onError={(e) => {
                e.target.src = personImg; // extra safety
              }}
            />

            <p className="name">Name: {userData.fullname}</p>
            <p className="branch">Branch: {userData.branch}</p>
            <p className="membership">
              ID: {userData.membershipId}
            </p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="card right-card">
          <div className="card-content">
            <p className="year">
              <strong>Year of Passing:</strong> {userData.batch}
            </p>
            <p className="batch">
              <strong>Mobile No:</strong> {userData.mobile}
            </p>

            {/* <img src={qrCode} alt="QR Code" className="qr-code" /> */}
          
            <QRCodeSVG
              value={`https://website-delta-six-36.vercel.app/${userData.membershipId}`}
              size={160} // size in px
              bgColor="#ffffff"
              fgColor="#000000"
              level="H" // error correction
              includeMargin={true}
            />


            <p className="website">www.citacc.com</p>
          </div>
        </div>
      </div>

      {/* OFFERS */}
      <div className="smart-offers">
        <h3>Exclusive Offers for Approved Smart Card Users</h3>
        <ul>
          <li>🎁 Discount on alumni merchandise</li>
          <li>🍽️ Special discounts at partner restaurants</li>
          <li>🎫 Early access to workshops & events</li>
          <li>💳 Cashback on annual membership renewal</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartICardForm;
