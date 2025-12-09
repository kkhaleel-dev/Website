import React, { useState } from "react";
import "./Header.scss";
import Logo from "../assets/CollegeFullNameLogo.png"; // Light mode logo
import LogoDark from "../assets/CollegeFullNameLogo-dark.png"; // Dark mode logo (transparent bg)
import { FaMoon, FaSun, FaChevronDown } from "react-icons/fa";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      {/* LEFT SECTION - LOGO */}
      <div className="left-section">
        <img src={darkMode ? LogoDark : Logo} alt="Logo" className="logo" />
      </div>

      {/* RIGHT CONTAINER - NAVIGATION + THEME ICON */}
      <div className="right-container">
        <nav className="nav">
          <ul>
            <li>Home</li>
            <li>About</li>

            {/* Dropdown items */}
            <li className="dropdown-item">
              Academics <FaChevronDown className="dropdown-icon" />
              <ul className="dropdown-menu">
                <li>Undergraduate</li>
                <li>Postgraduate</li>
                <li>Research</li>
              </ul>
            </li>

            <li className="dropdown-item">
              Department <FaChevronDown className="dropdown-icon" />
              <ul className="dropdown-menu">
                <li>Computer Science</li>
                <li>Mechanical</li>
                <li>Electrical</li>
              </ul>
            </li>

            <li className="dropdown-item">
              Faculty <FaChevronDown className="dropdown-icon" />
              <ul className="dropdown-menu">
                <li>Professors</li>
                <li>Assistant Professors</li>
                <li>Visiting Faculty</li>
              </ul>
            </li>

            <li className="dropdown-item">
              Students <FaChevronDown className="dropdown-icon" />
              <ul className="dropdown-menu">
                <li>Clubs</li>
                <li>Events</li>
                <li>Alumni</li>
              </ul>
            </li>

            <li className="dropdown-item">
              Exam <FaChevronDown className="dropdown-icon" />
              <ul className="dropdown-menu">
                <li>Schedules</li>
                <li>Results</li>
                <li>Notifications</li>
              </ul>
            </li>

            <li className="dropdown-item">
              Admission <FaChevronDown className="dropdown-icon" />
              <ul className="dropdown-menu">
                <li>Apply Online</li>
                <li>Fees</li>
                <li>Scholarships</li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* THEME TOGGLE ICON */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div>
    </header>
  );
};

export default Header;
