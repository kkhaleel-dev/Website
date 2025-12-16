import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventsList.scss";
import event1 from "../../assets/Event1.png";
import event2 from "../../assets/Event2.png";
import event3 from "../../assets/Event3.png";
import event4 from "../../assets/Event4.png";

const CARD_GAP = 16;

const events = [
  {
    title: "CIT Alumni Association – Upcoming Reunion Announcement",
    type: "Alumni Event",
    start: "Jan 15, 2026",
    end: "Jan 16, 2026",
    img: event1,
  },
  {
    title: "CIT Alumni Association – Distinguished Alumni Recognition",
    type: "Alumni Highlight",
    start: "Feb 10, 2026 - 10:00 AM",
    end: "02:00 PM",
    img: event2,
  },
  {
    title:
      "CIT Alumni Regional Chapter Meet (Chennai / Bangalore / Salem / Neyveli / Trichy)",
    type: "Networking Event",
    start: "Mar 05, 2026",
    end: "Mar 06, 2026",
    img: event3,
  },
  {
    title: "CIT Alumni Engagement Event (Login Required)",
    type: "Official Event",
    start: "Apr 20, 2026",
    end: "Apr 21, 2026",
    img: event4,
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
