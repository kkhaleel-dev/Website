import React, { useState, useRef, useEffect } from "react";
import "./Signup.scss";
import Favicon from "../assets/Favicon.png";
import DummyLogo from "../assets/person-logo.png";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const phoneRef = useRef(null);

  const currentYear = new Date().getFullYear();

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
    profession: "",
    registrationNumber: "",
    // role: "",
  });

  // Initialize intl-tel-input
  useEffect(() => {
    if (phoneRef.current) {
      const iti = intlTelInput(phoneRef.current, {
        initialCountry: "auto",
        geoIpLookup: (callback) => {
          fetch("https://ipapi.co/json")
            .then((res) => res.json())
            .then((data) => callback(data.country_code))
            .catch(() => callback("us"));
        },
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        separateDialCode: false, // everything in same input
      });

      phoneRef.current.addEventListener("change", () => {
        setForm((prev) => ({ ...prev, mobile: iti.getNumber() }));
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" || name === "batch") {
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Signup logic remains the same...
  const handleSignup = async () => {
    try {
      if (!form.profession) return alert("Please select Profession.");
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      const locationData = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${form.city}, ${form.state}, ${form.country}`
        )}`
      ).then((res) => res.json());

      const { lat, lon } = locationData[0] || { lat: 0, lon: 0 };

      await set(ref(db, `UnapprovedUsers/${cred.user.uid}`), {
        ...form,
        lat,
        lng: lon,
        createdAt: Date.now(),
        approved: false,
        // role: form.role || "user",
        profileImage: profileImage || "",
      });

      await signOut(auth);
      alert("Account created! Please wait for admin approval.");
      navigate("/accounts");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  const branches = ["CSE", "EEE", "MECH", "CIVIL", "ECE", "IT"];
  const batchYears = Array.from({ length: currentYear - 1949 }, (_, i) => 1950 + i);

  return (
    <div className="signup-page">
      <div className="signup-hero">
        <h1>Signup</h1>
      </div>

      <div className="signup-content">
        {/* LEFT CARD */}
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
              onChange={(e) => {
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
                    setProfileImage(canvas.toDataURL("image/jpeg", 0.5));
                  };
                };
                reader.readAsDataURL(file);
              }}
            />
            <p>Upload your profile</p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="signup-card-right">
          <input type="text" name="fullname" placeholder="FULLNAME*" value={form.fullname} onChange={handleChange} />
          <input type="text" name="age" placeholder="AGE" value={form.age} onChange={handleChange} />
          <select name="batch" value={form.batch} onChange={handleChange}>
            <option value="">BATCH</option>
            {batchYears.map((y) => <option key={y}>{y}</option>)}
          </select>
          
          <select name="branch" value={form.branch} onChange={handleChange}>
            <option value="">BRANCH</option>
            {branches.map((b) => <option key={b}>{b}</option>)}
          </select>

          {/* Mobile input with intl-tel-input */}
          <input type="tel" name="mobile" ref={phoneRef} placeholder="MOBILE*" />

          <input type="email" name="email" placeholder="EMAIL*" value={form.email} onChange={handleChange} />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="PASSWORD*"
              value={form.password}
              onChange={handleChange}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <input type="text" name="city" placeholder="CITY*" value={form.city} onChange={handleChange} />
          <input type="text" name="state" placeholder="STATE*" value={form.state} onChange={handleChange} />
          <input type="text" name="country" placeholder="COUNTRY*" value={form.country} onChange={handleChange} />

          <select name="profession" value={form.profession} onChange={handleChange}>
            <option value="">PROFESSION*</option>
            <option value="Employed">Employed</option>
            <option value="Entrepreneur">Entrepreneur</option>
          </select>

          {/* <input type="text" name="role" placeholder="ROLE (Optional)" value={form.role} onChange={handleChange} /> */}
          <input
            type="text"
            name="registrationNumber"
            placeholder="Reg.No. (ID Card)"
            value={form.registrationNumber || ""}
            onChange={handleChange}
          />
          <button className="go" onClick={handleSignup}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
