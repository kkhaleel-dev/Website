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
import { auth } from "../firebase";

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  /* =========================
     🔄 FETCH ALL USERS
     ========================= */
  const fetchAll = async () => {
    setLoading(true);
    try {
      /* 🔴 Pending users */
      const pendingSnap = await get(ref(db, "UnapprovedUsers"));
      const pendingData = pendingSnap.val() || {};
      setPendingUsers(
        Object.entries(pendingData).map(([uid, data]) => ({
          uid,
          ...data,
        }))
      );

      /* 🟢 Users (Approved + Admins) */
      const usersSnap = await get(ref(db, "users"));
      const usersData = usersSnap.val() || {};

      const usersArr = Object.entries(usersData).map(([uid, user]) => ({
        uid,
        ...user,
      }));

      /* ✅ Approved Users (FIXED FILTER) */
      setApprovedUsers(
        usersArr.filter((u) => {
          const isApproved =
            u.approved === true || u.approved === "true";

          const isUser =
            u.role === "user" || u.role === undefined;

          return isApproved && isUser;
        })
      );

      /* 🔵 Admins */
      setAdmins(
        usersArr.filter((u) => u.role === "admin")
      );
      const currentUid = auth.currentUser?.uid;

if (currentUid && usersData[currentUid]?.isSuperAdmin === true) {
  setIsSuperAdmin(true);
} else {
  setIsSuperAdmin(false);
}

    } catch (err) {
      console.error("READ FAILED:", err);
      alert("Permission denied or network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* =========================
     ✅ APPROVE USER
     ========================= */
  const approveUser = async (uid, user) => {
    try {
      /* 1️⃣ Membership Counter */
      const counterRef = ref(db, "meta/membershipCounter");

      const result = await runTransaction(counterRef, (current) => {
        return (current || 0) + 1;
      });

      if (!result.committed) throw new Error("Counter failed");

      const newCount = result.snapshot.val();
      const membershipId = `LTM${String(newCount).padStart(4, "0")}`;

      /* 2️⃣ Save Approved User */
      await set(ref(db, `users/${uid}`), {
        ...user,
        approved: true,
        role: "user",
        membershipId,
        approvedAt: Date.now(),
      });

      /* 3️⃣ Update publicCityStats */
      if (user.city) {
        const cityName = user.city.trim();
        const cityKey = cityName.toLowerCase();

        const lat = Number(user.lat) || 0;
        const lng = Number(user.lng) || 0;

        const cityRef = ref(db, `publicCityStats/${cityKey}`);

        await runTransaction(cityRef, (currentData) => {
          if (currentData) {
            return {
              ...currentData,
              count: (currentData.count || 0) + 1,
            };
          }

          return {
            city: cityName,
            count: 1,
            lat,
            lng,
            createdAt: Date.now(),
          };
        });
      }

      /* 4️⃣ Remove from Pending */
      await remove(ref(db, `UnapprovedUsers/${uid}`));

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    }
  };

  /* =========================
     ❌ REJECT USER
     ========================= */
  const rejectUser = async (uid) => {
    if (!window.confirm("Reject this user?")) return;
    await remove(ref(db, `UnapprovedUsers/${uid}`));
    fetchAll();
  };

  /* =========================
     🗑 REMOVE APPROVED USER
     ========================= */
  const removeUser = async (uid) => {
    if (!window.confirm("Remove approved user?")) return;
    await remove(ref(db, `users/${uid}`));
    fetchAll();
  };

  if (loading) return <p className="admin-loading">Loading...</p>;
const removeAdmin = async (uid) => {
  if (!window.confirm("Remove this admin?")) return;
  await remove(ref(db, `users/${uid}`));
  fetchAll();
};

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
                  <td>{u.fullname}</td>
                  <td>{u.email}</td>
                  <td className="actions">
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
                  <td>{u.fullname}</td>
                  <td>{u.email}</td>
                  <td className="membership">{u.membershipId}</td>
                  <td className="actions">
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

      {/* 🔵 Admins */}
    {/* 🔵 Admins */}
<div className="section admin-section">
  <h3>Admins</h3>

  {admins.length === 0 ? (
    <p className="empty">No admins</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          {isSuperAdmin && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {admins.map((a) => (
          <tr key={a.uid}>
            <td>{a.fullname}</td>
            <td>{a.email}</td>
            <td className="role">
              {a.isSuperAdmin ? "Super Admin" : "Admin"}
            </td>

            {isSuperAdmin && auth.currentUser.uid !== a.uid && (
              <td className="actions">
                <button
                  className="btn-remove"
                  onClick={() => removeAdmin(a.uid)}
                >
                  Remove
                </button>
              </td>
            )}
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
