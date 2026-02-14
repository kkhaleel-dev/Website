import React, { useState } from "react";
import "./GetTranscripts.scss";

const GetTranscripts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappAvailable: "",
    city: "",
    overseasUniversity: "",
    collegeName: "",
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const data = {
        access_key: "73f1d2cb-2899-4fb6-bec5-edb3a3cdb469",
        subject: "New Transcript Request - CIT Alumni",

        from_name: formData.name,
        from_email: formData.email,

        message: `
                New Transcript Request Details - CIT Alumni Portal

                Name: ${formData.name}
                Email: ${formData.email}
                Phone: ${formData.phone}
                WhatsApp Available: ${formData.whatsappAvailable}
                City: ${formData.city}
                Overseas University / Agency: ${formData.overseasUniversity}
                Batch Year: ${formData.collegeName}
                Comments: ${formData.comments}

                This request was submitted via the CIT Alumni Portal's Get Transcripts form.
                Copyright © ${new Date().getFullYear()} CIT Alumni Association. All rights reserved.
                    `
                  };

                  const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  });

                  const result = await response.json();

                  if (result.success) {
                    setSubmitted(true);
                  }

                  setLoading(false);
                };


  return (
    <div className="transcripts-page">
      <div className="transcripts-header">
        <h2>Get Your Transcripts</h2>
        <p>
          Fill out the form below and our team will assist you with your
          transcript request process.
        </p>
      </div>

      {!submitted ? (
        <form className="transcripts-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Mobile Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group radio-group">
              <label>WhatsApp Available?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="whatsappAvailable"
                    value="Yes"
                    onChange={handleChange}
                    required
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="whatsappAvailable"
                    value="No"
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Your City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Overseas University / Evaluation Agency</label>
              <input
                type="text"
                name="overseasUniversity"
                value={formData.overseasUniversity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Your Batch Year</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="submit-wrapper">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      ) : (
        <div className="success-message">
          <h3>Request Submitted Successfully!</h3>
          <p>
            Thank you {formData.name}. Our team will contact you shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default GetTranscripts;
