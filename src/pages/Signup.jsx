import React, { useState } from "react";
import "./Signup.scss";
import Favicon from "../assets/Favicon.png";
import DummyLogo from "../assets/person-logo.png";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import { industryData } from "../data/industryData";
import AsyncSelect from "react-select/async";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [cityOptions, setCityOptions] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age" || name === "batch") {
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
      return;
    }

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

const branches = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "AERO",
  "BIOTECH",
  "CHEMICAL",
  "PETRO",
  "INDUSTRIAL",
  "TEXTILE",
  "FASHION",
  "AUTOMOBILE",
  "MINING",
  "METALLURGY",
  "ARCHITECTURE",
  "PHARMACY",
  "NURSING",
  "AGRICULTURE",
  "LAW",
  "MANAGEMENT",
  "HOSPITALITY",
  "FOOD TECHNOLOGY",
  "ENVIRONMENTAL",
  "DEFENSE",
  "SPACE SCIENCE",
  "DATA SCIENCE",
  "AI/ML",
  "ROBOTICS",
  "CYBERSECURITY",
  "SOFTWARE ENGINEERING",
  "GAME DESIGN",
  "CLOUD COMPUTING",
  "BLOCKCHAIN"
];

const batchYears = Array.from({ length: currentYear - 1949 }, (_, i) => 1950 + i);

  const industryOptions = Object.keys(industryData).map((ind) => ({ value: ind, label: ind }));
  const fieldOptions =
    form.industry && industryData[form.industry]
      ? industryData[form.industry].map((f) => ({ value: f, label: f }))
      : [];

  // Custom styles for react-select to fix width
  const selectStyles = {
    container: (provided) => ({ ...provided, maxWidth: "400px", width: "100%" }),
    control: (provided) => ({
      ...provided,
      fontSize: "14px",
      fontFamily: "inherit",
      minHeight: "40px",
    }),
    menu: (provided) => ({ ...provided, width: "250px" }),
    singleValue: (provided) => ({ ...provided, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }),
  };
// const loadCountryOptions = async (inputValue) => {
//   if (!inputValue || inputValue.length < 2) return [];

//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&featuretype=country&limit=5&q=${encodeURIComponent(inputValue)}`
//     );

//     const data = await res.json();

//     return data
//       .filter(item => item.address?.country)
//       .map((item) => ({
//         label: item.address.country,
//         value: item.address.country,
//       }));
//   } catch {
//     return [];
//   }
// };
// const loadStateOptions = async (inputValue) => {
//   if (!inputValue || !form.country || inputValue.length < 2) return [];

//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&country=${encodeURIComponent(form.country)}&featuretype=state&limit=10&q=${encodeURIComponent(inputValue)}`
//     );

//     const data = await res.json();

//     return data
//       .filter(item => item.address?.state)
//       .map((item) => ({
//         label: item.address.state,
//         value: item.address.state,
//       }));
//   } catch {
//     return [];
//   }
// };
// const loadCityOptions = async (inputValue) => {
//   if (!inputValue || inputValue.length < 2) return [];

//   try {
//     const query = form.state && form.country
//       ? `${inputValue}, ${form.state}, ${form.country}`
//       : inputValue;

//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(query)}`
//     );

//     const data = await res.json();

//     return data
//       .filter(item =>
//         item.address?.city ||
//         item.address?.town ||
//         item.address?.village
//       )
//       .map((item) => {
//         const cityName =
//           item.address.city ||
//           item.address.town ||
//           item.address.village;

//         return {
//           label: cityName,
//           value: cityName,
//           city: cityName,
//           state: item.address.state || "",
//           country: item.address.country || "",
//           lat: item.lat,
//           lon: item.lon,
//         };
//       });
//   } catch {
//     return [];
//   }
// };
// //workig all

// ================= COUNTRY =================
const loadCountryOptions = async (inputValue) => {
  if (!inputValue) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(inputValue)}`,
      {
        headers: {
          "Accept-Language": "en"
        }
      }
    );

    const data = await res.json();

    return data
      .filter(
        (item) =>
          item.type === "administrative" ||
          item.type === "country"
      )
      .map((item) => ({
        label: item.display_name.split(",")[0],
        value: item.display_name.split(",")[0],
      }));
  } catch (err) {
    console.error("Country error:", err);
    return [];
  }
};


// ================= STATE =================
const loadStateOptions = async (inputValue) => {
  if (!inputValue || !form.country) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&country=${encodeURIComponent(form.country)}&limit=7&q=${encodeURIComponent(inputValue)}`,
      {
        headers: {
          "Accept-Language": "en"
        }
      }
    );

    const data = await res.json();

    return data
      .filter((item) => item.address?.state)
      .map((item) => ({
        label: item.address.state,
        value: item.address.state,
      }));
  } catch (err) {
    console.error("State error:", err);
    return [];
  }
};


