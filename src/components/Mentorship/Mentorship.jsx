import React, { useEffect, useState } from "react";
import "./Mentorship.scss";
import img from "../../assets/person-logo.png";
import Placeholderpage from "../Placeholderpage";

const Mentorship = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    // Replace with real API or Firebase fetch
    const fetchMentors = async () => {
      const data = [
        {
          id: 1,
          name: "Dr. Ramesh Kumar",
          expertise: "Artificial Intelligence, Robotics",
          email: "ramesh@cit.ac.in",
          photo: img,
        },
        {
          id: 2,
          name: "Ms. Priya Sharma",
          expertise: "Entrepreneurship, Startups",
          email: "priya@cit.ac.in",
          photo: img,
        },
        {
          id: 3,
          name: "Prof. K. Srinivasan",
          expertise: "Mechanical Design, Automation",
          email: "srinivasan@cit.ac.in",
          photo: img,
        },
        {
          id: 4,
          name: "Dr. L. Meenakshi",
          expertise: "Computer Networks, Security",
          email: "meenakshi@cit.ac.in",
          photo: img,
        },
        {
          id: 5,
          name: "Mr. R. Rajan",
          expertise: "Civil Engineering, Project Management",
          email: "rajan@cit.ac.in",
          photo: img,
        },
      ];
      setMentors(data);
    };

    fetchMentors();
  }, []);

  return (
    // <div className="mentorship-page">
    //   <h2>CIT Mentorship Programs</h2>
    //   <p>
    //     Connect with experienced alumni and faculty mentors to guide your
    //     academic and professional journey. Browse our mentors and reach out
    //     directly.
    //   </p>
    //   <div className="mentors-grid">
    //     {mentors.map((mentor) => (
    //       <div className="mentor-card" key={mentor.id}>
    //         <img
    //           src={mentor.photo}
    //           alt={mentor.name}
    //           className="mentor-photo"
    //         />
    //         <h3>{mentor.name}</h3>
    //         <p className="mentor-expertise">{mentor.expertise}</p>
    //         <a href={`mailto:${mentor.email}`} className="mentor-contact">
    //           Contact
    //         </a>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <Placeholderpage />
  );
};

export default Mentorship;
