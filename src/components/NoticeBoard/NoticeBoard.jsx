import React, { useState, useEffect } from "react";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import "./Noticeboard.scss";

const Noticeboard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const data = [
        {
          id: 1,
          title: "Alumni Reunion 2025",
          date: "2025-12-15",
          description:
            "Join us for the alumni reunion at CIT Chennai. Reconnect with old friends and celebrate achievements.",
          link: "/events/reunion",
        },
        {
          id: 2,
          title: "New Smart I-Card Launch",
          date: "2025-11-10",
          description:
            "Apply now for your Smart I-Card to access campus facilities and digital services.",
          link: "/smart-card",
        },
        {
          id: 3,
          title: "Campus Visit Guidelines",
          date: "2025-10-05",
          description:
            "Updated rules for visiting the campus. Please follow the instructions to ensure a safe visit.",
          link: "/about/noticeboard",
        },
      ];
      setNotices(data);
    };

    fetchNotices();
  }, []);

  return (
    <div className="noticeboard-page">
    <div className="noticeboard-container">
      <h2>
        <FaBullhorn /> CIT Chennai Noticeboard
      </h2>
      <div className="noticeboard-grid">
        {notices.map((notice) => (
          <div className="notice-card" key={notice.id}>
            <div className="notice-header">
              <h3>{notice.title}</h3>
              <span className="notice-date">
                <FaCalendarAlt /> {notice.date}
              </span>
            </div>
            <p>{notice.description}</p>
            {notice.link && (
              <a href={notice.link} className="notice-link">
                Read More
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Noticeboard;
