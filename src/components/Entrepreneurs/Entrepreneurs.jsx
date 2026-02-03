import React, { useEffect, useState } from "react";
import "./Entrepreneurs.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import profileImg from "../../assets/person-logo.png";

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [industryFilter, setIndustryFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("");

  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔐 AUTH CHECK */
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

  /* 📦 FETCH ENTREPRENEURS */
  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        let snapshot = await get(
          ref(db, canViewAll ? "users" : "publicTeamPreview")
        );

        if (!snapshot.exists()) {
          setEntrepreneurs([]);
          setFiltered([]);
          return;
        }

        const data = snapshot.val();

        // normalize field to always be array
        const list = Object.keys(data)
          .map((uid) => {
            const person = data[uid];
            let normalizedField = [];
            if (person.field) {
              normalizedField = Array.isArray(person.field)
                ? person.field
                : [person.field]; // convert string to array
            }
            return {
              id: uid,
              ...person,
              field: normalizedField,
              profileImage: person.profileImage || profileImg,
            };
          })
          .filter(
            (u) => u.profession?.toLowerCase() === "entrepreneur"
          );

        setEntrepreneurs(list);
        setFiltered(list);
      } catch (err) {
        console.error("Entrepreneurs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, [canViewAll]);

  /* 🎯 FILTER LOGIC */
  useEffect(() => {
    let result = entrepreneurs;

    if (industryFilter)
      result = result.filter((e) => e.industry === industryFilter);

    if (companyFilter)
      result = result.filter((e) =>
        e.company?.toLowerCase().includes(companyFilter.toLowerCase())
      );

    if (sizeFilter)
      result = result.filter((e) => e.companySize === sizeFilter);

    if (fieldFilter)
      result = result.filter((e) =>
        e.field.some((f) =>
          f.toLowerCase().includes(fieldFilter.toLowerCase())
        )
      );

    if (websiteFilter)
      result = result.filter((e) =>
        e.website?.toLowerCase().includes(websiteFilter.toLowerCase())
      );

    setFiltered(result);
  }, [
    industryFilter,
    companyFilter,
    sizeFilter,
    fieldFilter,
    websiteFilter,
    entrepreneurs,
  ]);

  /* 💬 MESSAGE EVENT */
  const sendMessage = (uid) => {
    window.dispatchEvent(new CustomEvent("openChat", { detail: uid }));
  };

  const industries = [
    ...new Set(entrepreneurs.map((e) => e.industry).filter(Boolean)),
  ];

  const sizes = [
    ...new Set(entrepreneurs.map((e) => e.companySize).filter(Boolean)),
  ];

  const fields = [
    ...new Set(entrepreneurs.flatMap((e) => e.field || []).filter(Boolean)),
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="entrepreneurs-page">
      <div className="entrepreneurs-header">
        <h2>CIT Alumni Entrepreneurs</h2>

        {/* FILTER BAR */}
        <div className="entrepreneurs-filter-bar">
          <div className="filter-group">
            <label>Industry</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">All</option>
              {industries.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Company</label>
            <input
              value={companyFilter}
              placeholder="Search..."
              onChange={(e) => setCompanyFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Company Size</label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="">All</option>
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Field</label>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
            >
              <option value="">All</option>
              {fields.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Website</label>
            <input
              value={websiteFilter}
              placeholder="Search..."
              onChange={(e) => setWebsiteFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ⭐ GRID */}
      <div className={`entrepreneurs-grid ${!canViewAll ? "blurred" : ""}`}>
        {filtered.map((person) => (
          <div className="entrepreneur-card" key={person.id}>
            <div className="entrepreneur-photo">
              <img src={person.profileImage} alt={person.fullname} />
            </div>

            <div className="entrepreneur-info">
              <h3>{person.fullname}</h3>

              {person.industry && (
                <p>
                  <strong>Industry:</strong> {person.industry}
                </p>
              )}

              {person.companySize && (
                <p>
                  <strong>Company Size:</strong> {person.companySize}
                </p>
              )}

              {person.company && (
                <p>
                  <strong>Company:</strong> {person.company}
                </p>
              )}

              {Array.isArray(person.field) && person.field.length > 0 && (
                <p>
                  <strong>Field:</strong> {person.field.join(", ")}
                </p>
              )}

              {person.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={person.website} target="_blank" rel="noreferrer">
                    {person.website}
                  </a>
                </p>
              )}

              {canViewAll && (
                <button
                  className="website-link"
                  onClick={() => sendMessage(person.id)}
                >
                  Send Message
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ LOCKED OVERLAY */}
      {!canViewAll && (
        <div className="entrepreneurs-overlay">
          <div className="overlay-box">
            <h3>Want to view full entrepreneur details?</h3>
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
