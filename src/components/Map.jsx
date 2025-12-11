import React from "react";
import "./Map.scss";

const Carousel3 = () => {
  // Chennai Institute of Technology coordinates derived from your maps.app link
  const lat = 12.9715628;
  const lng = 80.043079;

  const src = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;

  return (
    <div className="carousel3-container">
      <div className="map-wrapper">
        <iframe
          title="Chennai Institute of Technology - Map"
          src={src}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Carousel3;
