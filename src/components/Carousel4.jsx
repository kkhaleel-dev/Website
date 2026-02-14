import React, { useState, useEffect, useRef } from "react";
import "./Carousel4.scss";
import { FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import NoProfile from "../assets/person-logo.png";

/* ✅ PRIORITY MEMBERS (Will always appear first in this exact order) */
const PRIORITY_MEMBERS = [
  { name: "Saravana Raja", batch: "1988" },
  { name: "Ashok Raj Vadivelu", batch: "1993" },
  { name: "Ramesh M", batch: "1983" },
  { name: "Karnan Ramamurthy", batch: "1996" },
  { name: "Satheesh S", batch: "1985" },
  { name: "Anitha S", batch: "1989" },
];

const Carousel4 = () => {
  const containerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [slideSize, setSlideSize] = useState(330);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ✅ Fetch EC Members with priority logic */
  const fetchProfiles = async () => {
  setLoading(true);
  try {
    // 1️⃣ Get EC Member table (contains UID + designation)
    const ecSnap = await get(ref(db, "ecMembers"));
    const ecData = ecSnap.val();

    if (!ecData) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    // 2️⃣ Get all users
    const usersSnap = await get(ref(db, "users"));
    const usersData = usersSnap.val() || {};

    // 3️⃣ Map EC members (designation from ecMembers table)
    let ecProfiles = Object.keys(ecData)
      .map((uid) => {
        const user = usersData[uid];
        if (!user) return null;

        return {
          uid,
          fullname: user.fullname || "",
          branch: user.branch || "",
          batch: user.batch || "",
          profileImage: user.profileImage || "",
          designation: ecData[uid]?.designation || "", // ✅ FROM ecMembers
        };
      })
      .filter(Boolean);

    /* ✅ PRIORITY SORTING */
    const priorityProfiles = [];
    const remainingProfiles = [];

    ecProfiles.forEach((profile) => {
      const isPriority = PRIORITY_MEMBERS.some(
        (p) =>
          p.name.trim().toLowerCase() ===
            profile.fullname.trim().toLowerCase() &&
          String(p.batch) === String(profile.batch)
      );

      if (isPriority) {
        priorityProfiles.push(profile);
      } else {
        remainingProfiles.push(profile);
      }
    });

    const orderedPriorityProfiles = PRIORITY_MEMBERS.map((p) =>
      priorityProfiles.find(
        (profile) =>
          profile.fullname.trim().toLowerCase() ===
            p.name.trim().toLowerCase() &&
          String(profile.batch) === String(p.batch)
      )
    ).filter(Boolean);

    setProfiles([...orderedPriorityProfiles, ...remainingProfiles]);
  } catch (err) {
    console.error("Failed to fetch EC profiles:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProfiles();
  }, []);

  /* Responsive Cards (UNCHANGED) */
  useEffect(() => {
    const updateResponsive = () => {
      const w = window.innerWidth;

      if (w <= 600) {
        setVisibleCards(1);
        setSlideSize(330);
      } else if (w <= 1024) {
        setVisibleCards(2);
        setSlideSize(330);
      } else {
        setVisibleCards(4);
        setSlideSize(330);
      }
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, []);

  useEffect(() => {
    setShowNav(profiles.length > visibleCards);
  }, [visibleCards, profiles]);

  if (loading) return <p className="carousel4-title">Loading...</p>;
  if (!loading && profiles.length === 0)
    return <p className="carousel4-title">No EC Members available</p>;

  return (
    <div className="carousel4-wrapper">
      <h2 className="carousel4-title">Chennai Chapter EC Members</h2>

      <div className="carousel4-container" ref={containerRef}>
        <div
          className="carousel4-inner"
          style={{ transform: `translateX(-${active * slideSize}px)` }}
        >
          {profiles.map((p) => (
            <div className="carousel4-card" key={p.uid}>
              <img
                src={p.profileImage || NoProfile}
                alt={p.fullname}
                className="carousel4-img"
              />

              <h3 className="carousel4-name">{p.fullname}</h3>

              <p className="carousel4-role">
                {p.branch}
                {p.branch && p.batch && " | "}
                {p.batch}
              </p>

              <p className="carousel4-desc">
                {p.designation || ""}
              </p>

              <span
                className="carousel4-readmore"
                onClick={() => setPopupData(p)}
              >
                Read More <FaArrowRight size={12} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {showNav && (
        <div className="carousel4-dots">
          {Array.from({ length: profiles.length - visibleCards + 1 }).map(
            (_, i) => (
              <div
                key={i}
                className={`dot ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              ></div>
            )
          )}
        </div>
      )}

      {popupData && (
        <div className="popup-overlay" onClick={() => setPopupData(null)}>
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="popup-close"
              onClick={() => setPopupData(null)}
            >
              <IoClose size={23} />
            </button>

            <img
              src={popupData.profileImage || NoProfile}
              className="popup-img"
              alt={popupData.fullname}
            />

            <h2>{popupData.fullname}</h2>

            <h4>
              {popupData.branch}
              {popupData.branch && popupData.batch && " | "}
              {popupData.batch}
            </h4>

            <p>{popupData.designation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel4;
