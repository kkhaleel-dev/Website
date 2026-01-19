import React, { useEffect, useState } from "react";
import "./Chapters.scss";

const Chapters = () => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Chennai Chapter",
        members: 320,
        location: "Chennai, Tamil Nadu, India",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
        link: "/events/chapters",
      },
      {
        id: 2,
        name: "Bangalore Chapter",
        members: 210,
        location: "Bangalore, Karnataka, India",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2",
        link: "/events/chapters",
      },
      {
        id: 3,
        name: "Mumbai Chapter",
        members: 145,
        location: "Mumbai, Maharashtra, India",
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
        link: "/events/chapters",
      },
      {
        id: 4,
        name: "US Chapter",
        members: 95,
        location: "United States of America",
        image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
        link: "/events/chapters",
      },
      {
        id: 5,
        name: "UK Chapter",
        members: 120,
        location: "United Kingdom",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        link: "/events/chapters",
      },
    ];

    setChapters(data);
  }, []);

  return (
    <div className="chapters-page">
      <div className="chapters-header">
        <h2>Alumni Chapters</h2>
        <p>
          CIT alumni chapters across India and abroad strengthen professional
          networking, mentorship, and lifelong connections among alumni.
        </p>
      </div>

      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <div className="chapter-card" key={chapter.id}>
            <div className="chapter-image">
              <img src={chapter.image} alt={chapter.name} />
            </div>

            <div className="chapter-content">
              <h3>{chapter.name}</h3>
              <span className="chapter-location">{chapter.location}</span>
              <span className="chapter-members">
                {chapter.members}+ Members
              </span>

              <a href={chapter.link} className="chapter-link">
                View Chapter →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chapters;
