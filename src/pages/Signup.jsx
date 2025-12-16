import React, { useState } from "react";
import "./Signup.scss";
import Favicon from "../assets/Favicon.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set, get } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

      await set(ref(db, `users/${cred.user.uid}`), {
        ...form,
        membershipId,
        createdAt: Date.now(),
      });

      alert("Account created successfully");
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
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key.toUpperCase()}
              value={form[key]}
              onChange={handleChange}
            />
          ))}

          <button className="go" onClick={handleSignup}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
