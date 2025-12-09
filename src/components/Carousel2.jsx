import React from "react";
import "./Carousel2.scss";

const data = [
  {
    title: "Total Students Enrolled",
    value: "5000+",
    color: "#22c55e", // green
  },
  {
    title: "Academic Grade",
    value: "A+",
    color: "#3b82f6", // blue
  },
  {
    title: "Top Instructors Ranking",
    value: "1",
    color: "#a855f7", // purple
  },
  {
    title: "Departments Active",
    value: "25",
    color: "#f97316", // orange
  },
  //   {
  //     title: "Departments Active",
  //     value: "25",
  //     color: "#f97316", // orange
  //   },
  //   {
  //     title: "Departments Active",
  //     value: "25",
  //     color: "#f97316", // orange
  //   },
  {
    title: "Placements Success",
    value: "95%",
    color: "#e11d48", // pink-red
  },
];

const Carousel2 = () => {
  return (
    <div className="carousel2-section">
      <div className="cards-wrapper">
        {data.map((item, index) => (
          <div className="info-card" key={index}>
            <p className="card-title">{item.title}</p>
            <p className="card-value" style={{ color: item.color }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel2;
