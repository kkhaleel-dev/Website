import React, { useEffect, useState } from "react";
import "./AlumniNews.scss";
import News1 from "../../assets/News1.png";
import News2 from "../../assets/News2.png";
import News3 from "../../assets/News3.png";

const AlumniNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Replace with API fetch or Firebase if available
    const fetchNews = async () => {
      const data = [
        {
          id: 1,
          title: "CIT Alumni Meet 2025 Highlights",
          date: "2025-12-01",
          description:
            "The annual alumni meet at CIT Chennai brought together hundreds of alumni, celebrating achievements, networking, and cultural events.",
          image: News1,
          link: "/updates/alumniNews",
        },
        {
          id: 2,
          title: "Startup Success Stories",
          date: "2025-11-15",
          description:
            "CIT alumni startups showcased innovative solutions, attracting investors and media attention. Highlights of the event are now online.",
          image: News2,
          link: "/updates/alumniNews",
        },
        {
          id: 3,
          title: "Research Achievements by Alumni",
          date: "2025-10-05",
          description:
            "Several alumni have been recognized internationally for research breakthroughs in AI, robotics, and renewable energy.",
          image: News3,
          link: "/updates/alumniNews",
        },
      ];
      setNews(data);
    };

    fetchNews();
  }, []);

  return (
    <div className="alumni-news-page">
      <h2>Alumni News</h2>
      <div className="news-grid">
        {news.map((item) => (
          <div className="news-card" key={item.id}>
            <div className="news-image">
              <img src={item.image} alt={item.title} />
              <div className="date-badge">{item.date}</div>
            </div>
            <div className="news-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.link} className="news-link">
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniNews;
