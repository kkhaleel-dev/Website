import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Accounts from "./pages/Accounts.jsx";
import Loading from "./components/Loading";
import "./App.css";
import SmartICardForm from "./components/SmartICardForm.jsx";
import Noticeboard from "./components/NoticeBoard/NoticeBoard.jsx";
import Team from "./components/Team/Team.jsx";
import ChapterPolicy from "./components/ChapterPolicy/ChapterPolicy.jsx";
import CodeOfEthics from "./components/CodeOfEthics/CodeOfEthics.jsx";
import LatestEvents from "./components/LatestEvents/LatestEvents.jsx";
import Reunion from "./components/Reunion/Reunion.jsx";
import Chapters from "./components/Chapters/Chapters.jsx";
import Sponsorship from "./components/Sponsorship/Sponsorship.jsx";
import BusinessShowcase from "./components/BusinessShowcase/BusinessShowcase.jsx";
import CITAngels from "./components/CITAngels/CITAngels.jsx";

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]); // Trigger on route change

  return (
    <>
      {loading && <Loading />}
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/smart-card" element={<SmartICardForm />} />
          <Route path="/about/noticeboard" element={<Noticeboard />} />
          <Route path="/about/team" element={<Team />} />
          <Route path="/about/chapterPolicy" element={<ChapterPolicy />} />
          <Route path="/about/codeOfEthics" element={<CodeOfEthics />} />
          <Route path="/events/latestEvents" element={<LatestEvents />} />
          <Route path="/events/reunion" element={<Reunion />} />
          <Route path="/events/chapters" element={<Chapters />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route
            path="/startup/businessShowcase"
            element={<BusinessShowcase />}
          />
          <Route path="/startup/citAngels" element={<CITAngels />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