// ================= CITY =================
const loadCityOptions = async (inputValue) => {
  if (!inputValue) return [];

  try {
    const query = `${inputValue}${
      form.state ? ", " + form.state : ""
    }${form.country ? ", " + form.country : ""}`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(query)}`,
      {
        headers: {
          "Accept-Language": "en"
        }
      }
    );

    const data = await res.json();

    return data
      .filter(
        (item) =>
          item.address?.city ||
          item.address?.town ||
          item.address?.village
      )
      .map((item) => {
        const city =
          item.address.city ||
          item.address.town ||
          item.address.village;

        return {
          label: city,
          value: city,
          city: city,
          state: item.address.state,
          country: item.address.country,
          lat: item.lat,
          lon: item.lon,
        };
      });
  } catch (err) {
    console.error("City error:", err);
    return [];
  }
};


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
          <input name="fullname" placeholder="FULLNAME*" value={form.fullname} onChange={handleChange} />
          <input name="age" placeholder="AGE" value={form.age} onChange={handleChange} />

          <select name="batch" value={form.batch} onChange={handleChange}>
            <option value="">BATCH</option>
            {batchYears.map((y) => <option key={y}>{y}</option>)}
          </select>

          <Select
            options={branches.map((b) => ({ value: b, label: b }))}
            value={form.branch ? { value: form.branch, label: form.branch } : null}
            onChange={(selected) => setForm({ ...form, branch: selected?.value || "" })}
            placeholder="BRANCH/STREAM"
            isSearchable
            styles={selectStyles}
          />


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

{/* CITY */}
<AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadCityOptions}
  placeholder="CITY*"
  value={form.city ? { label: form.city, value: form.city } : null}
  onChange={(selected) => {
    if (!selected) return;

    setForm({
      ...form,
      city: selected.city,
      state: selected.state,
      country: selected.country,
      lat: selected.lat,
      lng: selected.lon
    });
  }}
  styles={selectStyles}
  isClearable
/>

{/* STATE */}
<AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadStateOptions}
  placeholder="STATE*"
  value={form.state ? { label: form.state, value: form.state } : null}
  onChange={(selected) => {
    setForm({
      ...form,
      state: selected?.value || "",
      city: ""
    });
  }}
  styles={selectStyles}
  isClearable
/>

      {/* COUNTRY */}
<AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadCountryOptions}
  placeholder="COUNTRY*"
  value={form.country ? { label: form.country, value: form.country } : null}
  onChange={(selected) => {
    setForm({
      ...form,
      country: selected?.value || "",
      state: "",
      city: ""
    });
  }}
  styles={selectStyles}
  isClearable
/>


          <select name="profession" value={form.profession} onChange={handleChange}>
            <option value="">PROFESSION*</option>
            <option value="Employed">Employed</option>
            <option value="Entrepreneur">Entrepreneur</option>
          </select>

          {/* INDUSTRY SELECT */}
          {form.profession && (
            <Select
              options={[...industryOptions, { value: "Others", label: "Others" }]}
              value={form.industry ? { value: form.industry, label: form.industry } : null}
              onChange={(selected) => {
                const ind = selected?.value || "";
                setForm({ ...form, industry: ind, field: "" });
              }}
              placeholder="INDUSTRY*"
              isSearchable
              styles={selectStyles}
            />
          )}

          {/* FIELD SELECT / INPUT */}
          {form.industry && form.industry !== "Others" && (
            <Select
              options={[...fieldOptions, { value: "Others", label: "Others" }]}
              value={form.field ? { value: form.field, label: form.field } : null}
              onChange={(selected) => {
                const fld = selected?.value || "";
                setForm({ ...form, field: fld });
              }}
              placeholder="FIELD OF WORK*"
              isSearchable
              styles={selectStyles}
            />
          )}

          {form.industry === "Others" || form.field === "Others" ? (
            <input
              name="field"
              placeholder="ENTER YOUR FIELD OF WORK*"
              value={form.field}
              onChange={handleChange}
              style={{ maxWidth: "400px", marginTop: "8px" }}
            />
          ) : null}

          {form.profession && (
            <input
              name="company"
              placeholder="COMPANY NAME*"
              value={form.company}
              onChange={handleChange}
            />
          )}

          {form.profession === "Entrepreneur" && (
            <select name="companySize" value={form.companySize} onChange={handleChange}>
              <option value="">COMPANY SIZE*</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200-1000</option>
              <option value="1000+">1000+</option>
            </select>
          )}

          <input name="website" placeholder="Website" value={form.website} onChange={handleChange} />

          <button className="go" onClick={handleSignup}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
