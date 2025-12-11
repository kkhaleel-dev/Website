// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Header.scss";
import Logo from "../assets/CollegeFullNameLogo.png";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownContainerRef = useRef(null);

  const handleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="site-header">
      {/* ROW 1 - TOPBAR */}
      <div className="topbar">
        <div className="topbar-left">
          <img
            src={Logo}
            alt="logo"
            className="logo"
            onClick={() => navigate("/")}
            role="button"
          />
        </div>

        <div className="topbar-right">
          <button
            className="signup-btn"
            onClick={() => navigate("/accounts")}
            aria-label="Sign Up or Login"
          >
            Sign Up / Login
          </button>
        </div>
      </div>

      {/* ROW 2 - NAVBAR */}
      <div className="navbar" ref={dropdownContainerRef}>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item active">
              <Link to="/">Alumni Day</Link>
            </li>

            <li
              className={`nav-item dropdown ${
                openDropdown === "about" ? "open" : ""
              }`}
              onClick={() => handleDropdown("about")}
            >
              <span>
                About <FaChevronDown className="chev" />
              </span>
              <ul
                className={`dropdown-menu ${
                  openDropdown === "about" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/about">About CIT</Link>
                </li>
                <li>
                  <Link to="/about/noticeboard">Noticeboard</Link>
                </li>
                <li>
                  <Link to="/about/team">Team</Link>
                </li>
                <li>
                  <Link to="/about/chapterPolicy">Chapter Policy</Link>
                </li>
                <li>
                  <Link to="/about/codeOfEthics">Code of Ethics</Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/smart-card">Smart I-Card</Link>
            </li>

            <li
              className={`nav-item dropdown ${
                openDropdown === "events" ? "open" : ""
              }`}
              onClick={() => handleDropdown("events")}
            >
              <span>
                Events <FaChevronDown className="chev" />
              </span>
              <ul
                className={`dropdown-menu ${
                  openDropdown === "events" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/events/latestEvents">Latest Events</Link>
                </li>
                <li>
                  <Link to="/events/reunion">Reunion</Link>
                </li>
                <li>
                  <Link to="/events/chapters">Chapters</Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/sponsorship">Sponsorship</Link>
            </li>
            <li
              className={`nav-item dropdown ${
                openDropdown === "startup" ? "open" : ""
              }`}
              onClick={() => handleDropdown("startup")}
            >
              <span>
                Startup <FaChevronDown className="chev" />
              </span>
              <ul
                className={`dropdown-menu ${
                  openDropdown === "startup" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/startup/businessShowcase">Business Showcase</Link>
                </li>
                <li>
                  <Link to="/startup/citAngels">CIT Angels</Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item dropdown ${
                openDropdown === "updates" ? "open" : ""
              }`}
              onClick={() => handleDropdown("updates")}
            >
              <span>
                Updates <FaChevronDown className="chev" />
              </span>
              <ul
                className={`dropdown-menu ${
                  openDropdown === "updates" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/updates/newsletters">Newsletters</Link>
                </li>
                <li>
                  <Link to="/updates/citAwards">CIT Awards</Link>
                </li>
                <li>
                  <Link to="/updates/alumniNews">Alumni News</Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item dropdown ${
                openDropdown === "services" ? "open" : ""
              }`}
              onClick={() => handleDropdown("services")}
            >
              <span>
                Services <FaChevronDown className="chev" />
              </span>
              <ul
                className={`dropdown-menu ${
                  openDropdown === "services" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/services/lifeInsurance">
                    Life Insurance Program
                  </Link>
                </li>
                <li>
                  <Link to="/services/donation">Donation</Link>
                </li>
                <li>
                  <Link to="/services/jobs">JOBS</Link>
                </li>
                <li>
                  <Link to="/services/alumniDirectory">Alumni Directory</Link>
                </li>
                <li>
                  <Link to="/services/alumniNearby">Alumni Nearby</Link>
                </li>
                <li>
                  <Link to="/services/getTranscript">Get Transcripts</Link>
                </li>
                <li>
                  <Link to="/services/alumniFaculties">Alumni Faculties</Link>
                </li>
                <li>
                  <Link to="/services/mentorship">Mentorship</Link>
                </li>
                <li>
                  <Link to="/services/contact">Visit Your Alma Master</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* MOBILE MENU BUTTON (visible on small screens) */}
        <div className="mobile-controls">
          <button
            className="mobile-signup"
            onClick={() => navigate("/accounts")}
          >
            Sign Up / Login
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            MENU
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <img
            src={Logo}
            alt="logo"
            className="mobile-logo"
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}
          />
          <button
            className="close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <MdClose />
          </button>
        </div>

        <ul className="mobile-nav">
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/alumni-day" onClick={() => setMobileMenuOpen(false)}>
              Alumni Day
            </Link>
          </li>

          <details>
            <summary>About</summary>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              Institute
            </Link>
            <Link to="/about/team" onClick={() => setMobileMenuOpen(false)}>
              Team
            </Link>
          </details>

          <li>
            <Link to="/smart-card" onClick={() => setMobileMenuOpen(false)}>
              Smart I-Card
            </Link>
          </li>

          <details>
            <summary>Events</summary>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)}>
              All Events
            </Link>
            <Link
              to="/events/upcoming"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upcoming
            </Link>
          </details>

          <li>
            <Link to="/sponsorship" onClick={() => setMobileMenuOpen(false)}>
              Sponsorship
            </Link>
          </li>
          <li>
            <Link to="/startup" onClick={() => setMobileMenuOpen(false)}>
              Startup
            </Link>
          </li>

          <details>
            <summary>Updates</summary>
            <Link to="/news" onClick={() => setMobileMenuOpen(false)}>
              News
            </Link>
            <Link to="/announcements" onClick={() => setMobileMenuOpen(false)}>
              Announcements
            </Link>
          </details>

          <details>
            <summary>Services</summary>
            <Link
              to="/services/smart-card"
              onClick={() => setMobileMenuOpen(false)}
            >
              Smart I-Card Service
            </Link>
            <Link
              to="/services/contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </details>
        </ul>
      </div>
    </header>
  );
};

export default Header;
