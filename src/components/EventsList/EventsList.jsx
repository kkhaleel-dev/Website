import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventsList.scss";

import Event1 from "../assets/Event1.jpg";
import Event2 from "../assets/Event2.jpg";
import Event3 from "../assets/Event3.png";

const CARD_GAP = 16;

const events = [
  {
    title: "Movie Night",
    type: "Prasad Studios",
    start: "March 22nd, 2026",
    end: "",
    img: Event1,
    description: "Movie will be announced soon",
  },
  {
    title: "Annual CITAACC Family Event",
    type: "Official Event",
    start: "Date to be announced soon",
    end: "",
    img: Event2,
    description: "",
  },
  {
    title: "Alumni Day",
    type: "Alumni Event",
    start: "March 14th, 2026",
    end: "",
    img: Event3,
    description: "",
  },
];

const EventsList = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [active, setActive] = useState(0);
  const [slideSize, setSlideSize] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (cardRef.current && isDesktop) {
      setSlideSize(cardRef.current.offsetWidth + CARD_GAP);
    }
  }, [isDesktop]);

  const maxSlide = Math.max(events.length - 3, 0);

  const nextSlide = () => {
    if (active < maxSlide) setActive(active + 1);
  };

  const prevSlide = () => {
    if (active > 0) setActive(active - 1);
  };

  return (
    <div className="events-wrapper">
      <div className="header">
        <h2>Events</h2>
      </div>

      <div className="events-container">
        <div className="events-inner-wrapper">
          <div
            className="events-inner"
            style={
              isDesktop
                ? { transform: `translateX(-${active * slideSize}px)` }
                : {}
            }
          >
            {events.map((e, i) => (
              <div
                className="event-card"
                key={i}
                ref={i === 0 ? cardRef : null}
              >
                <div
                  className="event-img"
                  style={{ backgroundImage: `url(${e.img})` }}
                />
                <div className="event-content">
                  <h3 className="event-title">{e.title}</h3>
                  <span className="event-type">{e.type}</span>
                  <p className="event-date">
                    {e.start}
                    {e.end && ` - ${e.end}`}
                  </p>
                  {e.description && (
                    <p className="event-desc">{e.description}</p>
                  )}
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

export default EventsList;
