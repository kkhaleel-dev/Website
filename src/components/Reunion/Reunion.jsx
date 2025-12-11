import React, { useEffect, useState } from "react";
import "./Reunion.scss";

const Reunion = () => {
  const [reunionEvents, setReunionEvents] = useState([]);

  useEffect(() => {
    // Replace with API fetch if available
    const fetchReunionEvents = async () => {
      const data = [
        {
          id: 1,
          title: "CIT chennai Alumni Reunion 2025",
          date: "2025-12-15",
          location: "CIT chennai Campus",
          description:
            "Celebrate with your batchmates! Join workshops, cultural events, and networking sessions at CIT chennai.",
          image:
            "https://via.placeholder.com/400x250.png?text=Alumni+Reunion+2025",
          link: "/events/reunion/2025",
        },
        {
          id: 2,
          title: "CIT Chapter Reunion - Delhi NCR",
          date: "2025-11-20",
          location: "Delhi NCR",
          description:
            "Reconnect with fellow alumni from your chapter and enjoy a day of networking and fun activities.",
          image:
            "https://via.placeholder.com/400x250.png?text=CIT+Chapter+Reunion",
          link: "/events/reunion/delhi-ncr",
        },
        {
          id: 3,
          title: "Virtual Alumni Reunion Meetup",
          date: "2025-10-10",
          location: "Online",
          description:
            "Can't travel to campus? Join our online reunion meetup and connect with alumni worldwide.",
          image: "https://via.placeholder.com/400x250.png?text=Virtual+Reunion",
          link: "/events/reunion/virtual",
        },
      ];
      setReunionEvents(data);
    };

    fetchReunionEvents();
  }, []);

  return (
    <div className="reunion-page">
      <h2>Alumni Reunion Events</h2>
      <div className="reunion-grid">
        {reunionEvents.map((event) => (
          <div className="reunion-card" key={event.id}>
            <div className="reunion-image">
              <img src={event.image} alt={event.title} />
              <div className="date-badge">{event.date}</div>
            </div>
            <div className="reunion-content">
              <h3>{event.title}</h3>
              <span className="reunion-location">{event.location}</span>
              <p>{event.description}</p>
              <a href={event.link} className="reunion-link">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reunion;
