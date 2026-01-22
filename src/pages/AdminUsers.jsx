import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  ref,
  get,
  set,
  remove,
  runTransaction,
  update,
} from "firebase/database";
import "./AdminUsers.scss";

const PAGE_SIZE = 8;

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);

  const paginate = (data, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };

  /* =========================
     FETCH USERS
     ========================= */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const pendingSnap = await get(ref(db, "UnapprovedUsers"));
      const pendingData = pendingSnap.val() || {};
      setPendingUsers(
        Object.entries(pendingData).map(([uid, data]) => ({
          uid,
          ...data,
        }))
      );

      const usersSnap = await get(ref(db, "users"));
      const usersData = usersSnap.val() || {};
      const usersArr = Object.entries(usersData).map(([uid, user]) => ({
        uid,
        ...user,
      }));

      setApprovedUsers(
        usersArr.filter(
          (u) =>
            (u.approved === true || u.approved === "true") &&
            (u.role === "user" || u.role === undefined)
        )
      );

      setAdmins(usersArr.filter((u) => u.role === "admin"));

      const currentUid = auth.currentUser?.uid;
      setIsSuperAdmin(
        currentUid && usersData[currentUid]?.isSuperAdmin === true
      );

      setPendingPage(1);
      setApprovedPage(1);
      setAdminPage(1);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* =========================
     ⭐ NEW: ROLE SWITCH HELPERS
     ========================= */
  const makeAdmin = async (uid) => {
    if (!window.confirm("Make this user Admin?")) return;
    await update(ref(db, `users/${uid}`), { role: "admin" });
    fetchAll();
  };

  const makeUser = async (uid) => {
    if (!window.confirm("Convert Admin to User?")) return;
    await update(ref(db, `users/${uid}`), { role: "user" });
    fetchAll();
  };

  /* =========================
     TOGGLE PAID MEMBER
     ========================= */
  const togglePaidMember = async (uid, current) => {
    await update(ref(db, `users/${uid}`), {
      isPaidMember: !current,
    });

    setApprovedUsers((prev) =>
      prev.map((u) =>
        u.uid === uid ? { ...u, isPaidMember: !current } : u
      )
    );
  };

  /* =========================
     ACTIONS (UNCHANGED)
     ========================= */
  const approveUser = async (uid, user) => {
    const counterRef = ref(db, "meta/membershipCounter");
    const result = await runTransaction(counterRef, (c) => (c || 0) + 1);
    const count = result.snapshot.val();

    await set(ref(db, `users/${uid}`), {
      ...user,
      approved: true,
      role: "user",
      membershipId: `LTM${String(count).padStart(4, "0")}`,
      approvedAt: Date.now(),
      isPaidMember: false,
    });

    await remove(ref(db, `UnapprovedUsers/${uid}`));
    fetchAll();
  };

  const rejectUser = async (uid) => {
    if (!window.confirm("Reject this user?")) return;
    await remove(ref(db, `UnapprovedUsers/${uid}`));
    fetchAll();
  };

  const removeUser = async (uid) => {
    if (!window.confirm("Remove this user?")) return;
    await remove(ref(db, `users/${uid}`));
    fetchAll();
  };

  const removeAdmin = async (uid) => {
    if (!window.confirm("Remove this admin?")) return;
    await remove(ref(db, `users/${uid}`));
    fetchAll();
  };

  if (loading) return <p className="admin-loading">Loading...</p>;

  /* =========================
     PAGINATION UI (UNCHANGED)
     ========================= */
  const Pagination = ({ page, total, onChange }) => {
    if (total <= 1) return null;

    return (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button disabled={page === total} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    );
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
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(pendingUsers, pendingPage).map((u) => (
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
            </div>

            <Pagination
              page={pendingPage}
              total={Math.ceil(pendingUsers.length / PAGE_SIZE)}
              onChange={setPendingPage}
            />
          </>
        )}
      </div>

      {/* 🟢 Approved Users */}
      <div className="section">
        <h3>Approved Users</h3>

        {approvedUsers.length === 0 ? (
          <p className="empty">No approved users</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Membership</th>
                    <th>Paid</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(approvedUsers, approvedPage).map((u) => (
                    <tr key={u.uid}>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>{u.membershipId}</td>
                      <td>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={u.isPaidMember === true}
                            onChange={() =>
                              togglePaidMember(u.uid, u.isPaidMember)
                            }
                          />
                          <span className="slider" />
                        </label>
                      </td>
                      <td className="actions">
                        {/* ⭐ NEW */}
                        {isSuperAdmin && (
                          <button
                            className="btn-approve"
                            onClick={() => makeAdmin(u.uid)}
                          >
                            Make Admin
                          </button>
                        )}
                        {/* EXISTING */}
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
            </div>

            <Pagination
              page={approvedPage}
              total={Math.ceil(approvedUsers.length / PAGE_SIZE)}
              onChange={setApprovedPage}
            />
          </>
        )}
      </div>

      {/* 🔵 Admins */}
      <div className="section">
        <h3>Admins</h3>

        {admins.length === 0 ? (
          <p className="empty">No admins available</p>
        ) : (
          <>
            <div className="table-wrapper">
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
                  {paginate(admins, adminPage).map((a) => (
                    <tr key={a.uid}>
                      <td>{a.fullname}</td>
                      <td>{a.email}</td>
                      <td>{a.isSuperAdmin ? "Super Admin" : "Admin"}</td>

                      {isSuperAdmin && auth.currentUser.uid !== a.uid && (
                        <td className="actions">
                          {/* ⭐ NEW */}
                          <button
                            className="btn-approve"
                            onClick={() => makeUser(a.uid)}
                          >
                            Make User
                          </button>

                          {/* EXISTING */}
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
            </div>

            <Pagination
              page={adminPage}
              total={Math.ceil(admins.length / PAGE_SIZE)}
              onChange={setAdminPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;




// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import {
//   ref,
//   get,
//   set,
//   remove,
//   runTransaction,
//   update,
// } from "firebase/database";
// import "./AdminUsers.scss";
// import { auth } from "../firebase";

// const AdminUsers = () => {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [approvedUsers, setApprovedUsers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);

//   /* =========================
//      🔄 FETCH ALL USERS
//      ========================= */
//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       /* 🔴 Pending users */
//       const pendingSnap = await get(ref(db, "UnapprovedUsers"));
//       const pendingData = pendingSnap.val() || {};
//       setPendingUsers(
//         Object.entries(pendingData).map(([uid, data]) => ({
//           uid,
//           ...data,
//         }))
//       );

//       /* 🟢 Users (Approved + Admins) */
//       const usersSnap = await get(ref(db, "users"));
//       const usersData = usersSnap.val() || {};

//       const usersArr = Object.entries(usersData).map(([uid, user]) => ({
//         uid,
//         ...user,
//       }));

//       /* ✅ Approved Users */
//       setApprovedUsers(
//         usersArr.filter((u) => {
//           const isApproved =
//             u.approved === true || u.approved === "true";
//           const isUser =
//             u.role === "user" || u.role === undefined;
//           return isApproved && isUser;
//         })
//       );

//       /* 🔵 Admins */
//       setAdmins(usersArr.filter((u) => u.role === "admin"));

//       const currentUid = auth.currentUser?.uid;
//       setIsSuperAdmin(
//         currentUid && usersData[currentUid]?.isSuperAdmin === true
//       );
//     } catch (err) {
//       console.error("READ FAILED:", err);
//       alert("Permission denied or network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   /* =========================
//      🔁 TOGGLE PAID MEMBER
//      ========================= */
//   const togglePaidMember = async (uid, currentValue) => {
//     try {
//       await update(ref(db, `users/${uid}`), {
//         isPaidMember: !currentValue,
//       });

//       // instant UI update
//       setApprovedUsers((prev) =>
//         prev.map((u) =>
//           u.uid === uid ? { ...u, isPaidMember: !currentValue } : u
//         )
//       );
//     } catch (err) {
//       console.error("Failed to update isPaidMember", err);
//       alert("Update failed");
//     }
//   };

//   /* =========================
//      ✅ APPROVE USER
//      ========================= */
//   const approveUser = async (uid, user) => {
//     try {
//       const counterRef = ref(db, "meta/membershipCounter");

//       const result = await runTransaction(counterRef, (current) => {
//         return (current || 0) + 1;
//       });

//       if (!result.committed) throw new Error("Counter failed");

//       const newCount = result.snapshot.val();
//       const membershipId = `LTM${String(newCount).padStart(4, "0")}`;

//       await set(ref(db, `users/${uid}`), {
//         ...user,
//         approved: true,
//         role: "user",
//         membershipId,
//         approvedAt: Date.now(),
//       });

//       await remove(ref(db, `UnapprovedUsers/${uid}`));
//       fetchAll();
//     } catch (err) {
//       console.error(err);
//       alert("Approve failed");
//     }
//   };

//   /* =========================
//      ❌ REJECT USER
//      ========================= */
//   const rejectUser = async (uid) => {
//     if (!window.confirm("Reject this user?")) return;
//     await remove(ref(db, `UnapprovedUsers/${uid}`));
//     fetchAll();
//   };

//   /* =========================
//      🗑 REMOVE APPROVED USER
//      ========================= */
//   const removeUser = async (uid) => {
//     if (!window.confirm("Remove approved user?")) return;
//     await remove(ref(db, `users/${uid}`));
//     fetchAll();
//   };

//   const removeAdmin = async (uid) => {
//     if (!window.confirm("Remove this admin?")) return;
//     await remove(ref(db, `users/${uid}`));
//     fetchAll();
//   };

//   if (loading) return <p className="admin-loading">Loading...</p>;

//   return (
//     <div className="admin-users">
//       <h2>Admin User Management</h2>

//       {/* 🔴 Pending Users */}
//       <div className="section">
//         <h3>Pending Users</h3>
//         {pendingUsers.length === 0 ? (
//           <p className="empty">No pending users</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingUsers.map((u) => (
//                 <tr key={u.uid}>
//                   <td>{u.fullname}</td>
//                   <td>{u.email}</td>
//                   <td className="actions">
//                     <button
//                       className="btn-approve"
//                       onClick={() => approveUser(u.uid, u)}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="btn-reject"
//                       onClick={() => rejectUser(u.uid)}
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* 🟢 Approved Users */}
//       <div className="section">
//         <h3>Approved Users</h3>
//         {approvedUsers.length === 0 ? (
//           <p className="empty">No approved users</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Membership ID</th>
//                 <th>Paid Member</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {approvedUsers.map((u) => (
//                 <tr key={u.uid}>
//                   <td>{u.fullname}</td>
//                   <td>{u.email}</td>
//                   <td className="membership">{u.membershipId}</td>

//                   {/* ✅ NEW TOGGLE */}
//                   <td>
//                     <label className="toggle-switch">
//                       <input
//                         type="checkbox"
//                         checked={u.isPaidMember === true}
//                         onChange={() =>
//                           togglePaidMember(u.uid, u.isPaidMember === true)
//                         }
//                       />
//                       <span className="slider" />
//                     </label>
//                   </td>

//                   <td className="actions">
//                     <button
//                       className="btn-remove"
//                       onClick={() => removeUser(u.uid)}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* 🔵 Admins */}
//       <div className="section admin-section">
//         <h3>Admins</h3>
//         {admins.length === 0 ? (
//           <p className="empty">No admins</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 {isSuperAdmin && <th>Action</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {admins.map((a) => (
//                 <tr key={a.uid}>
//                   <td>{a.fullname}</td>
//                   <td>{a.email}</td>
//                   <td className="role">
//                     {a.isSuperAdmin ? "Super Admin" : "Admin"}
//                   </td>

//                   {isSuperAdmin && auth.currentUser.uid !== a.uid && (
//                     <td className="actions">
//                       <button
//                         className="btn-remove"
//                         onClick={() => removeAdmin(a.uid)}
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;

// //working