import React, { useEffect, useState } from "react";
import "./Entrepreneurs.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import profileImg from "../../assets/person-logo.png";
import { industryData } from "../../data/industryData"; // ✅ SAME AS SIGNUP
import Select from "react-select";

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [industryFilter, setIndustryFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("");

  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ✅ STATIC INDUSTRIES (FROM SIGNUP industryData) */
  const industries = Object.keys(industryData);

  /* ✅ STATIC COMPANY SIZE (EXACT SAME AS SIGNUP) */
  const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "200-1000",
    "1000+",
  ];

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
        const snapshot = await get(
          ref(db, canViewAll ? "users" : "publicTeamPreview")
        );

        if (!snapshot.exists()) {
          setEntrepreneurs([]);
          setFiltered([]);
          return;
        }

        const data = snapshot.val();

        const list = Object.keys(data)
          .map((uid) => {
            const person = data[uid];

            let normalizedField = [];
            if (person.field) {
              normalizedField = Array.isArray(person.field)
                ? person.field
                : [person.field];
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

    if (fieldFilter)
      result = result.filter((e) =>
        e.field.includes(fieldFilter)
      );

    if (companyFilter)
      result = result.filter((e) =>
        e.company?.toLowerCase().includes(companyFilter.toLowerCase())
      );

    if (sizeFilter) {
      result = result.filter((e) => e.companySize === sizeFilter);
    }

    if (websiteFilter)
      result = result.filter((e) =>
        e.website?.toLowerCase().includes(websiteFilter.toLowerCase())
      );

    setFiltered(result);
  }, [
    industryFilter,
    fieldFilter,
    companyFilter,
    sizeFilter,
    websiteFilter,
    entrepreneurs,
  ]);

  const sendMessage = (uid) => {
    window.dispatchEvent(new CustomEvent("openChat", { detail: uid }));
  };

  /* ✅ STATIC FIELD LIST (BASED ON SELECTED INDUSTRY) */
  const fields = industryFilter
    ? industryData[industryFilter] || []
    : [];

  if (loading) return <p>Loading...</p>;
 
  const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: "220px",
  }),

  control: (provided) => ({
    ...provided,
    height: "35px",
    minHeight: "35px",
    borderRadius: "6px",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "35px",
    padding: "0 12px",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "35px",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px",
    padding: "0px",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};



  return (
    <div className="entrepreneurs-page">
      <div className="entrepreneurs-header">
        <h2>CIT Alumni Entrepreneurs</h2>

      <div className="entrepreneurs-filter-bar">

  {/* INDUSTRY */}
  <div className="filter-group">
    <label>Industry</label>
    <Select
    menuPortalTarget={document.body}
menuPosition="fixed"
      styles={selectStyles}
      options={[
        { value: "", label: "All" },
        ...industries.map((i) => ({ value: i, label: i }))
      ]}
      value={
        industryFilter
          ? { value: industryFilter, label: industryFilter }
          : { value: "", label: "All" }
      }
      onChange={(selected) => {
        setIndustryFilter(selected.value);
        setFieldFilter("");
      }}
      isSearchable
    />
  </div>

  {/* FIELD */}
  <div className="filter-group">
    <label>Field</label>
    <Select
    menuPortalTarget={document.body}
menuPosition="fixed"
      styles={selectStyles}
      isDisabled={!industryFilter}
      options={[
        { value: "", label: "All" },
        ...fields.map((f) => ({ value: f, label: f }))
      ]}
      value={
        fieldFilter
          ? { value: fieldFilter, label: fieldFilter }
          : { value: "", label: "All" }
      }
      onChange={(selected) => setFieldFilter(selected.value)}
      isSearchable
    />
  </div>

  {/* COMPANY */}
  <div className="filter-group">
    <label>Company</label>
    <input
      value={companyFilter}
      placeholder="Search..."
      onChange={(e) => setCompanyFilter(e.target.value)}
      style={{ width: "220px", height: "42px" }}
    />
  </div>

  {/* COMPANY SIZE */}
  <div className="filter-group">
    <label>Company Size</label>
    <Select
    menuPortalTarget={document.body}
menuPosition="fixed"
      styles={selectStyles}
      options={[
        { value: "", label: "All" },
        ...companySizes.map((s) => ({ value: s, label: s }))
      ]}
      value={
        sizeFilter
          ? { value: sizeFilter, label: sizeFilter }
          : { value: "", label: "All" }
      }
      onChange={(selected) => setSizeFilter(selected.value)}
      isSearchable={false}
    />
  </div>

  {/* WEBSITE */}
  <div className="filter-group">
    <label>Website</label>
    <input
      value={websiteFilter}
      placeholder="Search..."
      onChange={(e) => setWebsiteFilter(e.target.value)}
      style={{ width: "220px", height: "42px" }}
    />
  </div>

</div>

      </div>

      <div className={`entrepreneurs-grid ${!canViewAll ? "blurred" : ""}`}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
            <h3>No Data Available</h3>
          </div>
        ) : (
          filtered.map((person) => (
            <div className="entrepreneur-card" key={person.id}>
              <div className="entrepreneur-photo">
                <img src={person.profileImage} alt={person.fullname} />
              </div>

              <div className="entrepreneur-info">
                <h3>{person.fullname}</h3>

                {person.industry && (
                  <p><strong>Industry:</strong> {person.industry}</p>
                )}

                {person.companySize && (
                  <p><strong>Company Size:</strong> {person.companySize}</p>
                )}

                {person.company && (
                  <p><strong>Company:</strong> {person.company}</p>
                )}

                {person.field.length > 0 && (
                  <p><strong>Field:</strong> {person.field.join(", ")}</p>
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
          ))
        )}
      </div>

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
