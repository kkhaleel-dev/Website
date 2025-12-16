import React, { useEffect, useState } from "react";
import "./Magazines.scss";

const Magazines = () => {
  const [magazines, setMagazines] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "CIT Alumni Newsletter – January 2025",
        edition: "Vol. 12 | Issue 1",
        description:
          "Highlights alumni achievements, campus developments, research initiatives, and messages from the Director and Alumni Association.",
        cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        link: "/updates/magazines",
      },
      {
        id: 2,
        title: "CIT Campus Chronicle – 2024",
        edition: "Annual Edition",
        description:
          "An annual publication capturing academic excellence, student activities, alumni contributions, and major institutional milestones.",
        cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
        link: "/updates/magazines",
      },
      {
        id: 3,
        title: "CIT Global Alumni Connect – July 2024",
        edition: "Vol. 11 | Issue 2",
        description:
          "Features global alumni stories, chapter activities, entrepreneurship journeys, and industry insights from CIT graduates worldwide.",
        cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
        link: "/updates/magazines",
      },
      {
        id: 4,
        title: "CIT Research & Innovation Digest",
        edition: "Special Issue",
        description:
          "A special issue dedicated to research publications, patents, funded projects, and innovation-driven initiatives at CIT.",
        cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        link: "/updates/magazines",
      },
    ];

    setMagazines(data);
  }, []);

  return (
    <div className="magazines-page">
      <div className="magazines-header">
        <h2>Magazines & Newsletters</h2>
        <p>
          Explore official publications from the Coimbatore Institute of
          Technology showcasing alumni achievements, campus news, and
          institutional progress.
        </p>
      </div>

      <div className="magazines-grid">
        {magazines.map((mag) => (
          <div className="magazine-card" key={mag.id}>
            <div className="magazine-cover">
              <img src={mag.cover} alt={mag.title} />
            </div>

            <div className="magazine-content">
              <h3>{mag.title}</h3>
              <span className="magazine-edition">{mag.edition}</span>
              <p>{mag.description}</p>

              <a href={mag.link} className="magazine-link">
                Read Magazine →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Magazines;
