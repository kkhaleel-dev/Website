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
    if (newPassword || confirmPassword) {
      if (!oldPassword) {
        alert("Enter old password");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    }

    const uid = auth.currentUser.uid;
    const userRef = ref(db, `users/${uid}`);

    const { password, ...safeData } = editData;

    // Convert field string to array
    if (safeData.field && typeof safeData.field === "string") {
      safeData.field = safeData.field
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== "");
    }

    // ✅ UPDATE users table (existing behaviour)
    await update(userRef, safeData);

    // ⭐ FETCH membershipId from updated user
    const snap = await get(userRef);
    if (!snap.exists()) return;

    const updatedUser = snap.val();
    const membershipId = updatedUser.membershipId;

    // ⭐ SYNC publicProfiles WITHOUT REMOVING ANY EXISTING FIELD
    if (membershipId) {
      const publicProfileRef = ref(
        db,
        `publicProfiles/${membershipId}`
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

      // ⭐ MERGE update (adds missing fields + updates existing)
      await update(publicProfileRef, publicSyncData);
    }

    setUserData(prev => ({ ...prev, ...safeData }));
    alert("Profile updated successfully!");
    closeEdit();

  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
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
                  <input
                    type="text"
                    name="branch"
                    value={editData.branch || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Batch:
                  <input
                    type="text"
                    name="batch"
                    value={editData.batch || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  City:
                  <input
                    type="text"
                    name="city"
                    value={editData.city || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  State:
                  <input
                    type="text"
                    name="state"
                    value={editData.state || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Country:
                  <input
                    type="text"
                    name="country"
                    value={editData.country || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Profession:
                  <select
                    name="profession"
                    value={editData.profession || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Profession</option>
                    <option value="Employed">Employed</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                  </select>
                </label>

                {/* ===== Entrepreneur Fields ===== */}
                {editData.profession === "Entrepreneur" && (
                  <>
                    <label>
                      Company Name:
                      <input
                        type="text"
                        name="company" // fixed: match DB key
                        value={editData.company || ""}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Industry:
                      <input
                        type="text"
                        name="industry"
                        value={editData.industry || ""}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Field / Specialization (comma separated):
                      <input
                        type="text"
                        name="field"
                        value={
                          Array.isArray(editData.field)
                            ? editData.field.join(", ")
                            : editData.field || ""
                        }
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Company Size:
                      <input
                        type="text"
                        name="companySize"
                        value={editData.companySize || ""}
                        onChange={handleChange}
                      />
                    </label>
                  </>
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
