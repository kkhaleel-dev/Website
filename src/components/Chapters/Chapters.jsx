import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import "./Chapters.scss";

const Chapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChaptersData = async () => {
      try {
        /* 🔢 Fetch users for Chennai count */
        const snapshot = await get(ref(db, "users"));
        let chennaiCount = 0;

        if (snapshot.exists()) {
          const users = snapshot.val();

          chennaiCount = Object.keys(users).filter((uid) => {
            const u = users[uid];
            return (
              // u.isPaidMember === true &&
              u.approved === true &&
              u.membershipId &&
              u.membershipId.trim() !== ""
            );
          }).length;
        }

        /* 📦 Chapters data */
        const data = [
          {
            id: 1,
            name: "Chennai Chapter",
            slug: "chennaiChapter",
            members: chennaiCount, // ✅ dynamic
            location: "Chennai, Tamil Nadu, India",
            image:
              "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
            enabled: true,
          },
          {
            id: 2,
            name: "Bangalore Chapter",
            members: 0,
            location: "Bangalore, Karnataka, India",
            image:
              "https://images.unsplash.com/photo-1596176530529-78163a4f7af2",
            enabled: false,
          },
          {
            id: 3,
            name: "Mumbai Chapter",
            members: 0,
            location: "Mumbai, Maharashtra, India",
            image:
              "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
            enabled: false,
          },
          {
            id: 4,
            name: "US Chapter",
            members: 0,
            location: "United States of America",
            image:
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
            enabled: false,
          },
          {
            id: 5,
            name: "UK Chapter",
            members: 0,
            location: "United Kingdom",
            image:
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            enabled: false,
          },
        ];

        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapter counts:", error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChaptersData();
  }, []);

  const handleViewChapter = (chapter) => {
    if (!chapter.enabled) return;
    navigate(`/events/chapters/${chapter.slug}`);
  };

  if (loading) {
    return <p className="no-chapters">Loading chapters...</p>;
  }

  return (
    <div className="chapters-page">
      <div className="chapters-header">
        <h2>Alumni Chapters</h2>
        <p>
          CIT alumni chapters across India and abroad strengthen
          professional networking, mentorship, and lifelong connections.
        </p>
      </div>

      {chapters.length === 0 ? (
        <p className="no-chapters">Approved Users can view Chapters</p>
      ) : (
        <div className="chapters-grid">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`chapter-card ${
                !chapter.enabled ? "disabled" : ""
              }`}
            >
              <div className="chapter-image">
                <img src={chapter.image} alt={chapter.name} />
              </div>

              <div className="chapter-content">
                <h3>{chapter.name}</h3>

                <span className="chapter-location">
                  {chapter.location}
                </span>

                <span className="chapter-members">
                  {chapter.members}+ Members
                </span>

                <button
                  className="chapter-link"
                  disabled={!chapter.enabled}
                  onClick={() => handleViewChapter(chapter)}
                >
                  {chapter.enabled
                    ? "View Chapter →"
                    : "Coming Soon"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chapters;
