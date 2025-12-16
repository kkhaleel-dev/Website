import React, { useEffect, useState } from "react";
import "./Jobs.scss";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Replace with API fetch if available
    const fetchJobs = async () => {
      const data = [
        {
          id: 1,
          role: "Software Engineer",
          company: "Infosys Ltd.",
          location: "Bangalore, India",
          experience: "2-4 years",
          description:
            "Looking for talented software engineers to work on full-stack development projects with cutting-edge technologies.",
          link: "/services/jobs",
        },
        {
          id: 2,
          role: "Data Analyst",
          company: "Tata Consultancy Services",
          location: "Chennai, India",
          experience: "1-3 years",
          description:
            "Responsible for analyzing data and providing insights to help business decisions. Experience with SQL and Python preferred.",
          link: "/services/jobs",
        },
        {
          id: 3,
          role: "Product Manager",
          company: "Zoho Corp.",
          location: "Chennai, India",
          experience: "3-5 years",
          description:
            "Manage product development lifecycle, collaborate with cross-functional teams, and ensure successful product launches.",
          link: "/services/jobs",
        },
        {
          id: 4,
          role: "Research Associate",
          company: "CIT Research Labs",
          location: "Coimbatore, India",
          experience: "0-2 years",
          description:
            "Assist in ongoing research projects in AI, Robotics, and Renewable Energy. Ideal for recent graduates from CIT.",
          link: "/services/jobs",
        },
      ];
      setJobs(data);
    };

    fetchJobs();
  }, []);

  return (
    <div className="jobs-page">
      <h2>Alumni Job Opportunities</h2>
      <div className="jobs-grid">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.role}</h3>
            <span className="job-company">{job.company}</span>
            <span className="job-location">{job.location}</span>
            <span className="job-experience">Experience: {job.experience}</span>
            <p>{job.description}</p>
            <a href={job.link} className="job-link">
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
