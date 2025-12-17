import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { db, auth } from "../../firebase";
import { ref, onValue, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "leaflet/dist/leaflet.css";
import "./AlumniNearby.scss";

/* 🎨 Unique color per city */
const getCityColor = (city) => {
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 65%)`;
};

/* 🎯 Zoom to city */
const ZoomToCity = ({ lat, lng }) => {
  const map = useMap();

  React.useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 10, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [lat, lng, map]);

  return null;
};

/* 📍 Avoid overlap */
const jitter = (value, index) => value + index * 0.015;

const AlumniNearby = () => {
  const [cityCounts, setCityCounts] = useState({});
  const [zoomCity, setZoomCity] = useState(null);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);

  /* 🔐 Get logged-in user's location */
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const snap = await get(ref(db, `users/${user.uid}`));
      if (snap.exists()) {
        const { city, state, country } = snap.val();
        setCurrentUserLocation({ city, state, country });
      }
    });
  }, []);

  /* 🌍 Fetch & filter alumni */
  useEffect(() => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      if (!snapshot.exists()) return;

      let users = Object.values(snapshot.val()).filter(
        (u) => u.city && u.lat && u.lng
      );

      // 🔎 Apply location-based filtering
      if (currentUserLocation) {
        const { city, state, country } = currentUserLocation;

        const cityMatch = users.filter((u) => u.city === city);
        const stateMatch = users.filter((u) => u.state === state);
        const countryMatch = users.filter((u) => u.country === country);

        users =
          cityMatch.length > 0
            ? cityMatch
            : stateMatch.length > 0
            ? stateMatch
            : countryMatch.length > 0
            ? countryMatch
            : users;
      }

      // 🧠 Group by city
      const grouped = {};
      users.forEach((u) => {
        if (!grouped[u.city]) {
          grouped[u.city] = {
            city: u.city,
            lat: parseFloat(u.lat),
            lng: parseFloat(u.lng),
            count: 1,
            alumni: [{ name: u.fullname, batch: u.batch }],
          };
        } else {
          grouped[u.city].count++;
          grouped[u.city].alumni.push({
            name: u.fullname,
            batch: u.batch,
          });
        }
      });

      setCityCounts(grouped);
    });
  }, [currentUserLocation]);

  return (
    <div className="alumni-nearby-page">
      <div className="map-header">
        <h2>Alumni Nearby</h2>
      </div>

      <MapContainer
        center={[22.9734, 78.6569]} // India default
        zoom={5}
        style={{ width: "100%", height: "80vh" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zoomCity && <ZoomToCity lat={zoomCity.lat} lng={zoomCity.lng} />}

        {Object.values(cityCounts).map((city, index) => {
          const icon = L.divIcon({
            className: "city-marker",
            html: `
              <div class="city-badge" style="background:${getCityColor(
                city.city
              )}">
                <div class="city-name">${city.city}</div>
                <div class="city-count">${city.count}</div>
              </div>
            `,
          });

          return (
            <Marker
              key={city.city}
              position={[jitter(city.lat, index), jitter(city.lng, index)]}
              icon={icon}
              eventHandlers={{
                click: () => setZoomCity(city),
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{city.city}</h3>
                  <p>Total Alumni: {city.count}</p>
                  <div className="popup-list">
                    {city.alumni.map((alumni, i) => (
                      <div key={i} className="popup-item">
                        <strong>{alumni.name}</strong>
                        <span className="batch"> (Batch: {alumni.batch})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AlumniNearby;
