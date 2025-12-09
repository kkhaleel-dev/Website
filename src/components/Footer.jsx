import React from "react";
import "./Footer.scss";
import IZLogo from "../assets/IZ.png";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a
          href="https://in.linkedin.com/school/coimbatore-institute-of-technology/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://x.com/cit_1956"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.facebook.com/citcovai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.instagram.com/explore/locations/330583382/coimbatore-institute-of-technology/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.youtube.com/@coimbatoreinstituteoftechn2094"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          <FaYoutube />
        </a>
      </div>

      <div className="footer-links">
        <a>Home</a>
        <a>About</a>
        <a>Academics</a>
        <a>Department</a>
        <a>Faculty</a>
        <a>Students</a>
        <a>Exam</a>
        <a>Admission</a>
      </div>

      <p className="powered">
        Powered by <img src={IZLogo} alt="IZ Logo" className="iz-icon" />
        {""}
        <strong>Intelizest Consulting Pvt Ltd</strong>
      </p>
    </footer>
  );
};

export default Footer;
