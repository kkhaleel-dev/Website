import React, { useEffect, useState } from "react";
import "./LatestEvents.scss";

const LatestEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "CIT Global Alumni Meet 2025",
        date: "15 Dec 2025",
        location: "CIT Chennai Campus",
        description:
          "The flagship alumni gathering bringing together CITians from across the globe for networking, knowledge sharing, and celebrating institutional pride.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        link: "/events/global-alumni-meet",
      },
      {
        id: 2,
        title: "Distinguished Alumni Lecture Series",
        date: "20 Nov 2025",
        location: "Main Auditorium, CIT",
        description:
          "An inspiring talk by eminent CIT alumni leaders sharing industry insights, career guidance, and future technology trends with students and alumni.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
        link: "/events/alumni-lecture",
      },
      {
        id: 3,
        title: "CIT Alumni Startup & Innovation Summit",
        date: "10 Oct 2025",
        location: "Hybrid (Online & Campus)",
        description:
          "A platform for alumni entrepreneurs to pitch startups, connect with investors, and mentor young innovators from the CIT community.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
        link: "/events/startup-summit",
      },
      {
        id: 4,
        title: "Regional Alumni Networking Meet – Chennai",
        date: "05 Sep 2025",
        location: "Chennai",
        description:
          "An exclusive regional networking event to strengthen alumni bonds, foster collaborations, and expand professional connections.",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
        link: "/events/chennai-meet",
      },
    ];

    setEvents(data);
  }, []);

  return (
    <div className="latest-events-page">
      <div className="events-header">
        <h2>Latest Alumni Events</h2>
        <p>
          Stay connected with the Coimbatore Institute of Technology alumni
          community through our events, programs, and initiatives.
        </p>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-image">
              <img src={event.image} alt={event.title} />
              <span className="event-date-badge">{event.date}</span>
            </div>

            <div className="event-content">
              <h3>{event.title}</h3>
              <span className="event-location">{event.location}</span>
              <p>{event.description}</p>

              <a href={event.link} className="event-link">
                View Details →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestEvents;
