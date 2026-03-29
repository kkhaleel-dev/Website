import React, { useEffect, useState } from "react";
import "./Jobs.scss";

import { ref, onValue, push, update, remove } from "firebase/database";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  experience: "",
  description: "",
  applyLink: ""
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* 🔐 Role */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snap) => {
        setIsAdmin(snap.val()?.role === "admin");
      });
    });
  }, []);

  /* 📥 Jobs */
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

  /* 🕒 Date */
  const formatDate = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  /* ✅ SMART URL HANDLER (UPDATED) */
  const fixUrl = (input) => {
    if (!input) return "";

    const value = input.trim();

    // if already full URL
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    // if looks like domain (contains dot)
    if (value.includes(".")) {
      return `https://${value}`;
    }

    // otherwise → Google search
    return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openCreateModal = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const saveJob = async () => {
    if (!form.title || !form.company || !form.experience) {
      alert("Title, Company and Experience are required");
      return;
    }

    if (editingJob) {
      await update(ref(db, `joblistings/${editingJob.id}`), form);
    } else {
      await push(ref(db, "joblistings"), {
        ...form,
        createdAt: Date.now(),
        createdBy: auth.currentUser.uid
      });
    }

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
    setForm(emptyForm);
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await remove(ref(db, `joblistings/${id}`));
  };

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h2>Alumni Job Opportunities</h2>

        {isAdmin && (
          <button className="add-job-btn" onClick={openCreateModal}>
            Add Job
          </button>
        )}
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>

            <div className="posted-date">
              {formatDate(job.createdAt)}
            </div>

            <div className="job-main">
              <h3>{job.title}</h3>
              <span>{job.company}</span>
              <span>{job.location}</span>
              <span>Exp: {job.experience}</span>
              <p>{job.description}</p>
            </div>

            <div className="bottom-section">

              <div className="action-row">

                {job.applyLink && (
                  <a
                    href={fixUrl(job.applyLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-btn"
                  >
                    Apply ↗
                  </a>
                )}

                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setForm(job);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button onClick={() => deleteJob(job.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>

              <div
                className="show-more"
                onClick={() => setViewJob(job)}
              >
                Show more →
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="job-modal">
          <div className="modal-content">
            <h3>{editingJob ? "Edit Job" : "Create Job"}</h3>

            <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" />
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company" />
            <input name="applyLink" value={form.applyLink} onChange={handleChange} placeholder="Website / URL / Keyword" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

            <div className="modal-actions">
              <button onClick={saveJob}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewJob && (
        <div className="view-modal" onClick={() => setViewJob(null)}>
          <div className="view-content" onClick={(e) => e.stopPropagation()}>
            <h2>{viewJob.title}</h2>
            <h4>{viewJob.company}</h4>

            <p><b>Location:</b> {viewJob.location}</p>
            <p><b>Experience:</b> {viewJob.experience}</p>

            <div className="view-description">
              {viewJob.description}
            </div>

            {viewJob.applyLink && (
              <a
                href={fixUrl(viewJob.applyLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn full"
              >
                Apply Now ↗
              </a>
            )}

            <button onClick={() => setViewJob(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;