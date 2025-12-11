import React, { useEffect, useState } from "react";
import "./Sponsorship.scss";

const Sponsorship = () => {
  const [sponsorships, setSponsorships] = useState([]);

  useEffect(() => {
    // Replace this with API fetch if needed
    const fetchSponsorships = async () => {
      const data = [
        {
          id: 1,
          title: "Annual Alumni Meet Sponsorship",
          description:
            "Support the grand alumni meet by sponsoring events, workshops, and networking sessions.",
          image:
            "https://via.placeholder.com/400x250.png?text=Annual+Alumni+Meet",
          link: "/sponsorship/alumni-meet",
        },
        {
          id: 2,
          title: "Startup Pitch Day Sponsorship",
          description:
            "Sponsor the Startup Pitch Day and help budding entrepreneurs connect with mentors and investors.",
          image:
            "https://via.placeholder.com/400x250.png?text=Startup+Pitch+Day",
          link: "/sponsorship/startup-pitch",
        },
        {
          id: 3,
          title: "Scholarship & Awards Sponsorship",
          description:
            "Support alumni and current students by sponsoring scholarships, awards, and recognition programs.",
          image:
            "https://via.placeholder.com/400x250.png?text=Scholarships+Awards",
          link: "/sponsorship/scholarships",
        },
      ];
      setSponsorships(data);
    };

    fetchSponsorships();
  }, []);

  return (
    <div className="sponsorship-page">
      <h2>Become a Sponsor</h2>
      <div className="sponsorship-grid">
        {sponsorships.map((sponsor) => (
          <div className="sponsorship-card" key={sponsor.id}>
            <div className="sponsorship-image">
              <img src={sponsor.image} alt={sponsor.title} />
            </div>
            <div className="sponsorship-content">
              <h3>{sponsor.title}</h3>
              <p>{sponsor.description}</p>
              <a href={sponsor.link} className="sponsorship-link">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsorship;
