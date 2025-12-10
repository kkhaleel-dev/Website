import React, { useState, useRef } from "react";
import "./Header.scss";
import Logo from "../assets/CollegeFullNameLogo.png";
import LogoDark from "../assets/CollegeFullNameLogo-dark.png";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuRefs = useRef({});

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  const handleDropdown = (menu) => {
    const newMenu = openDropdown === menu ? null : menu;
    setOpenDropdown(newMenu);

    setTimeout(() => {
      if (!newMenu) return;

      const menuEl = menuRefs.current[newMenu];
      if (!menuEl) return;

      const rect = menuEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (rect.right > viewportWidth) {
        menuEl.classList.add("align-right");
      } else {
        menuEl.classList.remove("align-right");
      }
    }, 10);
  };

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className="left-section">
        <img src={darkMode ? LogoDark : Logo} alt="Logo" className="logo" />
      </div>

      <div className="right-container">
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>

            {/* Academics */}
            <li
              className={`dropdown-item ${
                openDropdown === "academics" ? "active" : ""
              }`}
              onClick={() => handleDropdown("academics")}
            >
              Academics
              <FaChevronDown
                className={`dropdown-icon ${
                  openDropdown === "academics" ? "open" : ""
                }`}
              />
              <ul
                ref={(el) => (menuRefs.current["academics"] = el)}
                className={`dropdown-menu ${
                  openDropdown === "academics" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/undergraduate">Undergraduate</Link>
                </li>
                <li>
                  <Link to="/postgraduate">Postgraduate</Link>
                </li>
              </ul>
            </li>

            {/* Departments */}
            <li
              className={`dropdown-item ${
                openDropdown === "department" ? "active" : ""
              }`}
              onClick={() => handleDropdown("department")}
            >
              Department
              <FaChevronDown
                className={`dropdown-icon ${
                  openDropdown === "department" ? "open" : ""
                }`}
              />
              <ul
                ref={(el) => (menuRefs.current["department"] = el)}
                className={`dropdown-menu ${
                  openDropdown === "department" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/computer-science">Computer Science</Link>
                </li>
                <li>
                  <Link to="/mechanical">Mechanical</Link>
                </li>
              </ul>
            </li>

            {/* Faculty */}
            <li
              className={`dropdown-item ${
                openDropdown === "faculty" ? "active" : ""
              }`}
              onClick={() => handleDropdown("faculty")}
            >
              Faculty
              <FaChevronDown
                className={`dropdown-icon ${
                  openDropdown === "faculty" ? "open" : ""
                }`}
              />
              <ul
                ref={(el) => (menuRefs.current["faculty"] = el)}
                className={`dropdown-menu ${
                  openDropdown === "faculty" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/professors">Professors</Link>
                </li>
                <li>
                  <Link to="/assistant-professors">Assistant Professors</Link>
                </li>
              </ul>
            </li>

            {/* Students */}
            <li
              className={`dropdown-item ${
                openDropdown === "students" ? "active" : ""
              }`}
              onClick={() => handleDropdown("students")}
            >
              Students
              <FaChevronDown
                className={`dropdown-icon ${
                  openDropdown === "students" ? "open" : ""
                }`}
              />
              <ul
                ref={(el) => (menuRefs.current["students"] = el)}
                className={`dropdown-menu ${
                  openDropdown === "students" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/clubs">Clubs</Link>
                </li>
                <li>
                  <Link to="/events">Events</Link>
                </li>
              </ul>
            </li>

            {/* Exam */}
            <li
              className={`dropdown-item ${
                openDropdown === "exam" ? "active" : ""
              }`}
              onClick={() => handleDropdown("exam")}
            >
              Exam
              <FaChevronDown
                className={`dropdown-icon ${
                  openDropdown === "exam" ? "open" : ""
                }`}
              />
              <ul
                ref={(el) => (menuRefs.current["exam"] = el)}
                className={`dropdown-menu ${
                  openDropdown === "exam" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/schedules">Schedules</Link>
                </li>
                <li>
                  <Link to="/results">Results</Link>
                </li>
              </ul>
            </li>

            {/* Admission */}
            <li
              className={`dropdown-item ${
                openDropdown === "admission" ? "active" : ""
              }`}
              onClick={() => handleDropdown("admission")}
            >
              Admission
              <FaChevronDown
                className={`dropdown-icon ${
                  openDropdown === "admission" ? "open" : ""
                }`}
              />
              <ul
                ref={(el) => (menuRefs.current["admission"] = el)}
                className={`dropdown-menu ${
                  openDropdown === "admission" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/apply-online">Apply Online</Link>
                </li>
                <li>
                  <Link to="/fees">Fees</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
