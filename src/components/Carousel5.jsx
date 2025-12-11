// Carousel5.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Carousel5.scss";
import img3 from "../assets/3.png";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 400;
const CARD_GAP = 20;
const VISIBLE_CARDS = 3;
const SLIDE_SIZE = CARD_WIDTH + CARD_GAP;

const events = [
  {
    title: "Felicitation of Prof. G. N. Tiwari",
    type: "Upcoming Event",
    start: "Dec 14, 2025 - 12:00 PM",
    end: "04:00 PM",
    img: img3,
    imgAlt: "Felicitation Event",
  },
  {
    title: "PEARL REUNION BATCH OF 1991",
    type: "Upcoming Event",
    start: "Dec 19, 2025",
    end: "Dec 20, 2025",
    img: img3,
    imgAlt: "Pearl Reunion 1991",
  },
  {
    title: "Silver Jubilee Reunion Batch of 2000",
    type: "Upcoming Event",
    start: "Dec 20, 2025",
    end: "Dec 23, 2025",
    img: img3,
    imgAlt: "Silver Jubilee 2000",
  },
  {
    title: "Extra Event Example",
    type: "Upcoming Event",
    start: "Jan 1, 2026",
    end: "Jan 2, 2026",
    img: img3,
    imgAlt: "Extra Event",
  },
];

const Carousel5 = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (active < events.length - VISIBLE_CARDS) setActive(active + 1);
  };

  const prevSlide = () => {
    if (active > 0) setActive(active - 1);
  };

  const handleViewAll = () => {
    navigate("/events/list");
  };

  return (
    <div className="events-wrapper">
      <div className="header">
        <h2>Events</h2>
        <button className="view-all-btn" onClick={handleViewAll}>
          View All
        </button>
      </div>

      <div className="events-container">
        <div className="events-inner-wrapper">
          <div
            className="events-inner"
            style={{ transform: `translateX(-${active * SLIDE_SIZE}px)` }}
          >
            {events.map((e, i) => (
              <div
                className="event-card"
                key={i}
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                <div
                  className="event-img"
                  style={{ backgroundImage: `url(${e.img})` }}
                  aria-label={e.imgAlt}
                ></div>
                <div className="event-content">
                  <h3 className="event-title">{e.title}</h3>
                  <span className="event-type">{e.type}</span>
                  <p className="event-date">
                    {e.start} {e.end && `- ${e.end}`}
                  </p>
                  <button className="event-btn">View Event</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel5;
