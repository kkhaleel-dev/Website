import React, { useState, useEffect } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Accounts from "./pages/Accounts.jsx";
import Signup from "./pages/Signup.jsx";
import Loading from "./components/Loading";
import SmartICardForm from "./components/SmartICardForm.jsx";
import Noticeboard from "./components/NoticeBoard/NoticeBoard.jsx";
import Team from "./components/Team/Team.jsx";
import ChapterPolicy from "./components/ChapterPolicy/ChapterPolicy.jsx";
import CodeOfEthics from "./components/CodeOfEthics/CodeOfEthics.jsx";
import LatestEvents from "./components/LatestEvents/LatestEvents.jsx";
import Reunion from "./components/Reunion/Reunion.jsx";
import Chapters from "./components/Chapters/Chapters.jsx";
import BusinessShowcase from "./components/BusinessShowcase/BusinessShowcase.jsx";
import CITAngels from "./components/CITAngels/CITAngels.jsx";
import Magazines from "./components/Magasines/Magasines.jsx";
import Awards from "./components/Awards/Awards.jsx";
import AlumniNews from "./components/AlumniNews/AlumniNews.jsx";
import Donation from "./components/Donation/Donation.jsx";
import Jobs from "./components/Jobs/Jobs.jsx";
import AlumniDirectory from "./components/AlumniDirectory/AlumniDirectory.jsx";
import AlumniNearby from "./components/AlumniNearby/AlumniNearby.jsx";
import GetTranscripts from "./components/GetTranscripts/GetTranscripts.jsx";
import Mentorship from "./components/Mentorship/Mentorship.jsx";
import VisitAlmaMater from "./components/VisitAlmaMater/VisitAlmaMater.jsx";
import EventsList from "./components/EventsList/EventsList.jsx";
import GalleryList from "./components/GalleryList/GalleryList.jsx";
import "leaflet/dist/leaflet.css";
import AdminUsers from "./pages/AdminUsers.jsx";

/* 🔐 Protected Route */
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) return null;

  if (!user) return <Navigate to="/accounts" replace />;

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loading />}
      <Header />

      <div className="main-content">
        <Routes>
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/about/noticeboard"
            element={
              <ProtectedRoute>
                <Noticeboard />
              </ProtectedRoute>
            }
          />
          <Route path="/about/team" element={<Team />} />
          <Route path="/about/chapterPolicy" element={<ChapterPolicy />} />
          <Route path="/about/codeOfEthics" element={<CodeOfEthics />} />
          <Route
            path="/smart-card"
            element={
              <ProtectedRoute>
                <SmartICardForm />
              </ProtectedRoute>
            }
          />
          <Route path="/events/latestEvents" element={<LatestEvents />} />
          <Route path="/events/reunion" element={<Reunion />} />
          <Route path="/events/chapters" element={<Chapters />} />
          <Route path="/events/list" element={<EventsList />} />

          <Route path="/gallery/list" element={<GalleryList />} />

          <Route path="/updates/magazines" element={<Magazines />} />
          <Route path="/updates/awards" element={<Awards />} />
          <Route path="/updates/alumniNews" element={<AlumniNews />} />

          <Route path="/services/donation" element={<Donation />} />
          <Route
            path="/services/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/alumniDirectory"
            element={<AlumniDirectory />}
          />
          <Route path="/services/alumniNearby" element={<AlumniNearby />} />
          <Route path="/services/getTranscript" element={<GetTranscripts />} />
          <Route path="/services/mentorship" element={<Mentorship />} />
          <Route
            path="/services/visitAlmaMaster"
            element={<VisitAlmaMater />}
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
