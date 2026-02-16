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
          href="https://in.linkedin.com/school/coimbatore-institute-of-technology/people"
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
          href="https://www.facebook.com/groups/alumni.cit/"
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
          href="https://www.youtube.com/channel/UC-4x325LTCverLeIRzcUPmQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          <FaYoutube />
        </a>
      </div>

      {/* <div className="footer-links">
        <a>Home</a>
        <a>About</a>
        <a>Academics</a>
        <a>Department</a>
        <a>Faculty</a>
        <a>Students</a>
        <a>Exam</a>
        <a>Admission</a>
      </div> */}

      <p className="powered">
        Powered by &nbsp;
        <a
          href="https://intelizest.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="powered-link"
        >
          <img src={IZLogo} alt="IZ Logo" className="iz-icon" />
          <strong>Intelizest Consulting Pvt Ltd</strong>
        </a>
      </p>

      <p className="version">Version 1.0.7</p>
    </footer>
  );
};

export default Footer;
