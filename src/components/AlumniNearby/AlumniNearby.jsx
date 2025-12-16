import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "./AlumniNearby.scss";

const mapContainerStyle = { width: "100%", height: "80vh" };
const defaultCenter = { lat: 20, lng: 0 }; // World center

const AlumniNearby = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        // Check if user is logged in
        onAuthStateChanged(auth, async (user) => {
          let allUsers = [];
          if (user) {
            // Logged-in user: get their city
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setUserCity(userData.city);
            }
          }

          // Fetch all users from DB
          const usersRef = ref(db, "users");
          const snapshot = await get(usersRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            allUsers = Object.keys(data)
              .filter((uid) => data[uid].city && data[uid].lat && data[uid].lng)
              .map((uid) => ({
                id: uid,
                fullname: data[uid].fullname || "Unnamed",
                city: data[uid].city,
                lat: parseFloat(data[uid].lat),
                lng: parseFloat(data[uid].lng),
              }));
          }

          // Filter for logged-in user city
          if (userCity) {
            allUsers = allUsers.filter((u) => u.city === userCity);
          }

          setAlumniData(allUsers);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [userCity]);

  const handleFilterClick = () => {
    if (!auth.currentUser) {
      navigate("/accounts");
    }
  };

  // Aggregate by city
  const cityCounts = alumniData.reduce((acc, curr) => {
    const city = curr.city;
    if (acc[city]) {
      acc[city].count += 1;
      acc[city].alumni.push(curr);
    } else {
      acc[city] = { count: 1, alumni: [curr], lat: curr.lat, lng: curr.lng };
    }
    return acc;
  }, {});

  if (loading) return <p>Loading map...</p>;

  return (
    <div className="alumni-nearby-page">
      <div className="map-header">
        <h2>Alumni Nearby</h2>
        <button className="filter-btn" onClick={handleFilterClick}>
          Filter
        </button>
      </div>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={2}
        >
          {Object.keys(cityCounts).map((city) => {
            const info = cityCounts[city];
            return (
              <Marker
                key={city}
                position={{ lat: info.lat, lng: info.lng }}
                onClick={() => setSelected(info)}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                  fillColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  fillOpacity: 0.8,
                  strokeWeight: 1,
                  scale: 1.5,
                }}
              />
            );
          })}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h3>{selected.alumni[0].city}</h3>
                <p>Alumni Count: {selected.count}</p>
                <ul>
                  {selected.alumni.map((a) => (
                    <li key={a.id}>{a.fullname}</li>
                  ))}
                </ul>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default AlumniNearby;
