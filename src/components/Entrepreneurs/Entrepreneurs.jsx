import React, { useEffect, useState } from "react";
import "./Entrepreneurs.scss";
import profileImg from "../../assets/person-logo.png";

// Sample data – replace with Firebase later
const sampleEntrepreneurs = [
  {
    id: 1,
    fullname: "Mr. Arun Prakash",
    company: "Prakash Tech Solutions",
    industry: "IT Services",
    location: "Coimbatore, India",
    email: "arun@prakashtech.com",
    website: "https://prakashtech.com",
    image: profileImg,
  },
  {
    id: 2,
    fullname: "Ms. Kavitha R",
    company: "GreenLeaf Organics",
    industry: "Agro Products",
    location: "Erode, India",
    email: "kavitha@greenleaf.com",
    website: "",
    image: profileImg,
  },
  {
    id: 3,
    fullname: "Mr. Sanjay Kumar",
    company: "SK Motors",
    industry: "Automobile",
    location: "Chennai, India",
    email: "sanjay@skmotors.in",
    website: "https://skmotors.in",
    image: profileImg,
  },
  {
    id: 4,
    fullname: "Ms. Priyanka N",
    company: "EduSpark Academy",
    industry: "Education",
    location: "Bangalore, India",
    email: "contact@eduspark.in",
    website: "https://eduspark.in",
    image: profileImg,
  },
];

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    // Replace with Firebase/API fetch later
    setEntrepreneurs(sampleEntrepreneurs);
  }, []);

  return (
    <div className="entrepreneurs-page">
      <h2>CIT Alumni Entrepreneurs</h2>

      <div className="entrepreneurs-grid">
        {entrepreneurs.map((person) => (
          <div className="entrepreneur-card" key={person.id}>
            <div className="entrepreneur-photo">
              <img src={person.image} alt={person.fullname} />
            </div>

            <div className="entrepreneur-info">
              <h3>{person.fullname}</h3>

              <p>
                <strong>Company:</strong> {person.company}
              </p>

              <p>
                <strong>Industry:</strong> {person.industry}
              </p>

              <p>
                <strong>Location:</strong> {person.location}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </p>

              {person.website && (
                <p>
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noreferrer"
                    className="website-link"
                  >
                    Visit Website
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

export default Entrepreneurs;
