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
  const [showPassword, setShowPassword] = useState(false);

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
    setTimeout(() => t.remove(), 4000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast("Enter email & password");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // ✅ EMAIL VERIFICATION CHECK FIRST
      // if (!cred.user.emailVerified) {
      //   toast("Please verify your email before login.");
      //   await signOut(auth);
      //   return;
      // }

      const userRef = ref(db, `users/${cred.user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        toast("Credentials Incorrect / User data not found");
        await signOut(auth);
        return;
      }

      const userData = snapshot.val();

       if (!userData.approved && userData.role !== "admin") {
        toast("Account pending admin approval");
        await signOut(auth);
        return;
      }

      toast("Login successful");
      navigate(-1);
    }catch (err) {
  console.error(err);
  if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
    toast("Invalid email or password");
  } else if (err.code === "PERMISSION_DENIED") {
    toast("Access denied. Please contact admin.");
  } else {
    toast("Login failed. Try again.");
  }
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
          <h3>Alumni Login</h3>

          <div className="accounts-email-row">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

 <span
  className="eye-icon"
  onClick={() => setShowPassword(!showPassword)}
  aria-label="Toggle password visibility"
>
  {showPassword ? (
     // Visibility ON (filled)
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 5c-4.96 0-9.27 2.61-11 6.5 1.73 3.89 6.04 6.5 11 6.5s9.27-2.61 11-6.5C21.27 7.61 16.96 5 12 5zm0 11c-2.49 0-4.5-2.01-4.5-4.5S9.51 7 12 7s4.5 2.01 4.5 4.5S14.49 16 12 16z" />
      <circle cx="12" cy="11.5" r="2.5" />
    </svg>
    
  ) : (
   // Visibility OFF (filled)
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.63 1.28-1.52 2.42-2.6 3.33l1.42 1.42C21.1 14.71 22.27 13.01 23 11.5 21.27 7.61 16.96 5 12 5c-1.27 0-2.49.17-3.64.49l1.72 1.72C10.69 6.08 11.33 6 12 6z" />
      <path d="M2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.58 1 11.5 2.73 15.39 7.04 18 12 18c1.52 0 2.98-.25 4.34-.7l2.78 2.78 1.41-1.41L3.42 2.46 2.01 3.87zM12 16c-3.79 0-7.17-2.13-8.82-5.5.57-1.16 1.36-2.2 2.33-3.06l1.65 1.65a3.5 3.5 0 0 0 4.75 4.75l1.71 1.71c-.53.11-1.07.17-1.62.17z" />
      <path d="M12 8a3.5 3.5 0 0 1 3.5 3.5c0 .3-.04.59-.11.86l-4.25-4.25c.27-.07.56-.11.86-.11z" />
    </svg>
  )}
</span>

</div>


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
      {/* ✅ EXCLUSIVE BENEFITS (SINGLE CONTAINER) */}
<div className="accounts-offers">
  <h3>Exclusive Alumni Benefits</h3>

  <div className="offers-ticker">
    <div className="ticker-track">
      <span>🎁 Alumni Store — Flat 20% OFF</span>
      <span>🍽️ Partner Restaurants — Member Deals</span>
      <span>🎫 Events & Reunions — Priority Access</span>
      <span>💳 Smart Card Rewards & Cashback</span>
      <span>📢 Career Alerts — Alumni Hiring</span>

      {/* duplicate for smooth loop */}
      <span>🎁 Alumni Store — Flat 20% OFF</span>
      <span>🍽️ Partner Restaurants — Member Deals</span>
    </div>
  </div>

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
