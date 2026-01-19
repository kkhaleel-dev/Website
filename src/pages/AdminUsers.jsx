import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  ref,
  get,
  set,
  remove,
  runTransaction,
} from "firebase/database";
import "./AdminUsers.scss";

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // 🔴 Pending users
      const pendingSnap = await get(ref(db, "UnapprovedUsers"));
      const pendingData = pendingSnap.val() || {};
      setPendingUsers(
        Object.entries(pendingData).map(([uid, data]) => ({
          uid,
          ...data,
        }))
      );

      // 🟢 Approved users
      const usersSnap = await get(ref(db, "users"));
      const usersData = usersSnap.val() || {};
      setApprovedUsers(
        Object.entries(usersData)
          .filter(
            ([_, user]) =>
              user.role === "user" && user.approved === true
          )
          .map(([uid, user]) => ({ uid, ...user }))
      );
    } catch (err) {
      console.error("READ FAILED:", err);
      alert("Permission denied (check admin role)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ APPROVE USER
 const approveUser = async (uid, user) => {
  try {
    /* =========================
       1️⃣ Membership Counter
       ========================= */
    const counterRef = ref(db, "meta/membershipCounter");

    const result = await runTransaction(counterRef, (current) => {
      return (current || 0) + 1;
    });

    if (!result.committed) throw new Error("Counter update failed");

    const newCount = result.snapshot.val();
    const membershipId = `LTM${String(newCount).padStart(4, "0")}`;

    /* =========================
       2️⃣ Save Approved User
       ========================= */
    await set(ref(db, `users/${uid}`), {
      ...user,
      approved: true,
      role: "user",
      membershipId,
    });

    /* =========================
       3️⃣ Update publicCityStats
       ========================= */
    if (user.city) {
      const cityName = user.city.trim();
      const cityKey = cityName.toLowerCase(); // 🔑 normalized key

      const lat = Number(user.lat) || 0;
      const lng = Number(user.lng) || 0;

      const cityRef = ref(db, `publicCityStats/${cityKey}`);

      await runTransaction(cityRef, (currentData) => {
        if (currentData) {
          // ✅ City exists → increment only
          return {
            ...currentData,
            count: (currentData.count || 0) + 1,
          };
        }

        // ✅ New city → create full entry
        return {
          city: cityName, // display name
          count: 1,
          lat,
          lng,
          createdAt: Date.now(),
        };
      });
    }

    /* =========================
       4️⃣ Remove from Pending
       ========================= */
    await remove(ref(db, `UnapprovedUsers/${uid}`));

    fetchAll();
  } catch (err) {
    console.error(err);
    alert("Approve failed");
  }
};


  // ❌ Reject user
  const rejectUser = async (uid) => {
    if (!window.confirm("Reject user?")) return;
    await remove(ref(db, `UnapprovedUsers/${uid}`));
    fetchAll();
  };

  // 🗑 Remove approved user
  const removeUser = async (uid) => {
    if (!window.confirm("Remove approved user?")) return;
    await remove(ref(db, `users/${uid}`));
    fetchAll();
  };

  if (loading) return <p className="admin-loading">Loading...</p>;

  return (
    <div className="admin-users">
      <h2>Admin User Management</h2>

      {/* 🔴 Pending Users */}
      <div className="section">
        <h3>Pending Users</h3>

        {pendingUsers.length === 0 ? (
          <p className="empty">No pending users</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((u) => (
                <tr key={u.uid}>
                  <td data-label="Name">{u.fullname}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Action" className="actions">
                    <button
                      className="btn-approve"
                      onClick={() => approveUser(u.uid, u)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => rejectUser(u.uid)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🟢 Approved Users */}
      <div className="section">
        <h3>Approved Users</h3>

        {approvedUsers.length === 0 ? (
          <p className="empty">No approved users</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Membership ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map((u) => (
                <tr key={u.uid}>
                  <td data-label="Name">{u.fullname}</td>
                  <td data-label="Email">{u.email}</td>
                  <td
                    data-label="Membership ID"
                    className="membership"
                  >
                    {u.membershipId}
                  </td>
                  <td data-label="Action" className="actions">
                    <button
                      className="btn-remove"
                      onClick={() => removeUser(u.uid)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
