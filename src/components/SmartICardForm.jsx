import React, { useEffect, useState, useRef } from "react";
import "./SmartICardForm.scss";
import { auth, db } from "../firebase";
import { ref, get, update } from "firebase/database";
import {
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Signup from "../../src/pages/Signup";
import logo from "../assets/Favicon.png";
import personImg from "../assets/person-logo.png";
import { QRCodeSVG } from "qrcode.react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { industryData } from "../data/industryData";

const SmartICardForm = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isApproved = userData?.approved === true;
  const isPaidMember = userData?.isPaidMember === true;
  const [showToast, setShowToast] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  // ===== BATCH YEARS =====
const currentYear = new Date().getFullYear();
const batchYears = Array.from(
  { length: currentYear - 1949 },
  (_, i) => 1950 + i
);

// ===== BRANCH LIST =====
const branches = [
  "CSE","IT","ECE","EEE","MECH","CIVIL","AERO","BIOTECH",
  "CHEMICAL","PETRO","INDUSTRIAL","TEXTILE","FASHION",
  "AUTOMOBILE","MINING","METALLURGY","ARCHITECTURE",
  "PHARMACY","NURSING","AGRICULTURE","LAW","MANAGEMENT",
  "HOSPITALITY","FOOD TECHNOLOGY","ENVIRONMENTAL",
  "DEFENSE","SPACE SCIENCE","DATA SCIENCE","AI/ML",
  "ROBOTICS","CYBERSECURITY","SOFTWARE ENGINEERING",
  "GAME DESIGN","CLOUD COMPUTING","BLOCKCHAIN"
];

// ===== INDUSTRY OPTIONS =====
const industryOptions = Object.keys(industryData).map(ind => ({
  value: ind,
  label: ind
}));

const fieldOptions =
  editData.industry && industryData[editData.industry]
    ? industryData[editData.industry].map(f => ({
        value: f,
        label: f
      }))
    : [];


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          if (data.role === "admin") setIsAdmin(true);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <Signup />;

  const profileImage =
    userData.profileImage && userData.profileImage.trim() !== ""
      ? userData.profileImage
      : personImg;

  const openEdit = () => {
    setEditData({ ...userData });
    setImagePreview(userData.profileImage || "");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditOpen(true);
  };

  const closeEdit = () => setEditOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const compressImage = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let scale = Math.sqrt(20000 / file.size);
          scale = Math.min(scale, 1);

          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
      reader.readAsDataURL(file);
    });

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImagePreview(compressed);
    setEditData((prev) => ({ ...prev, profileImage: compressed }));
  };
  // ===== LOCATION LOADERS =====

const loadCountryOptions = async (inputValue) => {
  if (!inputValue) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(inputValue)}`
  );
  const data = await res.json();
  return data.map(item => ({
    label: item.display_name.split(",")[0],
    value: item.display_name.split(",")[0],
  }));
};

const loadStateOptions = async (inputValue) => {
  if (!inputValue || !editData.country) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&country=${encodeURIComponent(editData.country)}&limit=7&q=${encodeURIComponent(inputValue)}`
  );
  const data = await res.json();
  return data
    .filter(item => item.address?.state)
    .map(item => ({
      label: item.address.state,
      value: item.address.state,
    }));
};

const loadCityOptions = async (inputValue) => {
  if (!inputValue) return [];
  const query = `${inputValue}${editData.state ? ", " + editData.state : ""}${editData.country ? ", " + editData.country : ""}`;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data
    .filter(item => item.address?.city || item.address?.town)
    .map(item => {
      const city = item.address.city || item.address.town;
      return {
        label: city,
        value: city,
        city,
        state: item.address.state,
        country: item.address.country,
        lat: item.lat,
        lng: item.lng
      };
    });
};


  // const saveProfile = async () => {
  //   try {
  //     if (newPassword || confirmPassword) {
  //       if (!oldPassword) {
  //         alert("Enter old password");
  //         return;
  //       }
  //       if (newPassword !== confirmPassword) {
  //         alert("Passwords do not match");
  //         return;
  //       }

  //       const user = auth.currentUser;
  //       const credential = EmailAuthProvider.credential(
  //         user.email,
  //         oldPassword
  //       );
  //       await reauthenticateWithCredential(user, credential);
  //       await updatePassword(user, newPassword);
  //     }

  //     const userRef = ref(db, `users/${auth.currentUser.uid}`);
  //     const { password, ...safeData } = editData; // never store password

  //     // Convert field to array if comma separated (optional)
  //     if (safeData.field && typeof safeData.field === "string") {
  //       safeData.field = safeData.field
  //         .split(",")
  //         .map((f) => f.trim())
  //         .filter((f) => f !== "");
  //     }

  //     await update(userRef, safeData);
  //     setUserData(safeData);
  //     alert("Profile updated successfully!");
  //     closeEdit();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update profile");
  //   }
  // };
const saveProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("User not authenticated");
      return;
    }

    // 🔐 PASSWORD UPDATE
    if (newPassword || confirmPassword) {
      if (!oldPassword) {
        alert("Enter old password");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    }

    const uid = user.uid;
    const userRef = ref(db, `users/${uid}`);

    const { password, ...safeData } = editData;

    // convert field to array
    if (safeData.field && typeof safeData.field === "string") {
      safeData.field = safeData.field
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== "");
    }

    // ✅ UPDATE USER TABLE
    await update(userRef, safeData);

    // ✅ UPDATE LOCAL STATE IMMEDIATELY
    setUserData((prev) => ({
      ...prev,
      ...safeData,
    }));

    // ⭐ SYNC publicProfiles safely
    if (userData?.membershipId) {
      const publicProfileRef = ref(
        db,
        `publicProfiles/${userData.membershipId}`
      );

      // Only push fields that belong to public profile
      const publicSyncData = {
        fullname: safeData.fullname,
        age: safeData.age,
        batch: safeData.batch,
        branch: safeData.branch,
        mobile: safeData.mobile,
        email: safeData.email,
        city: safeData.city,
        state: safeData.state,
        country: safeData.country,
        lat: safeData.lat,
        lng: safeData.lng,
        profession: safeData.profession,
        website: safeData.website,
        industry: safeData.industry,
        company: safeData.company,
        companySize: safeData.companySize,
        field: safeData.field,
        profileImage: safeData.profileImage
      };

      // Remove undefined fields to avoid overwriting with null
      Object.keys(publicSyncData).forEach(key => {
        if (publicSyncData[key] === undefined) {
          delete publicSyncData[key];
        }
      });

      await update(publicProfileRef, publicSyncData);
    }

    alert("Profile updated successfully!");
    closeEdit();

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    alert(err.message || "Failed to update profile");
  }
};


  return (
    <>
      <div className="smart-i-card-container">
        <h2>Smart ID Card</h2>

        {isAdmin && (
          <button
            className="admin-users-btn"
            onClick={() => (window.location.href = "/admin/users")}
          >
            Users Management
          </button>
        )}

        <button className="edit-profile-btn" onClick={openEdit}>
          Edit Profile
        </button>

        <div className="smart-i-card-wrapper">
          <div className="card left-card">
            <div className="card-content">
              <img src={logo} alt="Logo" className="logo" />
              <img
                src={profileImage}
                alt="User"
                className="person-img"
                onError={(e) => (e.target.src = personImg)}
              />
              <p className="name">Name: {userData.fullname}</p>
              <p className="branch">Branch: {userData.branch}</p>
              {isApproved && isPaidMember && (
                <p className="membership">Membership ID: {userData.membershipId}</p>
              )}

            </div>
          </div>

          {isApproved && isPaidMember ? (
          <div className="card right-card">
            <div className="card-content">
              <p>
                <strong>Year of Passing:</strong> {userData.batch}
              </p>
              <p>
                <strong>Mobile No:</strong> {userData.mobile}
              </p>

              <QRCodeSVG
                value={`https://citacc.com/scan/${userData.membershipId}`}
                size={160}
                includeMargin
              />
              <p className="website">www.citacc.com</p>
            </div>
          </div>
          ):(
            <>
              <div className="card right-card unpaid">
                <div className="card-content">
                  <p className="membership-required">
                    Membership Required
                  </p>

                  <p className="membership-message">
                    You are an approved user, but you have not taken the paid
                    membership yet.
                  </p>

                  <p className="membership-message">
                    Please contact admin to activate your Smart ID Card and
                    unlock all lifetime benefits.
                  </p>

                  <div className="membership-highlight">
                    One-time payment · Lifetime access <br />
                   <button
                      className="subscribe-btn"
                      onClick={() => {
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3500);
                      }}
                    >
                    $35 <span>Subscribe Now</span>
                    </button>

                    <p className="secure-text">🔒 One-time payment · Lifetime access</p>
                  </div>

                  <p className="membership-cta">
                    Smart ID Card + all collaborated offers
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        {showToast && (
          <div className="subscribe-toast">
            💬 Please contact <strong>CIT Super Admin</strong> via chat
          </div>
        )}


        {editOpen && (
          <div className="edit-popup">
            <div className="edit-content">
              <h3>Edit Profile</h3>

              <div className="edit-form">
                <div
                  className="profile-image-upload"
                  onClick={() => fileInputRef.current.click()}
                >
                  <img src={imagePreview || personImg} alt="Preview" />
                  <span>{imagePreview ? "Replace Image" : "Attach Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                  />
                </div>

                <label>
                  Full Name:
                  <input
                    type="text"
                    name="fullname"
                    value={editData.fullname || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Age:
                  <input
                    type="number"
                    name="age"
                    value={editData.age || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Mobile:
                  <input
                    type="text"
                    name="mobile"
                    value={editData.mobile || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Branch:
                  <Select
                    options={branches.map(b => ({ value: b, label: b }))}
                    value={editData.branch ? { value: editData.branch, label: editData.branch } : null}
                    onChange={(selected) =>
                      setEditData(prev => ({
                        ...prev,
                        branch: selected?.value || ""
                      }))
                    }
                    isClearable
                  />

                </label>

                <label>
                  Batch:
                  <select
                    name="batch"
                    value={editData.batch || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Batch</option>
                    {batchYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                </label>

                <label>
                  City:
                 <AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadCityOptions}
  value={editData.city ? { label: editData.city, value: editData.city } : null}
  onChange={(selected) =>
    setEditData(prev => ({
      ...prev,
      city: selected?.value || "",
      state: selected?.state || prev.state,
      country: selected?.country || prev.country,
      lat: selected?.lat? parseFloat(selected.lat) : prev.lat,
      lng: selected?.lng? parseFloat(selected.lng) : prev.lng,
    }))
  }
  isClearable
/>

                </label>

                <label>
                  State:
                 <AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadStateOptions}
  value={editData.state ? { label: editData.state, value: editData.state } : null}
  onChange={(selected) =>
    setEditData(prev => ({
      ...prev,
      state: selected?.value || ""
    }))
  }
  isClearable
/>

                </label>

                <label>
                  Country:
               <AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadCountryOptions}
  value={editData.country ? { label: editData.country, value: editData.country } : null}
  onChange={(selected) =>
    setEditData(prev => ({
      ...prev,
      country: selected?.value || ""
    }))
  }
  isClearable
/>

                </label>

                <label>
                  Profession:
                 <select
  name="profession"
  value={editData.profession || ""}
  onChange={(e) =>
    setEditData((prev) => ({
      ...prev,
      profession: e.target.value,
      industry: "",
      field: "",
      companySize: "",
    }))
  }
>
  <option value="">Select Profession</option>
  <option value="Employed">Employed</option>
  <option value="Entrepreneur">Entrepreneur</option>
</select>

                </label>

                {/* ===== Entrepreneur Fields ===== */}
              {/* ===== INDUSTRY (For Both Employed & Entrepreneur) ===== */}
{editData.profession && (
  <label>
    Industry:
    <Select
      options={industryOptions}
      value={
        editData.industry
          ? { value: editData.industry, label: editData.industry }
          : null
      }
      onChange={(selected) =>
        setEditData((prev) => ({
          ...prev,
          industry: selected?.value || "",
          field: "",
        }))
      }
      isClearable
    />
  </label>
)}

{/* ===== FIELD (For Both Employed & Entrepreneur) ===== */}
{editData.profession && editData.industry && (
  <label>
    Field / Specialization:
    <Select
      options={fieldOptions}
      value={
        editData.field
          ? { value: editData.field, label: editData.field }
          : null
      }
      onChange={(selected) =>
        setEditData((prev) => ({
          ...prev,
          field: selected?.value || "",
        }))
      }
      isClearable
    />
  </label>
)}

{/* ===== COMPANY NAME (Both can have it if needed) ===== */}
{editData.profession && (
  <label>
    Company Name:
    <input
      type="text"
      name="company"
      value={editData.company || ""}
      onChange={handleChange}
    />
  </label>
)}

{/* ===== COMPANY SIZE (Only Entrepreneur) ===== */}
{editData.profession === "Entrepreneur" && (
  <label>
    Company Size:
    <select
      name="companySize"
      value={editData.companySize || ""}
      onChange={handleChange}
    >
      <option value="">Company Size</option>
      <option value="1-10">1-10</option>
      <option value="11-50">11-50</option>
      <option value="51-200">51-200</option>
      <option value="200+">200-1000</option>
      <option value="1000+">1000+</option>
    </select>
  </label>
)}


                <label>
                  Website:
                  <input
                    type="text"
                    name="website"
                    value={editData.website || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Old Password:
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </label>

                <label>
                  New Password:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>

                <label>
                  Confirm New Password:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>

                <div className="edit-actions">
                  <button onClick={saveProfile}>Update Profile</button>
                  <button onClick={closeEdit} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="smart-offers">
        <h3>Membership Offers</h3>
        <div className="offers-container">
          <div className="offers-ticker">
            <div className="ticker-track">
              <span>🎁 Alumni Store — Flat 20% OFF</span>
              <span>🍽️ Partner Restaurants — Member Exclusive Deals</span>
              <span>🎫 Events & Workshops — Priority Access</span>
              <span>💳 Renewal Cashback — Earn Rewards</span>
              <span>📢 Career Alerts — Alumni Hiring Updates</span>

              {/* duplicate for smooth loop */}
              <span>🎁 Alumni Store — Flat 20% OFF</span>
              <span>🍽️ Partner Restaurants — Member Exclusive Deals</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartICardForm;
