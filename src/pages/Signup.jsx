// Signup.jsx
import React, { useState } from "react";
import "./Signup.scss";
import Favicon from "../assets/Favicon.png";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    age: "",
    batch: "",
    branch: "",
    mobile: "",
    email: location.state?.email || "",
    password: "",
    city: "",
    state: "",
    country: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getLatLng = async (city, state, country) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${city}, ${state}, ${country}`
      )}`
    );
    const data = await res.json();
    if (!data.length) throw new Error("Location not found");

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  };

  const generateMembershipId = (uid) =>
    `LTM-${uid.slice(0, 6).toUpperCase()}`;

  const handleSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await sendEmailVerification(cred.user);

      const locationData = await getLatLng(form.city, form.state, form.country);

      // ✅ STORE IN UnapprovedUsers
      await set(ref(db, `UnapprovedUsers/${cred.user.uid}`), {
        ...form,
        lat: locationData.lat,
        lng: locationData.lng,
        membershipId: generateMembershipId(cred.user.uid),
        approved: false,
        role: "user",
        createdAt: Date.now()
      });

      await signOut(auth);

      alert(
        "Signup successful. Please verify your email and wait for admin approval."
      );
      navigate("/accounts");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-hero">
        <h1>Signup</h1>
      </div>

      <div className="signup-content">
        <div className="signup-card-left">
          <img src={Favicon} alt="logo" height={60} />
          <h2>CIT Alumni Association</h2>
          <p>Create your alumni account</p>
        </div>

        <div className="signup-card-right">
          {Object.keys(form).map((key) =>
            key === "password" ? (
              <div key={key} className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="PASSWORD"
                  value={form.password}
                  onChange={handleChange}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            ) : (
              <input
                key={key}
                name={key}
                placeholder={key.toUpperCase()}
                value={form[key]}
                onChange={handleChange}
              />
            )
          )}

          <button className="go" onClick={handleSignup}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
