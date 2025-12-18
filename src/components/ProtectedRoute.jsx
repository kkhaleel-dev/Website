import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setChecking(false);
        return;
      }

      try {
        const snapshot = await get(ref(db, `users/${currentUser.uid}`));
        const data = snapshot.val();

        // If user data is missing, sign out
        if (!data) {
          await signOut(auth);
          setUser(null);
        }
        // Normal user: must be approved
        else if (data.approved || data.role === "admin") {
          // Admin route protection
          if (location.pathname.startsWith("/admin") && data.role !== "admin") {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(currentUser);
          }
        }
        // User not approved
        else {
          await signOut(auth);
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        await signOut(auth);
        setUser(null);
      }

      setChecking(false);
    });

    return () => unsub();
  }, [location.pathname]);

  if (checking) return null; // Replace with <Loading /> if needed

  if (!user) return <Navigate to="/accounts" replace />;

  return children;
};

export default ProtectedRoute;
