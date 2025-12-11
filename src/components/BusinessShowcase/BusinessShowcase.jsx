import React, { useEffect, useState } from "react";
import "./BusinessShowcase.scss";

const BusinessShowcase = () => {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    // Replace with API fetch if needed
    const fetchStartups = async () => {
      const data = [
        {
          id: 1,
          name: "TechNova",
          founder: "Anil Verma",
          sector: "AI & ML",
          description:
            "TechNova specializes in AI-powered solutions for healthcare and finance, transforming industries with innovative tech.",
          image: "https://via.placeholder.com/400x250.png?text=TechNova",
          link: "/startups/technova",
        },
        {
          id: 2,
          name: "GreenEco",
          founder: "Priya Sharma",
          sector: "Sustainable Energy",
          description:
            "GreenEco develops eco-friendly energy solutions for urban and rural areas, promoting clean and sustainable living.",
          image: "https://via.placeholder.com/400x250.png?text=GreenEco",
          link: "/startups/greeneco",
        },
        {
          id: 3,
          name: "EduNext",
          founder: "Rohit Singh",
          sector: "EdTech",
          description:
            "EduNext provides smart learning platforms for students and professionals, enhancing skills with adaptive learning technology.",
          image: "https://via.placeholder.com/400x250.png?text=EduNext",
          link: "/startups/edunext",
        },
      ];
      setStartups(data);
    };

    fetchStartups();
  }, []);

  return (
    <div className="business-showcase-page">
      <h2>Alumni Business Showcase</h2>
      <div className="startups-grid">
        {startups.map((startup) => (
          <div className="startup-card" key={startup.id}>
            <div className="startup-image">
              <img src={startup.image} alt={startup.name} />
            </div>
            <div className="startup-content">
              <h3>{startup.name}</h3>
              <span className="startup-founder">
                Founder: {startup.founder}
              </span>
              <span className="startup-sector">Sector: {startup.sector}</span>
              <p>{startup.description}</p>
              <a href={startup.link} className="startup-link">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessShowcase;
