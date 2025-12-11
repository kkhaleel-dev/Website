import React from "react";
import "./ChapterPolicy.scss";

const ChapterPolicy = () => {
  const policySections = [
    {
      title: "Introduction",
      content:
        "The Chapter Policy outlines the rules and guidelines for establishing and managing alumni chapters. It ensures all chapters operate in alignment with the Institute's mission and alumni objectives.",
    },
    {
      title: "Chapter Formation",
      content:
        "Any group of at least 10 alumni can form a chapter. Chapters must register officially with the Alumni Association and provide necessary documentation.",
    },
    {
      title: "Roles and Responsibilities",
      content:
        "Each chapter must have a President, Secretary, and Treasurer. They are responsible for organizing events, maintaining records, and ensuring compliance with the Alumni Association's rules.",
    },
    {
      title: "Financial Guidelines",
      content:
        "Chapters may collect membership fees and donations. All funds must be reported annually to the Alumni Association and used solely for chapter-related activities.",
    },
    {
      title: "Events and Activities",
      content:
        "Chapters can organize local meet-ups, networking events, and alumni services. All events must comply with the Institute’s code of conduct and policies.",
    },
    {
      title: "Reporting and Compliance",
      content:
        "Chapters are required to submit an annual report of activities, finances, and membership updates. Non-compliance may result in suspension of chapter privileges.",
    },
    {
      title: "Amendments",
      content:
        "The Alumni Association reserves the right to update the Chapter Policy as needed. All chapters will be notified of changes in a timely manner.",
    },
  ];

  return (
    <div className="chapter-policy-page">
      <h2>Chapter Policy</h2>
      <div className="policy-sections">
        {policySections.map((section, index) => (
          <div className="policy-section" key={index}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterPolicy;
