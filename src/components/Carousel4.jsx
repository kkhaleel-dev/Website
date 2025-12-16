import React, { useState, useEffect, useRef } from "react";
import "./Carousel4.scss";
import { FaArrowRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Ashokraj from "../assets/Ashokraj.jpg";
import img1 from "../assets/person-logo.png";

const Carousel4 = () => {
  const containerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [visibleCards, setVisibleCards] = useState(4);
  const [slideSize, setSlideSize] = useState(310);

  const profiles = [
    {
      img: Ashokraj,
      name: "Ashok Raj V, Class of 1993",
      role: "CEO of Intelizest & Expanz, India",
      desc: "Innovative CEO inspiring teams, fostering growth, and achieving remarkable success. Strategic leader driving innovation, growth, and excellence company-wide every day.",
    },
    {
      img: img1,
      name: "Thiagarajan P , Class of 1977",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
    {
      img: img1,
      name: "Balaji Mayilan M P , Class of 2019",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
    {
      img: img1,
      name: "Ramesh M , Class of 1983",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
    {
      img: img1,
      name: "Subramanian R  , Class of 1978",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
    {
      img: img1,
      name: "Vasantha Kumar, Class of 1996",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
    {
      img: img1,
      name: "Elangovan P P , Class of 1984",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
    {
      img: img1,
      name: "Naveen Prabhu D , Class of 2005",
      role: "India",
      desc: "CIT chennai Alumni Award",
    },
  ];

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
  }, [visibleCards]);

  const nextSlide = () => {
    if (active < profiles.length - visibleCards) {
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
          style={{ transform: `translateX(-${active * slideSize}px)` }}
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
