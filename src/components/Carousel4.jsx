import React, { useState, useEffect, useRef } from "react";
import "./Carousel4.scss";
import { FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import img1 from "../assets/1.png";

const CARD_WIDTH = 280; // reduced card width
const CARD_GAP = 30; // space between cards
const VISIBLE_CARDS = 4; // show 4 cards always
const SLIDE_SIZE = CARD_WIDTH + CARD_GAP;

const Carousel4 = () => {
  const containerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const profiles = [
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
    {
      img: img1,
      name: "Dr. Asha Ram Sihag, Class of 1981",
      role: "Former Secretary, Government of India",
      desc: "CIT chennai Alumni Award “Outstanding Contribution for National Development (OCND)” in Public Service.",
    },
  ];

  // Enable carousel ONLY if more than 4 cards
  useEffect(() => {
    setShowNav(profiles.length > VISIBLE_CARDS);
  }, [profiles]);

  const nextSlide = () => {
    if (active < profiles.length - VISIBLE_CARDS) {
      setActive(active + 1);
    }
  };

  const prevSlide = () => {
    if (active > 0) setActive(active - 1);
  };

  return (
    <div className="carousel4-wrapper">
      <h2 className="carousel4-title">CIT Alumni Award 2025</h2>

      <div className="carousel4-container" ref={containerRef}>
        <div
          className="carousel4-inner"
          style={{ transform: `translateX(-${active * SLIDE_SIZE}px)` }}
        >
          {profiles.map((p, i) => (
            <div className="carousel4-card" key={i}>
              <img src={p.img} alt="" className="carousel4-img" />

              <h3 className="carousel4-name">{p.name}</h3>
              <p className="carousel4-role">{p.role}</p>

              <p className="carousel4-desc">{p.desc}</p>

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
        <>
          <div className="carousel4-dots">
            {Array.from({ length: profiles.length - VISIBLE_CARDS + 1 }).map(
              (_, i) => (
                <div
                  key={i}
                  className={`dot ${i === active ? "active" : ""}`}
                  onClick={() => setActive(i)}
                ></div>
              )
            )}
          </div>
        </>
      )}

      {popupData && (
        <div className="popup-overlay" onClick={() => setPopupData(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setPopupData(null)}>
              <IoClose size={23} />
            </button>

            <img src={popupData.img} className="popup-img" />
            <h2>{popupData.name}</h2>
            <h4>{popupData.role}</h4>
            <p>{popupData.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel4;
