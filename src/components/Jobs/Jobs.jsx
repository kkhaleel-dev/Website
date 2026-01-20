import React, { useEffect, useState } from "react";
import "./Jobs.scss";
import { ref, onValue, push, update, remove } from "firebase/database";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    experience: "",
    description: ""
  });

  // 🔐 Check role
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snap) => {
        const data = snap.val();
        setIsAdmin(data?.role === "admin");
      });
    });
  }, []);

  // 📥 Fetch jobs
  useEffect(() => {
    const jobsRef = ref(db, "joblistings");
    onValue(jobsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({
        id,
        ...val
      }));
      setJobs(list.reverse());
    });
  }, []);

  // ✏️ Handle form input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 Save job
  const saveJob = async () => {
    if (!form.title || !form.company) return alert("Missing fields");

    const jobsRef = ref(db, "joblistings");

    if (editingJob) {
      await update(ref(db, `joblistings/${editingJob.id}`), form);
    } else {
      await push(jobsRef, {
        ...form,
        createdAt: Date.now(),
        createdBy: auth.currentUser.uid
      });
    }

    setShowModal(false);
    setEditingJob(null);
    setForm({
      title: "",
      company: "",
      location: "",
      experience: "",
      description: ""
    });
  };

  // 🗑 Delete job
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await remove(ref(db, `joblistings/${id}`));
  };

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h2>Alumni Job Opportunities</h2>

        {isAdmin && (
          <button className="add-job-btn" onClick={() => setShowModal(true)}>
            + Add Job
          </button>
        )}
      </div>

     {jobs.length === 0 ? (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
      width: "100%",
      fontSize: "18px",
      fontWeight: "500",
      color: "#666",
      textAlign: "center",
    }}
  >
    There are still no openings
  </div>
) : (
  <div className="jobs-grid">
    {jobs.map((job) => (
      <div className="job-card" key={job.id}>
        <h3>{job.title}</h3>
        <span>{job.company}</span>
        <span>{job.location}</span>
        <span>Experience: {job.experience}</span>
        <p>{job.description}</p>

        {isAdmin && (
          <div className="job-actions">
            <button
              onClick={() => {
                setEditingJob(job);
                setForm(job);
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteJob(job.id)}>Delete</button>
          </div>
        )}
      </div>
    ))}
  </div>
)}


      {/* 🔲 MODAL */}
      {showModal && (
        <div className="job-modal">
          <div className="modal-content">
            <h3>{editingJob ? "Edit Job" : "Create Job"}</h3>

            <input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} />
            <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <input name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

            <div className="modal-actions">
              <button onClick={saveJob}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
