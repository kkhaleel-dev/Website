// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Header.scss";
// import Logo from "../assets/CollegeFullNameLogo.png";
import Logo from "../assets/SPL2.png";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FiLogOut } from "react-icons/fi";

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

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

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
                onMouseEnter={() => setOpenDropdown("about")}
                onMouseLeave={() => setOpenDropdown(null)}
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
                    <Link to="/about">About</Link>
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
                <Link to="/smart-card">Smart Card</Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  openDropdown === "events" ? "open" : ""
                }`}
                onMouseEnter={() => setOpenDropdown("events")}
                onMouseLeave={() => setOpenDropdown(null)}
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

              <li
                className={`nav-item dropdown ${
                  openDropdown === "updates" ? "open" : ""
                }`}
                onMouseEnter={() => setOpenDropdown("updates")}
                onMouseLeave={() => setOpenDropdown(null)}
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
                    <Link to="/updates/magazines">Magazines</Link>
                  </li>
                  <li>
                    <Link to="/updates/awards">CIT Awards</Link>
                  </li>
                  <li>
                    <Link to="/updates/entrepreneurs">Entrepreneurs</Link>
                  </li>
                  {/* <li>
                    <Link to="/updates/alumniNews">Alumni News</Link>
                  </li> */}
                </ul>
              </li>

              <li
                className={`nav-item dropdown ${
                  openDropdown === "services" ? "open" : ""
                }`}
                onMouseEnter={() => setOpenDropdown("services")}
                onMouseLeave={() => setOpenDropdown(null)}
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
                    <Link to="/services/mentorship">Mentorship</Link>
                  </li>
                  <li>
                    <Link to="/services/visitAlmaMaster">
                      Visit Your Alma Master
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* MOBILE MENU BUTTON (visible on small screens) */}
          <div className="mobile-controls">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </div>

        <div className="topbar-right">
          {!user ? (
            <button
              className="signup-btn"
              onClick={() => navigate("/accounts")}
              aria-label="Sign Up or Login"
            >
              Sign Up / Login
            </button>
          ) : (
            <button
              className="signup-btn"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FiLogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
        {/* Mobile auth button */}
{!user ? (
  <button
    className="mobile-signup"
    onClick={() => {
      navigate("/accounts");
      setMobileMenuOpen(false);
    }}
  >
    Sign Up / Login
  </button>
) : (
  <button
    className="mobile-signup"
    onClick={() => {
      handleLogout();
      setMobileMenuOpen(false);
    }}
  >
    Logout
  </button>
)}

          <button
            className="close-btn"
            style={{
              marginLeft: "auto",
              marginRight: "10px",
              display: "flex",
              alignItems: "center",
              background: "#b4b4b4ff",
              fontSize: "15px",
            }}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <MdClose />
          </button>
        </div>

        <ul className="mobile-nav">
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Alumni Day
            </Link>
          </li>

          <details>
            <summary className="mobile-summary">
              <span>About</span>
              <FaChevronDown className="chev" />
            </summary>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              About CIT
            </Link>
            <Link to="/about/team" onClick={() => setMobileMenuOpen(false)}>
              Team
            </Link>
            <Link
              to="/about/chapterPolicy"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chapter Policy
            </Link>
            <Link
              to="/about/codeOfEthics"
              onClick={() => setMobileMenuOpen(false)}
            >
              Code of Ethics
            </Link>
          </details>

          <li>
            <Link to="/smart-card" onClick={() => setMobileMenuOpen(false)}>
              Smart Card
            </Link>
          </li>

          <details>
            <summary className="mobile-summary">
              <span>Events</span>
              <FaChevronDown className="chev" />
            </summary>
            <Link
              to="/events/latestEvents"
              onClick={() => setMobileMenuOpen(false)}
            >
              Latest Events
            </Link>
            <Link to="/events/reunion" onClick={() => setMobileMenuOpen(false)}>
              Reunion
            </Link>
            <Link
              to="/events/chapters"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chapters
            </Link>
          </details>

          <details>
            <summary className="mobile-summary">
              <span>Updates</span>
              <FaChevronDown className="chev" />
            </summary>
            <Link
              to="/updates/magazines"
              onClick={() => setMobileMenuOpen(false)}
            >
              Magazines
            </Link>
            <Link to="/updates/awards" onClick={() => setMobileMenuOpen(false)}>
              CIT Awards
            </Link>
            <Link
              to="/updates/alumniNews"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alumni News
            </Link>
          </details>

          <details>
            <summary className="mobile-summary">
              <span>Services</span>
              <FaChevronDown className="chev" />
            </summary>
            <Link
              to="/services/donation"
              onClick={() => setMobileMenuOpen(false)}
            >
              Donation
            </Link>
            <Link to="/services/jobs" onClick={() => setMobileMenuOpen(false)}>
              JOBS
            </Link>
            <Link
              to="/services/alumniDirectory"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alumni Directory
            </Link>
            <Link
              to="/services/alumniNearby"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alumni Nearby
            </Link>
            <Link
              to="/services/getTranscripts"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Transcripts
            </Link>
            <Link
              to="/services/mentorship"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mentorship
            </Link>
            <Link
              to="/services/visitAlmaMaster"
              onClick={() => setMobileMenuOpen(false)}
            >
              Visit Your Alma Master
            </Link>
          </details>
        </ul>
      </div>
    </header>
  );
};

export default Header;
