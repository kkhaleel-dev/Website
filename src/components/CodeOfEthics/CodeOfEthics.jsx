import React from "react";
import "./CodeOfEthics.scss";

const CodeOfEthics = () => {
  const ethicsSections = [
    {
      title: "Integrity & Honesty",
      content:
        "CIT alumni shall act with the highest levels of integrity and honesty in all professional and personal interactions, upholding the reputation of the Institute and its community.",
    },
    {
      title: "Respect & Inclusivity",
      content:
        "Members must respect the dignity, values, and diversity of all individuals; promoting an inclusive and collaborative environment for all CITians.",
    },
    {
      title: "Commitment to Excellence",
      content:
        "Alumni shall pursue excellence in professional endeavors, learning continuously, and contributing meaningfully to society and their fields of expertise.",
    },
    {
      title: "Professional Conduct",
      content:
        "Members shall demonstrate professional behavior in all communications, engagements, and representations of CIT, ensuring fairness, courtesy, and ethical decision-making.",
    },
    {
      title: "Confidentiality & Privacy",
      content:
        "All sensitive or proprietary information shared within alumni activities, networks, and collaborations must be respected and protected unless legally authorized for disclosure.",
    },
    {
      title: "Accountability & Responsibility",
      content:
        "Alumni are responsible for their actions and decisions, ensuring they positively reflect the values of CIT and contribute to the welfare of the alumni community.",
    },
    {
      title: "Service & Giving Back",
      content:
        "Members should seek opportunities to contribute their skills, time, and resources to mentor current students, support community initiatives, and strengthen the alumni network.",
    },
  ];

  return (
    <div className="code-of-ethics-page">
      <div className="ethics-hero">
        <h2>Code of Ethics</h2>
        <p>
          As members of the Coimbatore Institute of Technology Alumni
          Association, we commit to these guiding principles that shape our
          conduct, character, and collective reputation.
        </p>
      </div>

      <div className="ethics-container">
        {ethicsSections.map((section, index) => (
          <div className="ethics-card" key={index}>
            <span className="ethics-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeOfEthics;
