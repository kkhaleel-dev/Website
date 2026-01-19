import React, { useState } from "react";
import "./Signup.scss";
import Favicon from "../assets/Favicon.png";
import DummyLogo from "../assets/person-logo.png";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");

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
    country: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🌍 Free geocoding
  const getLatLng = async (city, state, country) => {
    const address = `${city}, ${state}, ${country}`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();
    if (!data.length) throw new Error("Location not found");

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };

  // 🖼️ Image select + compress (NO library)
  const handleProfileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const size = 200;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5); // ~15–20KB
        setProfileImage(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const locationData = await getLatLng(
        form.city,
        form.state,
        form.country
      );

      // ✅ ONLY save to UnapprovedUsers
      await set(ref(db, `UnapprovedUsers/${cred.user.uid}`), {
        ...form,
        lat: locationData.lat,
        lng: locationData.lng,
        createdAt: Date.now(),
        approved: false,
        role: "user",
        profileImage: profileImage || "",
      });

      await signOut(auth);
      alert("Account created! Please wait for admin approval.");
      navigate("/accounts");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered. Contact admin.");
      } else if (err.code === "auth/invalid-email") {
        alert("Enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else {
        alert("Something went wrong. Try again later.");
      }
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

          <div className="profile-upload">
            <img
              src={profileImage || DummyLogo}
              alt="profile"
              className="profile-preview"
              onClick={() => document.getElementById("profileInput").click()}
            />
            <input
              type="file"
              id="profileInput"
              accept="image/*"
              hidden
              onChange={handleProfileSelect}
            />
            <p>Upload your profile</p>
          </div>
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
