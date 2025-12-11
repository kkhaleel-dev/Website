import React, { useEffect, useState } from "react";
import "./LatestEvents.scss";

const LatestEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Replace this with API fetch if needed
    const fetchEvents = async () => {
      const data = [
        {
          id: 1,
          title: "Alumni Reunion 2025",
          date: "2025-12-15",
          location: "CIT chennai Campus",
          description:
            "Join us for the grand alumni reunion 2025 with networking, workshops, and cultural events.",
          image: "https://via.placeholder.com/400x250.png?text=Reunion+2025",
          link: "/events/reunion",
        },
        {
          id: 2,
          title: "Startup Pitch Day",
          date: "2025-11-20",
          location: "Online & CIT chennai",
          description:
            "Showcase your startup ideas and get feedback from successful CIT chennai alumni entrepreneurs.",
          image: "https://via.placeholder.com/400x250.png?text=Pitch+Day",
          link: "/events/startup-pitch",
        },
        {
          id: 3,
          title: "Alumni Networking Meetup",
          date: "2025-10-10",
          location: "Delhi NCR",
          description:
            "Meet and connect with fellow alumni in your city and expand your professional network.",
          image:
            "https://via.placeholder.com/400x250.png?text=Networking+Meetup",
          link: "/events/networking",
        },
      ];
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="latest-events-page">
      <h2>Latest Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-image">
              <img src={event.image} alt={event.title} />
            </div>
            <div className="event-content">
              <h3>{event.title}</h3>
              <span className="event-date">{event.date}</span>
              <span className="event-location">{event.location}</span>
              <p>{event.description}</p>
              <a href={event.link} className="event-link">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestEvents;
