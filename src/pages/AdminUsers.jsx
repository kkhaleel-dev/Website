// AdminUsers.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, get, set, update, remove } from "firebase/database";
import "./AdminUsers.scss";

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      /* 🔹 FETCH PENDING USERS */
      const pendingSnap = await get(ref(db, "UnapprovedUsers"));
      const pendingData = pendingSnap.exists() ? pendingSnap.val() : {};

      const pending = Object.entries(pendingData).map(([uid, user]) => ({
        uid,
        ...user,
      }));

      /* 🔹 FETCH APPROVED USERS */
      const approvedSnap = await get(ref(db, "users"));
      const approvedData = approvedSnap.exists() ? approvedSnap.val() : {};

      const approved = Object.entries(approvedData)
        .map(([uid, user]) => ({ uid, ...user }))
        .filter((u) => u.role === "user" && u.approved === true);

      setPendingUsers(pending);
      setApprovedUsers(approved);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ✅ APPROVE USER */
  const handleApprove = async (uid) => {
    try {
      const snap = await get(ref(db, `UnapprovedUsers/${uid}`));
      if (!snap.exists()) return alert("User not found");

      const user = snap.val();

      /* 1️⃣ MOVE TO users */
      await set(ref(db, `users/${uid}`), {
        ...user,
        approved: true,
      });

      /* 2️⃣ MEMBERSHIP COUNTER */
      const counterRef = ref(db, "membershipCounter");
      const counterSnap = await get(counterRef);
      const count = counterSnap.exists() ? counterSnap.val() : 0;
      await set(counterRef, count + 1);

      /* 3️⃣ PUBLIC CITY STATS */
      const cityRef = ref(db, `publicCityStats/${user.city}`);
      const citySnap = await get(cityRef);

      if (!citySnap.exists()) {
        await set(cityRef, {
          city: user.city,
          count: 1,
          lat: user.lat,
          lng: user.lng,
        });
      } else {
        await update(cityRef, {
          count: citySnap.val().count + 1,
        });
      }

      /* 4️⃣ TEAM PREVIEW (LAST 5) */
      const teamRef = ref(db, "publicTeamPreview");
      const teamSnap = await get(teamRef);
      const team = teamSnap.exists() ? teamSnap.val() : {};

      const teamArr = Object.values(team);
      teamArr.push({
        fullname: user.fullname,
        batch: user.batch,
        city: user.city,
        age: user.age,
      });

      const lastFive = teamArr.slice(-5);

      const newTeam = {};
      lastFive.forEach((u, i) => {
        newTeam[`member_${i}`] = u;
      });

      await set(teamRef, newTeam);

      /* 5️⃣ REMOVE FROM UnapprovedUsers */
      await remove(ref(db, `UnapprovedUsers/${uid}`));

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  /* ❌ REJECT USER */
  const handleReject = async (uid) => {
    if (!window.confirm("Reject and delete this user?")) return;
    await remove(ref(db, `UnapprovedUsers/${uid}`));
    fetchUsers();
  };

  /* 🗑 REMOVE APPROVED USER */
  const handleRemoveApproved = async (uid) => {
    if (!window.confirm("Remove this approved user?")) return;
    await remove(ref(db, `users/${uid}`));
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <h3>Pending Users</h3>
          {pendingUsers.length === 0 ? (
            <p>No pending users</p>
          ) : (
            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Membership ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u.uid}>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>{u.membershipId}</td>
                    <td>
                      <button onClick={() => handleApprove(u.uid)}>Approve</button>
                      <button onClick={() => handleReject(u.uid)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3>Approved Users</h3>
          {approvedUsers.length === 0 ? (
            <p>No approved users yet</p>
          ) : (
            <table border="1" cellPadding="10">
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
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>{u.membershipId}</td>
                    <td>
                      <button onClick={() => handleRemoveApproved(u.uid)}>
                        Remove User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
