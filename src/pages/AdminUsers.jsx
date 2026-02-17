import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { ref, get, set, remove, runTransaction, update } from "firebase/database";
import "./AdminUsers.scss";

const PAGE_SIZE = 8;

const AdminUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [approvedSearch, setApprovedSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  
  //edit users profiles 
  const [editMember, setEditMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const openEditMember = (user) => {
  setEditMember(user);
  setEditFormData({ ...user });
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const updateMember = async () => {
  try {
    const uid = editMember.uid;
    const membershipId = editMember.membershipId;

    // 1️⃣ Update users table
    await update(ref(db, `users/${uid}`), editFormData);

    // 2️⃣ Update publicProfiles if exists
    if (membershipId) {
      await update(
        ref(db, `publicProfiles/${membershipId}`),
        editFormData
      );
    }

    // 3️⃣ Update UI instantly
    setApprovedUsers(prev =>
      prev.map(u =>
        u.uid === uid ? { ...u, ...editFormData } : u
      )
    );

    alert("Member updated successfully");
    setEditMember(null);

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};


  const paginate = (data, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const pendingSnap = await get(ref(db, "UnapprovedUsers"));
      const pendingData = pendingSnap.val() || {};
      setPendingUsers(
        Object.entries(pendingData).map(([uid, data]) => ({ uid, ...data }))
      );

      const usersSnap = await get(ref(db, "users"));
      const usersData = usersSnap.val() || {};
      const usersArr = Object.entries(usersData).map(([uid, user]) => ({ uid, ...user }));

      setApprovedUsers(
        usersArr.filter(u => (u.approved === true || u.approved === "true") && (u.role === "user" || u.role === undefined))
      );

      setAdmins(
        usersArr.filter(
          u => u.role === "admin" && u.isSuperAdmin !== true
        )
      );

      const currentUid = auth.currentUser?.uid;
      setIsSuperAdmin(currentUid && usersData[currentUid]?.isSuperAdmin === true);

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
     ROLE SWITCH HELPERS
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

  //working membership toggle - updates both users/{uid} and publicProfiles/{membershipId}
  // const togglePaidMember = async (uid, current) => {
  //   await update(ref(db, `users/${uid}`), { isPaidMember: !current });
  //   setApprovedUsers(prev => prev.map(u => u.uid === uid ? { ...u, isPaidMember: !current } : u));
  // };
  const togglePaidMember = async (uid, current) => {
  try {
    const userRef = ref(db, `users/${uid}`);
    const userSnap = await get(userRef);

    if (!userSnap.exists()) return;

    const user = userSnap.val();
    const membershipId = user.membershipId;

    const newPaidStatus = !current;

    // 1️⃣ Update users table only
    await update(userRef, { isPaidMember: newPaidStatus });

    // 2️⃣ If turning OFF paid membership → remove from publicProfiles
    if (!newPaidStatus && membershipId) {
      await remove(ref(db, `publicProfiles/${membershipId}`));
    }

    // 3️⃣ If turning ON paid membership → recreate public profile
    if (newPaidStatus && membershipId) {
      const publicProfileData = {
        fullname: user.fullname || "",
        age: user.age || "",
        batch: user.batch || "",
        branch: user.branch || "",
        mobile: user.mobile || "",
        email: user.email || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        profession: user.profession || "",
        website: user.website || "",
        industry: user.industry || "",
        company: user.company || "",
        companySize: user.companySize || "",
        field: user.field || "",
        lat: user.lat || 0,
        lng: user.lng || 0,
        createdAt: user.createdAt || Date.now(),
        approved: true,
        profileImage: user.profileImage || "",
        isPaidMember: true,
        membershipId,
      };

      await set(ref(db, `publicProfiles/${membershipId}`), publicProfileData);
    }

    // 4️⃣ Update UI instantly
    setApprovedUsers(prev =>
      prev.map(u =>
        u.uid === uid ? { ...u, isPaidMember: newPaidStatus } : u
      )
    );

  } catch (err) {
    console.error(err);
    alert("Failed to update membership status");
  }
};


  /* =========================
     APPROVE USER WITH PUBLIC PROFILE CREATION
  ========================= */
  const approveUser = async (uid, user) => {
    if (!window.confirm("Approve this user?")) return;

    try {
      // 1️⃣ Increment membership counter atomically
      const counterRef = ref(db, "meta/membershipCounter");
      const result = await runTransaction(counterRef, c => (c || 0) + 1);
      const count = result.snapshot.val();

      // 2️⃣ Generate membershipId
      const membershipId = `LTM${String(count).padStart(4, "0")}`;

      // 3️⃣ Prepare user data for `users/{uid}`
      const approvedUserData = {
        ...user,
        approved: true,
        role: "user",
        membershipId,
        approvedAt: Date.now(),
        isPaidMember: false,
      };

      // 4️⃣ Save in `users/{uid}`
      await set(ref(db, `users/${uid}`), approvedUserData);

      // 5️⃣ Create publicProfiles/{membershipId} entry
      const publicProfileData = {
        fullname: user.fullname || "",
        age: user.age || "",
        batch: user.batch || "",
        branch: user.branch || "",
        mobile: user.mobile || "",
        email: user.email || "",
        password: user.password || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        profession: user.profession || "",
        website: user.website || "",
        industry: user.industry || "",
        company: user.company || "",
        companySize: user.companySize || "",
        field: user.field || "",
        lat: user.lat || 0,
        lng: user.lng || 0,
        createdAt: user.createdAt || Date.now(),
        approved: true,
        profileImage: user.profileImage || "",
        isPaidMember: false,
        membershipId, // optional to keep same ID here
      };

      await set(ref(db, `publicProfiles/${membershipId}`), publicProfileData);

      // 6️⃣ Remove from UnapprovedUsers
      await remove(ref(db, `UnapprovedUsers/${uid}`));

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  const rejectUser = async (uid) => {
    if (!window.confirm("Reject this user?")) return;
    await remove(ref(db, `UnapprovedUsers/${uid}`));
    fetchAll();
  };

  const removeUser = async (uid) => {
    if (!window.confirm("Remove this user?")) return;

    try {
      const userSnap = await get(ref(db, `users/${uid}`));
      if (!userSnap.exists()) return;

      const user = userSnap.val();
      const membershipId = user.membershipId;

      await remove(ref(db, `users/${uid}`));

      if (membershipId) {
        await remove(ref(db, `publicProfiles/${membershipId}`));
      }

      const counterRef = ref(db, "meta/membershipCounter");
      await runTransaction(counterRef, (c) => (c || 0) - 1);

      await remove(ref(db, `chats/${uid}`));

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to remove user");
    }
  };

  const removeAdmin = async (uid) => {
    if (!window.confirm("Remove this admin?")) return;
    await remove(ref(db, `users/${uid}`));
    fetchAll();
  };

  if (loading) return <p className="admin-loading">Loading...</p>;

  const Pagination = ({ page, total, onChange }) => {
    if (total <= 1) return null;
    return (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
        {Array.from({ length: total }, (_, i) => i + 1).map(p => (
          <button key={p} className={p === page ? "active" : ""} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button disabled={page === total} onClick={() => onChange(page + 1)}>Next</button>
      </div>
    );
  };

  // ✅ Filter approved users based on search AND paid-only toggle
  const filteredApprovedUsers = approvedUsers
    .filter(u => u.fullname.toLowerCase().includes(approvedSearch.toLowerCase()))
    .filter(u => (showPaidOnly ? u.isPaidMember === true : true));

  return (
    <div className="admin-users">
      <h2>Admin User Management</h2>
      {isSuperAdmin && (
        <button
          className="members-fab"
          onClick={() => setShowMembersPopup(true)}
          title="View All Members"
        >
          👥
        </button>
      )}

      {/* Pending Users */}
      <div className="section">
        <h3>Pending Users</h3>
        {pendingUsers.length === 0 ? <p className="empty">No pending users</p> :
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
                  {paginate(pendingUsers, pendingPage).map(u => (
                    <tr key={u.uid}>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td className="actions">
                        <button className="btn-approve" onClick={() => approveUser(u.uid, u)}>Approve</button>
                        <button className="btn-reject" onClick={() => rejectUser(u.uid)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={pendingPage} total={Math.ceil(pendingUsers.length / PAGE_SIZE)} onChange={setPendingPage} />
          </>
        }
      </div>

      {/* Approved Users */}
      <div className="section">
        <h3>Approved Users</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop:"-6px", marginBottom: "10px", marginLeft: "5px" }}>
          <span style={{ fontSize: "0.9rem", color: "#555", fontWeight: 600 }}>
            Total Users: {filteredApprovedUsers.length}
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* Paid Members Button */}
            <button
              onClick={() => { setShowPaidOnly(prev => !prev); setApprovedPage(1); }}
              style={{
                padding: "4px 8px",
                fontSize: "0.85rem",
                borderRadius: "6px",
                border: showPaidOnly ? "1px solid #007BFF" : "1px solid #ccc",
                background: showPaidOnly ? "#007BFF" : "#fff",
                color: showPaidOnly ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {showPaidOnly ? "Showing Paid Members" : "Filter Paid Members"}
            </button>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search person..."
              value={approvedSearch}
              onChange={(e) => { setApprovedSearch(e.target.value); setApprovedPage(1); }}
              style={{
                padding: "4px 8px",
                fontSize: "0.85rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            />
          </div>
        </div>

        {approvedUsers.length === 0 ? <p className="empty">No approved users</p> :
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
                  {paginate(filteredApprovedUsers, approvedPage).map(u => (
                    <tr key={u.uid}>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>{u.membershipId}</td>
                      <td>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={u.isPaidMember === true} onChange={() => togglePaidMember(u.uid, u.isPaidMember)} />
                          <span className="slider" />
                        </label>
                      </td>
                      <td className="actions">
                        {isSuperAdmin && <button className="btn-approve" onClick={() => makeAdmin(u.uid)}>Make Admin</button>}
                        <button className="btn-remove" onClick={() => removeUser(u.uid)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* ✅ Use filteredApprovedUsers for pagination total */}
            <Pagination page={approvedPage} total={Math.ceil(filteredApprovedUsers.length / PAGE_SIZE)} onChange={setApprovedPage} />
          </>
        }
      </div>

      {/* Admins */}
      <div className="section">
        <h3>Admins</h3>
        {admins.length === 0 ? <p className="empty">No admins available</p> :
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
                  {paginate(admins, adminPage).map(a => (
                    <tr key={a.uid}>
                      <td>{a.fullname}</td>
                      <td>{a.email}</td>
                      <td>{a.isSuperAdmin ? "Super Admin" : "Admin"}</td>
                      {isSuperAdmin && auth.currentUser.uid !== a.uid &&
                        <td className="actions">
                          <button className="btn-approve" onClick={() => makeUser(a.uid)}>Make User</button>
                          <button className="btn-remove" onClick={() => removeAdmin(a.uid)}>Remove</button>
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={adminPage} total={Math.ceil(admins.length / PAGE_SIZE)} onChange={setAdminPage} />
          </>
        }
      </div>
      {isSuperAdmin && showMembersPopup && (
      <div className="members-modal-overlay" onClick={() => setShowMembersPopup(false)}>
        <div className="members-modal" onClick={(e) => e.stopPropagation()}>
         <div className="modal-header">
  <h3>All Members</h3>

  <input
    type="text"
    className="member-search"
    placeholder="Search name / membership ID..."
    value={memberSearch}
    onChange={(e) => setMemberSearch(e.target.value)}
  />

  <button
    className="close-btn"
    onClick={() => {
      setShowMembersPopup(false);
      setMemberSearch("");
    }}
  >
    ✕
  </button>
</div>


          <div className="modal-body">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>UID</th>
                  <th>Membership ID</th>
                  <th>Password</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
              {approvedUsers
  .filter(u =>
    u.fullname?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.membershipId?.toLowerCase().includes(memberSearch.toLowerCase())
  )
  .map(u => (

                  <tr key={u.uid}>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td style={{ fontSize: "0.75rem" }}>{u.uid}</td>
                    <td>{u.membershipId}</td>
                    <td>{u.password}</td>
                    <td>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px"
                        }}
                        onClick={() => openEditMember(u)}
                      >
                        ✏️
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
    {editMember && (
 <div className="edit-member-overlay">
  <div className="edit-member-modal">
    
    <div className="edit-member-header">
      <h3>Edit Member</h3>
      <button className="edit-member-close">✕</button>
    </div>

    <div className="edit-member-body">
      <form className="edit-member-form">
  <label>
    Full Name
    <input
      name="fullname"
      value={editFormData.fullname || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Email
    <input
      name="email"
      value={editFormData.email || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Mobile
    <input
      name="mobile"
      value={editFormData.mobile || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Age
    <input
      name="age"
      value={editFormData.age || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Batch
    <input
      name="batch"
      value={editFormData.batch || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Branch
    <input
      name="branch"
      value={editFormData.branch || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    City
    <input
      name="city"
      value={editFormData.city || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    State
    <input
      name="state"
      value={editFormData.state || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Country
    <input
      name="country"
      value={editFormData.country || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Profession
    <input
      name="profession"
      value={editFormData.profession || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Industry
    <input
      name="industry"
      value={editFormData.industry || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Field
    <input
      name="field"
      value={editFormData.field || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Company
    <input
      name="company"
      value={editFormData.company || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Company Size
    <input
      name="companySize"
      value={editFormData.companySize || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Website
    <input
      name="website"
      value={editFormData.website || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Membership ID
    <input
      name="membershipId"
      value={editFormData.membershipId || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Extra Info
    <textarea
      name="extraInfo"
      value={editFormData.extraInfo || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Latitude
    <input
      name="lat"
      value={editFormData.lat || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Longitude
    <input
      name="lng"
      value={editFormData.lng || ""}
      onChange={handleEditChange}
    />
  </label>

  <label>
    Approved
    <select
      name="approved"
      value={editFormData.approved ? "true" : "false"}
      onChange={(e) =>
        setEditFormData({
          ...editFormData,
          approved: e.target.value === "true"
        })
      }
    >
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  </label>

  <label>
    Paid Member
    <select
      name="isPaidMember"
      value={editFormData.isPaidMember ? "true" : "false"}
      onChange={(e) =>
        setEditFormData({
          ...editFormData,
          isPaidMember: e.target.value === "true"
        })
      }
    >
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  </label>

  <label>
    Role
    <input
      name="role"
      value={editFormData.role || ""}
      onChange={handleEditChange}
    />
  </label>
 </form>
    </div>

    <div className="edit-member-footer">
      <button className="edit-btn-cancel" onClick={() => setEditMember(null)}>Cancel</button>
      <button className="edit-btn-save" onClick={updateMember}>Save Changes</button>
    </div>

  </div>
</div>
)}
    </div>
  );
};

export default AdminUsers;
