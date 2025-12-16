import React, { useEffect, useState } from "react";
import "./Reunion.scss";

const Reunion = () => {
  const [reunionEvents, setReunionEvents] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "CIT Global Alumni Reunion 2025",
        date: "15 December 2025",
        location: "CIT Chennai Campus",
        description:
          "The flagship reunion bringing together alumni from all batches to reconnect, celebrate milestones, and strengthen lifelong bonds with the institute.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        link: "/events/reunion",
      },
      {
        id: 2,
        title: "CIT Alumni Chapter Reunion – Delhi NCR",
        date: "20 November 2025",
        location: "Delhi NCR",
        description:
          "An exclusive regional reunion fostering alumni networking, professional collaboration, and shared memories among CITians in the NCR region.",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
        link: "/events/reunion",
      },
      {
        id: 3,
        title: "Virtual Global Alumni Reunion Meet",
        date: "10 October 2025",
        location: "Online",
        description:
          "A virtual reunion for alumni worldwide, enabling meaningful engagement, interactions with faculty, and institutional updates.",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
        link: "/events/reunion",
      },
    ];

    setReunionEvents(data);
  }, []);

  return (
    <div className="reunion-page">
      <div className="reunion-header">
        <h2>Alumni Reunion Events</h2>
        <p>
          Reconnect with your alma mater, relive cherished memories, and
          celebrate the enduring spirit of the Coimbatore Institute of
          Technology alumni community.
        </p>
      </div>

      <div className="reunion-grid">
        {reunionEvents.map((event) => (
          <div className="reunion-card" key={event.id}>
            <div className="reunion-image">
              <img src={event.image} alt={event.title} />
              <span className="date-badge">{event.date}</span>
            </div>

            <div className="reunion-content">
              <h3>{event.title}</h3>
              <span className="reunion-location">{event.location}</span>
              <p>{event.description}</p>
              <a href={event.link} className="reunion-link">
                View Details →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reunion;
