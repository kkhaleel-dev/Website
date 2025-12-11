import React from "react";
import "./CodeOfEthics.scss";

const CodeOfEthics = () => {
  const ethicsSections = [
    {
      title: "Integrity",
      content:
        "Members shall act with honesty, fairness, and integrity in all dealings, both within the alumni network and externally.",
    },
    {
      title: "Respect",
      content:
        "Members must treat each other with respect, valuing diversity of opinions, culture, and background.",
    },
    {
      title: "Confidentiality",
      content:
        "All sensitive information shared within the alumni network must be kept confidential unless authorized for disclosure.",
    },
    {
      title: "Professionalism",
      content:
        "Members shall uphold professional standards and represent the Institute positively in all interactions.",
    },
    {
      title: "Accountability",
      content:
        "Members are accountable for their actions and decisions, ensuring they do not harm the reputation of the Institute or its alumni.",
    },
    {
      title: "Compliance",
      content:
        "Members shall comply with all applicable laws, regulations, and the Institute’s policies while engaging in alumni activities.",
    },
  ];

  return (
    <div className="code-of-ethics-page">
      <h2>Code of Ethics</h2>
      <div className="ethics-sections">
        {ethicsSections.map((section, index) => (
          <div className="ethics-section" key={index}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeOfEthics;
