// ContactUsFloating.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import "./ContactUsFloating.scss";

const ContactUsFloating = () => {
  const navigate = useNavigate();

  return (
    <button
      className="contact-us-floating"
      onClick={() => navigate("/accounts")}
      aria-label="Contact Us"
    >
      <FaEnvelope className="icon" />
      <span className="text">Contact Us</span>
    </button>
  );
};

export default ContactUsFloating;
