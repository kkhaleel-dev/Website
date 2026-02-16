import React, { useState, useEffect, useRef } from "react";
import "./Carousel4.scss";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import NoProfile from "../assets/person-logo.png";

/* ✅ PRIORITY MEMBERS */
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
  const innerRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);

  const [active, setActive] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [visibleCards, setVisibleCards] = useState(4);
  const [slideSize, setSlideSize] = useState(330);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ✅ Fetch EC Members */
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const ecSnap = await get(ref(db, "ecMembers"));
      const ecData = ecSnap.val();

      if (!ecData) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      let ecProfiles = Object.keys(ecData).map((uid) => ({
        uid,
        fullname: ecData[uid]?.fullname || "",
        branch: ecData[uid]?.branch || "",
        batch: ecData[uid]?.batch || "",
        profileImage: ecData[uid]?.profileImage || "",
        designation: ecData[uid]?.designation || "",
      }));

      const priorityProfiles = [];
      const remainingProfiles = [];

      ecProfiles.forEach((profile) => {
        const isPriority = PRIORITY_MEMBERS.some(
          (p) =>
            p.name.trim().toLowerCase() ===
              profile.fullname.trim().toLowerCase() &&
            String(p.batch) === String(profile.batch)
        );

        if (isPriority) priorityProfiles.push(profile);
        else remainingProfiles.push(profile);
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

  /* Responsive */
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

  /* ✅ AUTO LOOP SCROLL (UNCHANGED) */
  useEffect(() => {
    if (!innerRef.current || !containerRef.current) return;

    const speed = 0.4;
    const inner = innerRef.current;
    const container = containerRef.current;

    const animate = () => {
      if (!isPausedRef.current) {
        const maxScroll = inner.scrollWidth - container.clientWidth;

        positionRef.current += speed;

        if (positionRef.current >= maxScroll) {
          positionRef.current = 0;
          inner.style.transform = `translateX(0px)`;
        } else {
          inner.style.transform = `translateX(-${positionRef.current}px)`;
        }

        const newActive = Math.floor(positionRef.current / slideSize);
        setActive(newActive);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [profiles, slideSize]);

  if (loading) return <p className="carousel4-title">Loading...</p>;
  if (!loading && profiles.length === 0)
    return <p className="carousel4-title">No EC Members available</p>;

  return (
    <div className="carousel4-wrapper">
      <h2 className="carousel4-title">Chennai Chapter EC Members</h2>

      <div className="carousel4-container" ref={containerRef}>
        <div
          className="carousel4-inner"
          ref={innerRef}
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => (isPausedRef.current = false)}
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

              <p className="carousel4-desc">{p.designation || ""}</p>
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
                onClick={() => {
                  const newPosition = i * slideSize;
                  positionRef.current = newPosition;
                  if (innerRef.current) {
                    innerRef.current.style.transform =
                      `translateX(-${newPosition}px)`;
                  }
                  setActive(i);
                }}
              ></div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel4;
