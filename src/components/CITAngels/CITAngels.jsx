import React, { useEffect, useState } from "react";
import "./CITAngels.scss";

const CITAngels = () => {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    // Replace this with API fetch if needed
    const fetchStartups = async () => {
      const data = [
        {
          id: 1,
          name: "FinWise",
          founder: "Rohit Mehta",
          sector: "FinTech",
          mentorship: "Seed Funding by CIT Angels",
          description:
            "FinWise is revolutionizing personal finance management with AI-driven insights and smart budgeting tools.",
          image: "https://via.placeholder.com/400x250.png?text=FinWise",
          link: "/startups/finwise",
        },
        {
          id: 2,
          name: "HealthSphere",
          founder: "Neha Gupta",
          sector: "HealthTech",
          mentorship: "Mentorship & Funding by CIT Angels",
          description:
            "HealthSphere provides telemedicine solutions for rural areas, making healthcare accessible to everyone.",
          image: "https://via.placeholder.com/400x250.png?text=HealthSphere",
          link: "/startups/healthsphere",
        },
        {
          id: 3,
          name: "EcoMove",
          founder: "Sanjay Kumar",
          sector: "Mobility & Sustainability",
          mentorship: "Supported by CIT Angels",
          description:
            "EcoMove develops electric vehicles and smart mobility solutions to promote green transportation.",
          image: "https://via.placeholder.com/400x250.png?text=EcoMove",
          link: "/startups/ecomove",
        },
      ];
      setStartups(data);
    };

    fetchStartups();
  }, []);

  return (
    <div className="cit-angels-page">
      <h2>CIT Angels Startups</h2>
      <div className="angels-grid">
        {startups.map((startup) => (
          <div className="angels-card" key={startup.id}>
            <div className="angels-image">
              <img src={startup.image} alt={startup.name} />
            </div>
            <div className="angels-content">
              <h3>{startup.name}</h3>
              <span className="angels-founder">Founder: {startup.founder}</span>
              <span className="angels-sector">Sector: {startup.sector}</span>
              <span className="angels-mentorship">{startup.mentorship}</span>
              <p>{startup.description}</p>
              <a href={startup.link} className="angels-link">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CITAngels;
