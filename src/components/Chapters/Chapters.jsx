import React, { useEffect, useState } from "react";
import "./Chapters.scss";

const Chapters = () => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    // Replace with API fetch if needed
    const fetchChapters = async () => {
      const data = [
        {
          id: 1,
          name: "Delhi NCR Chapter",
          members: 120,
          location: "Delhi, India",
          image: "https://via.placeholder.com/400x250.png?text=Delhi+NCR",
          link: "/chapters/delhi-ncr",
        },
        {
          id: 2,
          name: "Mumbai Chapter",
          members: 90,
          location: "Mumbai, India",
          image: "https://via.placeholder.com/400x250.png?text=Mumbai",
          link: "/chapters/mumbai",
        },
        {
          id: 3,
          name: "Bangalore Chapter",
          members: 75,
          location: "Bangalore, India",
          image: "https://via.placeholder.com/400x250.png?text=Bangalore",
          link: "/chapters/bangalore",
        },
        {
          id: 4,
          name: "London Chapter",
          members: 50,
          location: "London, UK",
          image: "https://via.placeholder.com/400x250.png?text=London",
          link: "/chapters/london",
        },
      ];
      setChapters(data);
    };

    fetchChapters();
  }, []);

  return (
    <div className="chapters-page">
      <h2>Alumni Chapters</h2>
      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <div className="chapter-card" key={chapter.id}>
            <div className="chapter-image">
              <img src={chapter.image} alt={chapter.name} />
            </div>
            <div className="chapter-content">
              <h3>{chapter.name}</h3>
              <span className="chapter-location">{chapter.location}</span>
              <span className="chapter-members">{chapter.members} Members</span>
              <a href={chapter.link} className="chapter-link">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chapters;
