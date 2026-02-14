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
    website: "",
    profession: "",
    industry: "",
    company: "",
    companySize: "",
    field: "",
  });

  /* INDUSTRY → FIELD MAPPING */
  const industryFields = {
    IT: ["AI", "Developer", "Cyber Security", "Cloud", "Data Science"],
    Finance: ["Banking", "Investment", "Accounting", "FinTech"],
    Healthcare: ["Doctor", "Pharma", "Medical Tech"],
    Manufacturing: ["Production", "Operations", "Quality Control"],
    Education: ["Professor", "Trainer", "Researcher"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age" || name === "batch") {
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
      return;
    }

    /* RESET WHEN PROFESSION CHANGES */
    if (name === "profession") {
      setForm({
        ...form,
        profession: value,
        industry: "",
        field: "",
        company: "",
        companySize: "",
      });
      return;
    }

    /* RESET FIELD WHEN INDUSTRY CHANGES */
    if (name === "industry") {
      setForm({
        ...form,
        industry: value,
        field: "",
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSignup = async () => {
    try {
      if (!form.fullname) return alert("Please enter Fullname.");
      if (!form.email) return alert("Please enter Email.");
      if (!form.mobile) return alert("Please enter your mobile number.");
      if (!form.password) return alert("Please enter Password.");
      if (!form.city) return alert("Please enter City.");
      if (!form.state) return alert("Please enter State.");
      if (!form.country) return alert("Please enter Country.");
      if (!form.profession) return alert("Please select Profession.");
      if (!form.industry) return alert("Please select Industry.");
      if (!form.field) return alert("Please enter Field of Work.");
      if (!form.company) return alert("Please enter Company Name.");
      if (form.profession === "Entrepreneur" && !form.companySize)
        return alert("Please select Company Size.");

      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

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
  const batchYears = Array.from(
    { length: currentYear - 1949 },
    (_, i) => 1950 + i
  );

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
              onClick={() =>
                document.getElementById("profileInput").click()
              }
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
                    setProfileImage(
                      canvas.toDataURL("image/jpeg", 0.5)
                    );
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
          <input name="fullname" placeholder="FULLNAME*" value={form.fullname} onChange={handleChange} />
          <input name="age" placeholder="AGE" value={form.age} onChange={handleChange} />
          
          <select name="batch" value={form.batch} onChange={handleChange}>
            <option value="">BATCH</option>
            {batchYears.map((y) => <option key={y}>{y}</option>)}
          </select>

          <select name="branch" value={form.branch} onChange={handleChange}>
            <option value="">BRANCH</option>
            {branches.map((b) => <option key={b}>{b}</option>)}
          </select>

          <input type="tel" name="mobile" placeholder="MOBILE*" value={form.mobile} onChange={handleChange} />
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

          <input name="city" placeholder="CITY*" value={form.city} onChange={handleChange} />
          <input name="state" placeholder="STATE*" value={form.state} onChange={handleChange} />
          <input name="country" placeholder="COUNTRY*" value={form.country} onChange={handleChange} />

          {/* PROFESSION */}
          <select name="profession" value={form.profession} onChange={handleChange}>
            <option value="">PROFESSION*</option>
            <option value="Employed">Employed</option>
            <option value="Entrepreneur">Entrepreneur</option>
          </select>

          {/* INDUSTRY */}
          {form.profession && (
            <select name="industry" value={form.industry} onChange={handleChange}>
              <option value="">INDUSTRY*</option>
              {Object.keys(industryFields).map((key) => (
                <option key={key}>{key}</option>
              ))}
              <option value="Others">Others</option>
            </select>
          )}

          {/* FIELD */}
          {form.industry === "Others" && (
            <input
              name="field"
              placeholder="ENTER YOUR FIELD OF WORK*"
              value={form.field}
              onChange={handleChange}
            />
          )}

          {form.industry && form.industry !== "Others" && (
            <>
              <select name="field" value={form.field} onChange={handleChange}>
                <option value="">FIELD OF WORK*</option>
                {industryFields[form.industry]?.map((f) => (
                  <option key={f}>{f}</option>
                ))}
                <option value="Others">Others</option>
              </select>

              {form.field === "Others" && (
                <input
                  name="field"
                  placeholder="ENTER YOUR FIELD OF WORK*"
                  onChange={handleChange}
                />
              )}
            </>
          )}

          {/* COMPANY */}
          {form.profession && (
            <input
              name="company"
              placeholder="COMPANY NAME*"
              value={form.company}
              onChange={handleChange}
            />
          )}

          {/* COMPANY SIZE (Entrepreneur Only) */}
          {form.profession === "Entrepreneur" && (
            <select
              name="companySize"
              value={form.companySize}
              onChange={handleChange}
            >
              <option value="">COMPANY SIZE*</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200-1000</option>
              <option value="1000+">1000+</option>
            </select>
          )}

          <input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
          />

          <button className="go" onClick={handleSignup}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
