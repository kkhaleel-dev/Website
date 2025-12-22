import React from "react";
import { useNavigate } from "react-router-dom";
import "./Carousel6.scss";
import sampleImg from "../assets/Carousel2.png";

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
            Get Your Smart Card Now
          </button>

          {/* New Offers Section */}
          <div className="offers-section">
            <h3>Exclusive Offers for Approved Users</h3>
            <ul>
              <li>🎁 10% off on alumni merchandise</li>
              <li>🍽️ Special discounts at partner restaurants</li>
              <li>🎫 Early access to workshops & events</li>
              <li>💳 Cashback on annual membership renewal</li>
            </ul>
          </div>
        </div>
        <div className="image-section">
          <img src={sampleImg} alt="Alumni Smart Card" />
        </div>
      </div>
    </div>
  );
};

export default Carousel6;
