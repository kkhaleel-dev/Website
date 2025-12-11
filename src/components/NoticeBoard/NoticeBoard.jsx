import React, { useState, useEffect } from "react";
import "./Noticeboard.scss";

const Noticeboard = () => {
  const [notices, setNotices] = useState([]);

  // Example: fetch notices from API or static data
  useEffect(() => {
    const fetchNotices = async () => {
      // Replace with your API call if needed
      const data = [
        {
          id: 1,
          title: "Alumni Reunion 2025",
          date: "2025-12-15",
          description: "Join us for the alumni reunion at CIT chennai.",
          link: "/events/reunion",
        },
        {
          id: 2,
          title: "New Smart I-Card Launch",
          date: "2025-11-10",
          description: "Apply now for your Smart I-Card.",
          link: "/smart-card",
        },
        {
          id: 3,
          title: "Campus Visit Guidelines",
          date: "2025-10-05",
          description: "Updated rules for visiting the campus.",
          link: "/about/noticeboard",
        },
      ];
      setNotices(data);
    };

    fetchNotices();
  }, []);

  return (
    <div className="noticeboard-container">
      <h2>Noticeboard</h2>
      <div className="noticeboard-grid">
        {notices.map((notice) => (
          <div className="notice-card" key={notice.id}>
            <div className="notice-header">
              <h3>{notice.title}</h3>
              <span className="notice-date">{notice.date}</span>
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
  );
};

export default Noticeboard;
