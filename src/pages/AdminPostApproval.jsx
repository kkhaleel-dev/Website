import React, { useEffect, useState } from "react";
import { ref, onValue, update, remove, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import "./AdminPostApproval.scss";

const PAGE_SIZE = 8;

const AdminPostApproval = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);

  const paginate = (data, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };

  const Pagination = ({ page, total, onChange }) => {
    if (total <= 1) return null;
    return (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
        {Array.from({ length: total }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button disabled={page === total} onClick={() => onChange(page + 1)}>Next</button>
      </div>
    );
  };

  /* ===== AUTH ===== */
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u || null);
      if (!u) return;

      const snap = await get(ref(db, `users/${u.uid}`));
      if (snap.exists()) setUserData(snap.val());
    });
  }, []);

  const isAdmin = userData?.role === "admin";

  /* ===== LOAD POSTS ===== */
  useEffect(() => {
    if (!currentUser) return;

    const postsRef = ref(db, "postsList");
    return onValue(postsRef, (snap) => {
      if (!snap.exists()) {
        setPendingPosts([]);
        setApprovedPosts([]);
        setUserPosts([]);
        return;
      }

      const allPosts = Object.values(snap.val()).sort(
        (a, b) => b.createdAt - a.createdAt
      );

      if (isAdmin) {
        setPendingPosts(allPosts.filter((p) => p.approved === false));
        setApprovedPosts(allPosts.filter((p) => p.approved === true));
      } else {
        setUserPosts(
          allPosts.filter((p) => p.createdBy === currentUser.uid)
        );
      }
    });
  }, [isAdmin, currentUser]);

  /* ===== ACTIONS ===== */
  const approvePost = async (id) => {
    await update(ref(db, `postsList/${id}`), { approved: true });
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await remove(ref(db, `postsList/${id}`));
  };

  if (!currentUser) {
    return <div className="admin-denied">Please login</div>;
  }

  return (
    <section className="admin-posts admin-users">
      <h2>{isAdmin ? "Posts Management" : "My Posts"}</h2>

      {/* ================= ADMIN VIEW ================= */}
      {isAdmin && (
        <>
          {/* ===== PENDING ===== */}
          <div className="section">
            <h3>Pending Approval</h3>
            {pendingPosts.length === 0 ? (
              <p className="empty">No pending posts</p>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Content</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(pendingPosts, pendingPage).map((p) => (
                        <tr key={p.id}>
                          <td data-label="User">{p.createdByName}</td>
                          <td data-label="Content" className="content-cell">
                            {p.image && <img src={p.image} alt="" />}
                            <span>{p.content}</span>
                          </td>
                          <td data-label="Created">{new Date(p.createdAt).toLocaleString()}</td>
                          <td data-label="Actions" className="actions">
                            <button className="btn-approve" onClick={() => approvePost(p.id)}>Approve</button>
                            <button className="btn-reject" onClick={() => deletePost(p.id)}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={pendingPage}
                  total={Math.ceil(pendingPosts.length / PAGE_SIZE)}
                  onChange={setPendingPage}
                />
              </>
            )}
          </div>

          {/* ===== APPROVED ===== */}
          <div className="section">
            <h3>Approved Posts</h3>
            {approvedPosts.length === 0 ? (
              <p className="empty">No approved posts</p>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Content</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(approvedPosts, approvedPage).map((p) => (
                        <tr key={p.id}>
                          <td data-label="User">{p.createdByName}</td>
                          <td data-label="Content" className="content-cell">
                            {p.image && <img src={p.image} alt="" />}
                            <span>{p.content}</span>
                          </td>
                          <td data-label="Created">{new Date(p.createdAt).toLocaleString()}</td>
                          <td data-label="Actions" className="actions">
                            <button className="btn-remove" onClick={() => deletePost(p.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={approvedPage}
                  total={Math.ceil(approvedPosts.length / PAGE_SIZE)}
                  onChange={setApprovedPage}
                />
              </>
            )}
          </div>
        </>
      )}

      {/* ================= USER VIEW ================= */}
      {!isAdmin && (
        <div className="section">
          <h3>My Posts</h3>
          {userPosts.length === 0 ? (
            <p className="empty">No posts yet</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(userPosts, 1).map((p) => (
                    <tr key={p.id}>
                      <td data-label="Content" className="content-cell">
                        {p.image && <img src={p.image} alt="" />}
                        <span>{p.content}</span>
                      </td>
                      <td data-label="Status">
                        {p.approved ? (
                          <span className="status approved">Approved</span>
                        ) : (
                          <span className="status waiting">Waiting for approval</span>
                        )}
                      </td>
                      <td data-label="Created">{new Date(p.createdAt).toLocaleString()}</td>
                      <td data-label="Actions" className="actions">
                        {p.approved && <button className="btn-remove" onClick={() => deletePost(p.id)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminPostApproval;
