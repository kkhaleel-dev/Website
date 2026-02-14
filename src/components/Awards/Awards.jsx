import React, { useEffect, useState } from "react";
import "./Awards.scss";
import Award1 from "../../assets/Award1.png";
import Award2 from "../../assets/Award2.png";
import Award3 from "../../assets/Award3.png";
import Award4 from "../../assets/Award4.png";
import Award5 from "../../assets/Award5.png";
import Placeholderpage from "../Placeholderpage";

const Awards = () => {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "Best Innovation in Engineering Award",
        recipient: "Dr. A. Ramesh",
        year: "2024",
        description:
          "Recognized for pioneering research and innovation in renewable energy technologies at CIT.",
        image: Award1,
        link: "/updates/awards",
      },
      {
        id: 2,
        title: "Alumni Achievement Award",
        recipient: "Ms. Priya Sharma",
        year: "2023",
        description:
          "Awarded for outstanding contributions to social entrepreneurship and community development as a CIT alumnus.",
        image: Award2,
        link: "/updates/awards",
      },
      {
        id: 3,
        title: "Excellence in Research Award",
        recipient: "Prof. K. Srinivasan",
        year: "2024",
        description:
          "Honored for groundbreaking research in artificial intelligence and robotics at CIT.",
        image: Award3,
        link: "/updates/awards",
      },
      {
        id: 4,
        title: "Distinguished Faculty Award",
        recipient: "Dr. L. Meenakshi",
        year: "2023",
        description:
          "Awarded for excellence in teaching, mentorship, and academic leadership at CIT.",
        image: Award4,
        link: "/updates/awards",
      },
      {
        id: 5,
        title: "Global Alumni Recognition",
        recipient: "Mr. R. Rajan",
        year: "2025",
        description:
          "Recognized for exemplary leadership in technology and entrepreneurship on a global platform.",
        image: Award5,
        link: "/updates/awards",
      },
    ];

    setAwards(data);
  }, []);

  return (
    <div className="awards-page">
      <div className="awards-header">
        <h2>CIT Awards & Recognitions</h2>
        <p>
          Celebrating achievements of faculty, students, and alumni for
          excellence in academics, innovation, research, and social impact.
        </p>
      </div>

     <Placeholderpage />
    </div>
  );
};

export default Awards;
