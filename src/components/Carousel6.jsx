// Carousel6.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Carousel6.scss";
import sampleImg from "../assets/Carousel2.png"; // your uploaded image

const Carousel6 = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/smart-card");
  };

  return (
    <div className="carousel6-wrapper">
      <div className="carousel6-content">
        <div className="text-section">
          <h2>CONNECTING GENERATIONS OF EXCELLENCE</h2>
          <p>
            Unlock a World of Benefits for You and Your Family with the Alumni
            Smart Card
          </p>
          <button className="cta-btn" onClick={handleButtonClick}>
            Get You Smart Card Now
          </button>
        </div>
        <div className="image-section">
          <img src={sampleImg} alt="img" />
        </div>
      </div>
    </div>
  );
};

export default Carousel6;
