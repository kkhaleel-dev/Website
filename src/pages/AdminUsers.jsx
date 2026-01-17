import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, get, update, remove } from "firebase/database";
import "./AdminUsers.scss";

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from DB
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(db, "users"));
      const allUsers = snapshot.val() || {};
      const pending = [];
      const approved = [];

      Object.entries(allUsers).forEach(([uid, user]) => {
        if (user.role === "user") {
          if (!user.approved) pending.push({ uid, ...user });
          else approved.push({ uid, ...user });
        }
      });

      setPendingUsers(pending);
      setApprovedUsers(approved);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve a pending user
  const handleApprove = async (uid) => {
    try {
      await update(ref(db, `users/${uid}`), { approved: true });
      fetchUsers();
    } catch (err) {
      console.error("Error approving user:", err);
      alert("Failed to approve user");
    }
  };

  // Reject / delete a pending user
  const handleReject = async (uid) => {
    try {
      if (window.confirm("Are you sure you want to reject and delete this user?")) {
        await remove(ref(db, `users/${uid}`));
        fetchUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // Remove an approved user from DB
  const handleRemoveApproved = async (uid) => {
    try {
      if (window.confirm("Are you sure you want to remove this user?")) {
        await remove(ref(db, `users/${uid}`));
        fetchUsers();
      }
    } catch (err) {
      console.error("Error removing approved user:", err);
      alert("Failed to remove user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {/* Pending Users Table */}
          <h3>Pending Users</h3>
          {pendingUsers.length === 0 ? (
            <p>No pending users</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Membership ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.membershipId}</td>
                    <td>
                      <button onClick={() => handleApprove(user.uid)}>Approve</button>
                      <button onClick={() => handleReject(user.uid)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Approved Users Table */}
          <h3>Approved Users</h3>
          {approvedUsers.length === 0 ? (
            <p>No approved users yet</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Membership ID</th>
                  <th>Status / Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.membershipId}</td>
                    <td>
                      <button disabled style={{ marginRight: "10px" }}>
                        Approved
                      </button>
                      <button onClick={() => handleRemoveApproved(user.uid)}>Remove User</button>
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
