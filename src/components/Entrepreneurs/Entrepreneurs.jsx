import React, { useEffect, useState } from "react";
import "./Entrepreneurs.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import profileImg from "../../assets/person-logo.png";

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔐 Auth & approval check (same as AlumniDirectory) */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCanViewAll(false);
        return;
      }

      const snap = await get(ref(db, `users/${user.uid}`));
      const data = snap.val();

      if (data?.approved === true || data?.role === "admin") {
        setCanViewAll(true);
      } else {
        setCanViewAll(false);
      }
    });

    return () => unsub();
  }, []);

  /* 📦 Fetch entrepreneurs only */
  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        let snapshot;

        if (canViewAll) {
          snapshot = await get(ref(db, "users"));
        } else {
          snapshot = await get(ref(db, "publicTeamPreview"));
        }

        if (!snapshot.exists()) {
          setEntrepreneurs([]);
          return;
        }

        const data = snapshot.val();

        const list = Object.keys(data)
          .map((uid) => ({
            id: uid,
            fullname: data[uid].fullname || "Unnamed",
            profession: data[uid].profession || "",
            company: data[uid].company || "",
            industry: data[uid].industry || "",
            email: data[uid].email || "",
            website: data[uid].website || "",
            city: data[uid].city || "",
            state: data[uid].state || "",
            country: data[uid].country || "",
            profileImage: data[uid].profileImage || profileImg,
          }))
          // ✅ FILTER ONLY ENTREPRENEURS
          .filter(
            (user) =>
              user.profession &&
              user.profession.toLowerCase() === "entrepreneur"
          );

        setEntrepreneurs(list);
      } catch (err) {
        console.error("Entrepreneurs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, [canViewAll]);

  if (loading) return <p className="entrepreneurs-loading">Loading entrepreneurs...</p>;

  return (
    <div className="entrepreneurs-page">
      <h2>CIT Alumni Entrepreneurs</h2>

      <div className={`entrepreneurs-grid ${!canViewAll ? "blurred" : ""}`}>
        {entrepreneurs.map((person) => (
          <div className="entrepreneur-card" key={person.id}>
            <div className="entrepreneur-photo">
              <img src={person.profileImage} alt={person.fullname} />
            </div>

            <div className="entrepreneur-info">
              <h3>{person.fullname}</h3>

              {person.company && (
                <p>
                  <strong>Company:</strong> {person.company}
                </p>
              )}

              {person.industry && (
                <p>
                  <strong>Industry:</strong> {person.industry}
                </p>
              )}

              <p>
                <strong>Location:</strong>{" "}
                {person.city}, {person.state}, {person.country}
              </p>

              {canViewAll && person.email && (
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${person.email}`}>
                    {person.email}
                  </a>
                </p>
              )}

              {canViewAll && person.website && (
                <p>
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noreferrer"
                    className="website-link"
                  >
                    Visit Website
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!canViewAll && (
        <div className="entrepreneurs-overlay">
  <div className="overlay-box">
    <h3>Want to connect with alumni entrepreneurs?</h3>
    <p>Login / Signup & get approved to unlock full access</p>
    <button onClick={() => (window.location.href = "/accounts")}>
      Login / Signup
    </button>
  </div>
</div>

      )}
    </div>
  );
};

export default Entrepreneurs;
