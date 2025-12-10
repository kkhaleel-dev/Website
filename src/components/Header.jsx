// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Header.scss";
import Logo from "../assets/CollegeFullNameLogo.png";
import LogoDark from "../assets/CollegeFullNameLogo-dark.png";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRefs = useRef({});
  const dropdownContainerRef = useRef(null);

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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className="left-section">
        <img
          src={darkMode ? LogoDark : Logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="right-container" ref={dropdownContainerRef}>
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

            {/* Department */}
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

      {/* MOBILE SIDEBAR ICON */}
      <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(true)}>
        ☰
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setMobileMenuOpen(false)}>
          <MdClose />
        </div>

        <ul className="mobile-nav">
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
          </li>

          <details>
            <summary>Academics</summary>
            <Link to="/undergraduate" onClick={() => setMobileMenuOpen(false)}>
              Undergraduate
            </Link>
            <Link to="/postgraduate" onClick={() => setMobileMenuOpen(false)}>
              Postgraduate
            </Link>
          </details>

          <details>
            <summary>Department</summary>
            <Link
              to="/computer-science"
              onClick={() => setMobileMenuOpen(false)}
            >
              Computer Science
            </Link>
            <Link to="/mechanical" onClick={() => setMobileMenuOpen(false)}>
              Mechanical
            </Link>
          </details>

          <details>
            <summary>Faculty</summary>
            <Link to="/professors" onClick={() => setMobileMenuOpen(false)}>
              Professors
            </Link>
            <Link
              to="/assistant-professors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Assistant Professors
            </Link>
          </details>

          <details>
            <summary>Students</summary>
            <Link to="/clubs" onClick={() => setMobileMenuOpen(false)}>
              Clubs
            </Link>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
          </details>

          <details>
            <summary>Exam</summary>
            <Link to="/schedules" onClick={() => setMobileMenuOpen(false)}>
              Schedules
            </Link>
            <Link to="/results" onClick={() => setMobileMenuOpen(false)}>
              Results
            </Link>
          </details>

          <details>
            <summary>Admission</summary>
            <Link to="/apply-online" onClick={() => setMobileMenuOpen(false)}>
              Apply Online
            </Link>
            <Link to="/fees" onClick={() => setMobileMenuOpen(false)}>
              Fees
            </Link>
          </details>
        </ul>
      </div>
    </header>
  );
};

export default Header;
