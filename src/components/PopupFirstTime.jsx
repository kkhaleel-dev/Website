import React, { useState, useEffect } from "react";
import "./PopupFirstTime.scss";
import { auth, db } from "../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { ref, get, update } from "firebase/database";

const PopupFirstTime = ({ onClose }) => {
  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* LOAD PROFILE */
  useEffect(() => {
    const loadUser = async () => {
      if (!auth.currentUser) return;

      const snap = await get(ref(db, `users/${auth.currentUser.uid}`));
      if (snap.exists()) {
        const data = snap.val();
        setFullname(data.fullname || "");
        setAge(data.age || "");
      }
    };

    loadUser();
  }, []);

  /* UPDATE PASSWORD + AGE */
  const handleUpdate = async () => {
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const user = auth.currentUser;

      /* REAUTH IF PASSWORD CHANGED */
      if (newPassword) {
        const cred = EmailAuthProvider.credential(
          user.email,
          oldPassword
        );

        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPassword);
      }

      /* UPDATE AGE */
      await update(ref(db, `users/${user.uid}`), {
        age: age,
        firstLoginPopupShown: true,
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* CANCEL */
  const handleCancel = async () => {
    if (auth.currentUser) {
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        firstLoginPopupShown: true,
      });
    }
    onClose();
  };

  return (
    <div className="first-popup-overlay">
      <div className="first-popup-card">
        <h2>Welcome 👋</h2>
        <p>Please update your profile & password (optional)</p>

        <label>Name</label>
        <input value={fullname} disabled />

        <label>Age</label>
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <div className="popup-actions">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>

          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupFirstTime;
