import React from "react";
import "./VisitAlmaMater.scss";
import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";

const VisitAlmaMater = () => {
  const visitHighlights = [
    {
      id: 1,
      title: "Campus Tours",
      description:
        "Experience the CIT Chennai campus, state-of-the-art labs, and vibrant student life.",
      image: img1,
    },
    {
      id: 2,
      title: "Alumni Stories",
      description:
        "Hear from our distinguished alumni and learn about their journey and achievements.",
      image: img2,
    },
    {
      id: 3,
      title: "Workshops & Seminars",
      description:
        "Participate in interactive workshops and seminars conducted by leading faculty.",
      image: img3,
    },
    {
      id: 4,
      title: "Cultural Events",
      description:
        "Witness CIT’s rich cultural events, fests, and student activities during your visit.",
      image: img4,
    },
  ];

  return (
    <div className="visit-alma-mater-page">
      <h2>Visit Your Alma Mater - CIT Chennai</h2>
      <p>
        Reconnect with your college, explore the campus, and relive your
        cherished memories. Join guided tours, interact with faculty and
        students, and experience CIT’s vibrant community.
      </p>
      <div className="visit-grid">
        {visitHighlights.map((highlight) => (
          <div className="visit-card" key={highlight.id}>
            <div className="visit-image">
              <img src={highlight.image} alt={highlight.title} />
            </div>
            <div className="visit-content">
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/services/visitAlmaMaster" className="visit-cta">
        Plan Your Visit
      </a>
    </div>
  );
};

export default VisitAlmaMater;
