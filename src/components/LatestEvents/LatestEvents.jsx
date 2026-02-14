import React, { useEffect, useState } from "react";
import "./LatestEvents.scss";
import Event1 from "../../assets/Event1.jpg";
import Event2 from "../../assets/Event2.jpg";
import Event3 from "../../assets/Event3.png";

const LatestEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "Movie Night",
        date: "March 22nd, 2026",
        location: "Prasad Studios",
        description: "Movie will be announced soon",
        image: Event1,
      },
      {
        id: 2,
        title: "Annual CITAACC Family Event",
        date: "Date to be announced soon",
        location: "Official Event",
        description: "",
        image: Event2,
      },
      {
        id: 3,
        title: "Alumni Day",
        date: "March 14th, 2026",
        location: "Alumni Event",
        description: "",
        image: Event3,
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
              {event.description && <p>{event.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestEvents;
