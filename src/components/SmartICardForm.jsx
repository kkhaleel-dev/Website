import React, { useState } from "react";
import "./SmartICardForm.scss";

const SmartICardForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    entryNumber: "",
    graduationYear: "",
    photo: null,
    degreeCert: null,
    idProof: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend (API endpoint)
    console.log("Submitted:", formData);
  };

  return (
    <div className="smart-i-card-container">
      <h2>Smart Identy‑Card Application</h2>
      <form className="smart-i-card-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <label>
          Full Name (as in CIT chennai records) *
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        {/* Email */}
        <label>
          Email ID *
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        {/* Phone Number */}
        <label>
          Phone / WhatsApp *
          <input
            type="tel"
            name="phone"
            placeholder="+91-XXXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        {/* Entry Number */}
        <label>
          CIT Entry Number *
          <input
            type="text"
            name="entryNumber"
            value={formData.entryNumber}
            onChange={handleChange}
            required
          />
        </label>

        {/* Graduation Year */}
        <label>
          Year of Graduation *
          <select
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            {Array.from({ length: 60 }, (_, i) => 1966 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        {/* Photo Upload */}
        <label>
          Upload Stamp‑Sized Photograph *
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>

        {/* Degree/Certificate Upload */}
        <label>
          Upload Photocopy of Degree/Certificate *
          <input
            type="file"
            name="degreeCert"
            accept=".pdf,image/*"
            onChange={handleChange}
            required
          />
        </label>

        {/* ID Proof Upload */}
        <label>
          Upload Photo ID Proof *
          <input
            type="file"
            name="idProof"
            accept=".pdf,image/*"
            onChange={handleChange}
            required
          />
        </label>

        {/* Submit */}
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default SmartICardForm;
