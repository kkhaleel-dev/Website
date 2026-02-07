import React, { useState, useEffect, useRef } from "react";
import "./Carousel.scss";
import { FaPlay, FaPause } from "react-icons/fa";
import Carous1 from "../assets/Carous1.png";
import Carous2 from "../assets/Carous2.png";
// import Carousel1 from "../assets/Carousel1.png";
// import Carousel2 from "../assets/Carousel2.png";
// import Carousel3 from "../assets/Carousel3.png";
// import Carousel4 from "../assets/Carousel4.png";
// import Carousel5 from "../assets/Carousel5.png";
// import Carousel6 from "../assets/Carousel6.png";
// import Carousel7 from "../assets/Carousel7.png";

const images = [
  Carous2,
  Carous1,
  // Carousel1,
  // Carousel2,
  // Carousel3,
  // Carousel4,
  // Carousel5,
  // Carousel6,
  // Carousel7,
];

const Carousel = () => {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % images.length);
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="carousel-item" key={index}>
            <img src={img} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="carousel-btn prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        ❯
      </button>

      {/* Dots Indicators */}
      <div className="carousel-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          ></div>
        ))}
      </div>

      {/* ⭐ Play / Pause Button (React Icons) */}
      <button
        className="playpause-btn"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
};

export default Carousel;