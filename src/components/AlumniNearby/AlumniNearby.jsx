import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { db, auth } from "../../firebase";
import { ref, onValue, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
      map.setView([lat, lng], 10, { animate: true });
    }
  }, [lat, lng, map]);

  return null;
};

/* 📍 Avoid overlap */
const jitter = (value, index) => value + index * 0.015;

const AlumniNearby = () => {
  const [cityCounts, setCityCounts] = useState({});
  const [zoomCity, setZoomCity] = useState(null);
  const [approvedUser, setApprovedUser] = useState(false);
  const navigate = useNavigate();

  /* 🔐 Auth check ONLY for permission */
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setApprovedUser(false);
        return;
      }

      const snap = await get(ref(db, `users/${user.uid}`));
      setApprovedUser(!!snap.exists() && snap.val().approved === true);
    });
  }, []);

  /* 🌍 FETCH DATA (PUBLIC vs APPROVED) */
  useEffect(() => {
    const dataRef = approvedUser
      ? ref(db, "users")
      : ref(db, "publicCityStats");

    return onValue(dataRef, (snapshot) => {
      if (!snapshot.exists()) {
        setCityCounts({});
        return;
      }

      /* 🌐 PUBLIC USERS → already grouped */
      if (!approvedUser) {
        setCityCounts(snapshot.val());
        return;
      }

      /* 🔐 APPROVED USERS → group from users */
      const users = Object.entries(snapshot.val())
        .map(([uid, u]) => ({ ...u, uid }))
        .filter((u) => u.city && u.lat && u.lng);

      const grouped = {};

      users.forEach((u) => {
        if (!grouped[u.city]) {
          grouped[u.city] = {
            city: u.city,
            lat: parseFloat(u.lat),
            lng: parseFloat(u.lng),
            count: 1,
            alumni: [
              { uid: u.uid, name: u.fullname, batch: u.batch },
            ],
          };
        } else {
          grouped[u.city].count++;
          grouped[u.city].alumni.push({
            uid: u.uid,
            name: u.fullname,
            batch: u.batch,
          });
        }
      });

      setCityCounts(grouped);
    });
  }, [approvedUser]);

  return (
    <div className="alumni-nearby-page">
      <div className="map-header">
        <h2>Alumni Nearby</h2>
      </div>

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={4}
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
            iconSize: [100, 50],
            iconAnchor: [50, 25],
            popupAnchor: [0, -25],
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
              eventHandlers={{ click: () => setZoomCity(city) }}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{city.city}</h3>
                  <p>Total Alumni: {city.count}</p>

                  {approvedUser ? (
                    <div className="popup-list">
                      {city.alumni?.map((a, i) => (
                        <div
                          key={i}
                          className="popup-item clickable"
                          onClick={() => navigate(`/profile/${a.uid}`)}
                        >
                          <strong>{a.name}</strong>
                          <span className="batch">
                            {" "}
                            (Batch: {a.batch})
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="restricted-text">
                      Login & get approved to view alumni details
                    </p>
                  )}
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
