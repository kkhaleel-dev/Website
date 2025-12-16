import React from "react";
import "./ChapterPolicy.scss";

const ChapterPolicy = () => {
  const policySections = [
    {
      title: "Introduction",
      content:
        "The Chapter Policy defines the framework for establishing, managing, and governing alumni chapters. It ensures consistency, transparency, and alignment with the values and vision of Coimbatore Institute of Technology Alumni Association.",
    },
    {
      title: "Chapter Formation",
      content:
        "A minimum of ten registered alumni may initiate the formation of a chapter. All chapters must be formally registered with the Alumni Association and comply with institutional guidelines.",
    },
    {
      title: "Governance & Leadership",
      content:
        "Each chapter shall appoint a President, Secretary, and Treasurer. These office bearers are responsible for leadership, coordination of activities, and maintaining proper records.",
    },
    {
      title: "Financial Management",
      content:
        "Chapters may collect membership contributions and donations. All financial activities must be transparent and reported annually to the Alumni Association.",
    },
    {
      title: "Events & Engagement",
      content:
        "Chapters are encouraged to organize professional networking events, social gatherings, mentorship programs, and community initiatives that reflect the Institute’s ethos.",
    },
    {
      title: "Reporting & Compliance",
      content:
        "Annual reports detailing membership, activities, and finances must be submitted. Non-compliance may lead to review or suspension of chapter recognition.",
    },
    {
      title: "Policy Amendments",
      content:
        "The Alumni Association reserves the right to amend this policy when necessary. All registered chapters will be notified of updates in advance.",
    },
  ];

  return (
    <div className="chapter-policy-page">
      {/* Header */}
      <div className="policy-hero">
        <h2>Chapter Policy</h2>
        <p>
          Guidelines for the formation, governance, and operation of alumni
          chapters under the CIT Alumni Association.
        </p>
      </div>

      {/* Content */}
      <div className="policy-container">
        {policySections.map((section, index) => (
          <div className="policy-card" key={index}>
            <span className="policy-index">
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

export default ChapterPolicy;
