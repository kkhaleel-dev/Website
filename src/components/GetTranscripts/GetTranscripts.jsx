import React, { useState } from "react";
import "./GetTranscripts.scss";

const GetTranscripts = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    enrollmentId: "",
    program: "",
    yearOfPassing: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send formData to Firebase or API
    console.log("Transcript Request Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="transcripts-page">
      <h2>Request Your Transcripts</h2>
      <p>
        Please fill in the details below to request your academic transcripts
        from Coimbatore Institute of Technology (CIT). Our team will process
        your request and contact you via email.
      </p>

      {!submitted ? (
        <form className="transcripts-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Enrollment ID</label>
            <input
              type="text"
              name="enrollmentId"
              value={formData.enrollmentId}
              onChange={handleChange}
              required
              placeholder="Enter your enrollment ID"
            />
          </div>

          <div className="form-group">
            <label>Program</label>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
              placeholder="Enter your program (e.g., B.Tech EEE)"
            />
          </div>

          <div className="form-group">
            <label>Year of Passing</label>
            <input
              type="number"
              name="yearOfPassing"
              value={formData.yearOfPassing}
              onChange={handleChange}
              required
              placeholder="Enter your graduation year"
            />
          </div>

          <button type="submit" className="submit-btn">
            Request Transcript
          </button>
        </form>
      ) : (
        <div className="success-message">
          <h3>Request Submitted!</h3>
          <p>
            Thank you, {formData.fullname}. Your transcript request has been
            successfully submitted. We will contact you shortly at{" "}
            {formData.email}.
          </p>
        </div>
      )}
    </div>
  );
};

export default GetTranscripts;
