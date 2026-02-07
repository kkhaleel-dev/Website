import React, { useState, useEffect, useRef } from "react";
import "./Carousel4.scss";
import { FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import NoProfile from "../assets/person-logo.png";

const Carousel4 = () => {
  const containerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [slideSize, setSlideSize] = useState(310);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved paid users from Firebase
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const usersSnap = await get(ref(db, "users"));
      const usersData = usersSnap.val() || {};
      const usersArr = Object.entries(usersData).map(([uid, user]) => ({ uid, ...user }));

      // Filter: approved & paid members only
      const filtered = usersArr.filter(u => u.approved === true && u.isPaidMember === true);

      // Sort filtered users by fullname ascending
      filtered.sort((a, b) => a.fullname.localeCompare(b.fullname));

      setProfiles(filtered);
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Responsive cards
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

  // Show nav only if more cards than visible
  useEffect(() => {
    setShowNav(profiles.length > visibleCards);
  }, [visibleCards, profiles]);

  const nextSlide = () => {
    if (active < profiles.length - visibleCards) setActive(active + 1);
  };

  const prevSlide = () => {
    if (active > 0) setActive(active - 1);
  };

  if (loading) return <p className="carousel4-title">Loading...</p>;
  if (!loading && profiles.length === 0) return <p className="carousel4-title">No data available</p>;

  return (
    <div className="carousel4-wrapper">
      <h2 className="carousel4-title">Chennai Chapter EC Members</h2>

      <div className="carousel4-container" ref={containerRef}>
        <div
          className="carousel4-inner"
          style={{ transform: `translateX(-${active * slideSize}px)` }}
        >
          {profiles.map((p, i) => (
            <div className="carousel4-card" key={i}>
              <img src={p.profileImage || NoProfile} alt="" className="carousel4-img" />
              <h3 className="carousel4-name">{p.fullname}</h3>
              <p className="carousel4-role">{p.profession || p.role || ""}</p>
              <p className="carousel4-desc">{p.bio || p.desc || "No description available"}</p>
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
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setPopupData(null)}>
              <IoClose size={23} />
            </button>
            <img src={popupData.profileImage || NoProfile} className="popup-img" alt={popupData.fullname} />
            <h2>{popupData.fullname}</h2>
            <h4>{popupData.profession || popupData.role}</h4>
            <p>{popupData.bio || popupData.desc || "No description available"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel4;
