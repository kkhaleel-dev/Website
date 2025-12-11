import React, { useEffect, useState } from "react";
import "./Team.scss";

const Team = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Replace this with your API call if needed
    const fetchTeamMembers = async () => {
      const data = [
        {
          id: 1,
          name: "Dr. Rajesh Kumar",
          position: "Head of Alumni Relations",
          photo: "https://via.placeholder.com/200x200.png?text=Rajesh",
          social: {
            linkedin: "#",
            twitter: "#",
          },
        },
        {
          id: 2,
          name: "Ms. Priya Sharma",
          position: "Coordinator",
          photo: "https://via.placeholder.com/200x200.png?text=Priya",
          social: {
            linkedin: "#",
            twitter: "#",
          },
        },
        {
          id: 3,
          name: "Mr. Anil Verma",
          position: "Event Manager",
          photo: "https://via.placeholder.com/200x200.png?text=Anil",
          social: {
            linkedin: "#",
            twitter: "#",
          },
        },
      ];
      setMembers(data);
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="team-page">
      <h2>Our Team</h2>
      <div className="team-grid">
        {members.map((member) => (
          <div className="team-card" key={member.id}>
            <img src={member.photo} alt={member.name} className="team-photo" />
            <h3>{member.name}</h3>
            <p>{member.position}</p>
            <div className="team-social">
              {member.social.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {member.social.twitter && (
                <a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
