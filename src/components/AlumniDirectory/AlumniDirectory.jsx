import React, { useEffect, useState } from "react";
import "./AlumniDirectory.scss";
import profileImg from "../../assets/person-logo.png";

// Example data; can later replace with Firebase/REST API fetch
const sampleAlumni = [
  {
    id: 1,
    fullname: "Dr. Rajesh Kumar",
    branch: "EEE",
    batch: "2005",
    location: "Chennai, India",
    email: "rajesh.kumar@cit.ac.in",
    linkedin: "https://linkedin.com/in/rajeshkumar",
    image: profileImg,
  },
  {
    id: 2,
    fullname: "Ms. Priya Sharma",
    branch: "CSE",
    batch: "2010",
    location: "Bangalore, India",
    email: "priya.sharma@cit.ac.in",
    linkedin: "https://linkedin.com/in/priyasharma",
    image: profileImg,
  },
  {
    id: 3,
    fullname: "Mr. Anil Verma",
    branch: "MECH",
    batch: "2012",
    location: "Delhi, India",
    email: "anil.verma@cit.ac.in",
    linkedin: "",
    image: profileImg,
  },
  {
    id: 4,
    fullname: "Dr. L. Meenakshi",
    branch: "CSE",
    batch: "2008",
    location: "Coimbatore, India",
    email: "meenakshi.l@cit.ac.in",
    linkedin: "https://linkedin.com/in/lmeenakshi",
    image: profileImg,
  },
  {
    id: 5,
    fullname: "Mr. R. Rajan",
    branch: "EEE",
    batch: "2015",
    location: "Mumbai, India",
    email: "rajan.r@cit.ac.in",
    linkedin: "",
    image: profileImg,
  },
];

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    // Replace this with API or Firebase fetch
    setAlumni(sampleAlumni);
  }, []);

  return (
    <div className="alumni-directory-page">
      <h2>CIT Alumni Directory</h2>
      <div className="alumni-grid">
        {alumni.map((member) => (
          <div className="alumni-card" key={member.id}>
            <div className="alumni-photo">
              <img src={member.image} alt={member.fullname} />
            </div>
            <div className="alumni-info">
              <h3>{member.fullname}</h3>
              <p>
                <strong>Branch:</strong> {member.branch}
              </p>
              <p>
                <strong>Batch:</strong> {member.batch}
              </p>
              <p>
                <strong>Location:</strong> {member.location}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${member.email}`}>{member.email}</a>
              </p>
              {member.linkedin && (
                <p>
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn Profile
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniDirectory;
