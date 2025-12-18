import React, { useState } from "react";
import "./Signup.scss";
import Favicon from "../assets/Favicon.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set, get } from "firebase/database";
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
    country: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ FREE geocoding (NO API KEY)
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

  const generateMembershipId = async () => {
    const counterRef = ref(db, "membershipCounter");
    const snap = await get(counterRef);
    const count = snap.exists() ? snap.val() + 1 : 1;
    await set(counterRef, count);
    return `LTM${String(count).padStart(4, "0")}`;
  };

  const handleSignup = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const membershipId = await generateMembershipId();
    const locationData = await getLatLng(form.city, form.state, form.country);

    await set(ref(db, `users/${cred.user.uid}`), {
      ...form,
      lat: locationData.lat,
      lng: locationData.lng,
      membershipId,
      createdAt: Date.now(),
      approved: false,
      role: "user",
    });

    alert("Account created successfully. Please wait for admin approval.");
    navigate("/accounts");

  } catch (err) {
    // 🔥 HANDLE DUPLICATE EMAIL ERROR
    if (err.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please contact the admin.");
    } 
    else if (err.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    }
    else if (err.code === "auth/weak-password") {
      alert("Password must be at least 6 characters.");
    }
    else {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  }
};

  // const handleSignup = async () => {
  //   try {
  //     const cred = await createUserWithEmailAndPassword(
  //       auth,
  //       form.email,
  //       form.password
  //     );

  //     const membershipId = await generateMembershipId();

  //     // 📍 convert city/state/country → lat/lng
  //     const locationData = await getLatLng(form.city, form.state, form.country);

  //     await set(ref(db, `users/${cred.user.uid}`), {
  //       ...form,
  //       lat: locationData.lat,
  //       lng: locationData.lng,
  //       membershipId,
  //       createdAt: Date.now(),
  //       approved: false,
  //       role: "user", 
  //     });

  //     alert("Account created successfully");
  //     navigate("/accounts");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

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
