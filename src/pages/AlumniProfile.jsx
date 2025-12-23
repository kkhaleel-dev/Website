import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import defaultProfile from "../assets/person-logo.png";
import "./AlumniProfile.scss";

const AlumniProfile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    get(ref(db, `users/${uid}`)).then((snap) => {
      if (snap.exists()) setUser(snap.val());
    });
  }, [uid]);

  if (!user) return null;

  const bioText =
    user.description ||
    "This alumnus is a valued member of our academic community, known for their dedication, adaptability, and continuous pursuit of growth. Their journey reflects commitment, learning, and meaningful contribution.";

  return (
    <section className="profile-page">
      <div className="profile-wrapper">
        <div className="profile-left">
          <img
            src={user.profileImage || defaultProfile}
            alt={user.fullname}
          />
        </div>

        <div className="profile-right">
          <h1>{user.fullname}</h1>

          <div className="profile-meta">
            <span>Batch {user.batch}</span>
            {user.branch && <span>{user.branch}</span>}
          </div>

          <div className="profile-location">
            {user.city}, {user.state}, {user.country}
          </div>

          <div className="profile-bio">
            <h3>Biography</h3>
            <p>{bioText}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlumniProfile;

