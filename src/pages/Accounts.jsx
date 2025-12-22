// Accounts.jsx (UPDATED)
import React, { useState } from "react";
import "./Accounts.scss";
import Favicon from "../assets/Favicon.png";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toast = (msg) => {
    const t = document.createElement("div");
    t.innerText = msg;
    t.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #222;
      color: #fff;
      padding: 14px 20px;
      border-radius: 6px;
      z-index: 9999;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 5000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast("Enter email & password");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userRef = ref(db, `users/${cred.user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        toast("User data not found");
        await signOut(auth);
        return;
      }

      const userData = snapshot.val();

      if (!userData.approved && userData.role !== "admin") {
        toast("Your account is not approved yet. Please wait for admin approval.");
        await signOut(auth);
        return;
      }

      toast("Login successful");
      navigate(-1);
    } catch (err) {
      toast(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="accounts-page">
      <div className="accounts-hero">
        <h1>Signup / Login</h1>
      </div>

      <div className="accounts-content">
        <div className="accounts-card-left">
          <img src={Favicon} alt="logo" height={60} />
          <h2>CIT Alumni Association</h2>
          <p>Sign up or log in to stay connected</p>
        </div>

        <div className="accounts-card-right">
          <h3>Choose any one of the following</h3>

          <div className="accounts-email-row">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="go" onClick={handleLogin}>
              Login
            </button>

            <button
              className="go secondary"
              onClick={() => navigate("/signup", { state: { email } })}
            >
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* ✅ OFFERS SECTION (NEW) */}
      <div className="accounts-offers">
        <h3>Exclusive Offers for CIT Alumni</h3>
        <p className="offers-sub">
          Fast signup & approval unlocks these benefits for verified alumni
        </p>

        <ul className="offers-list">
          <li>🎁 Alumni merchandise discounts</li>
          <li>🍽️ Partner restaurant special pricing</li>
          <li>🎫 Priority access to events & reunions</li>
          <li>💳 Smart Card–based rewards & benefits</li>
        </ul>

        <button
          className="offers-cta"
          onClick={() => navigate("/signup")}
        >
          Signup & Get Approved
        </button>
      </div>
    </div>
  );
};

export default Accounts;
