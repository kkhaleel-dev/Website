import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

// Academics
import Undergraduate from "./pages/academics/Undergraduate.jsx";
import Postgraduate from "./pages/academics/Postgraduate.jsx";

// Departments
import ComputerScience from "./pages/departments/ComputerScience.jsx";
import Mechanical from "./pages/departments/Mechanical.jsx";

// Faculty
import Professors from "./pages/faculty/Professors.jsx";
import AssistantProfessors from "./pages/faculty/AssistantProfessors.jsx";

// Students
import Clubs from "./pages/students/Clubs.jsx";
import Events from "./pages/students/Events.jsx";

// Exam
import Schedules from "./pages/exam/Schedules.jsx";
import Results from "./pages/exam/Results.jsx";

// Admission
import ApplyOnline from "./pages/admission/ApplyOnline.jsx";
import Fees from "./pages/admission/Fees.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Header />

      <div className="main-content">
        <Routes>
          {/* Main */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Academics */}
          <Route path="/undergraduate" element={<Undergraduate />} />
          <Route path="/postgraduate" element={<Postgraduate />} />

          {/* Departments */}
          <Route path="/computer-science" element={<ComputerScience />} />
          <Route path="/mechanical" element={<Mechanical />} />

          {/* Faculty */}
          <Route path="/professors" element={<Professors />} />
          <Route
            path="/assistant-professors"
            element={<AssistantProfessors />}
          />

          {/* Students */}
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />

          {/* Exam */}
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/results" element={<Results />} />

          {/* Admission */}
          <Route path="/apply-online" element={<ApplyOnline />} />
          <Route path="/fees" element={<Fees />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
