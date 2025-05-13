import React, { useState, useEffect } from "react";
import "./Profiles.css";

export default function Profiles() {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("/api/getUsers")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users…</p>;
  if (error)   return <p className="error">Error: {error}</p>;

  const closeModal = () => setSelectedUser(null);

  return (
    <div className="profiles-container">
      <h2 className="profiles-title">Saved Profiles</h2>

      {users.length === 0 ? (
        <p>No saved profiles yet.</p>
      ) : (
        <ul className="user-list">
          {users.map((u, i) => {
            // Resolve the image URL for each user
            const imgSrc = u.photo
              ? new URL(`../assets/tutorial-img/${u.photo}`, import.meta.url).href
              : "";

            return (
              <li
                key={i}
                className="user-card"
                onClick={() => setSelectedUser(u)}
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={u.userName || "Guest"}
                    className="user-thumb"
                  />
                )}
                <div className="user-name">{u.userName || "Guest"}</div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedUser && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div
            className="profile-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="profile-modal-close"
              onClick={closeModal}
            >
              &times;
            </button>

            <h3 className="modal-user-name">
              {selectedUser.userName || "Guest"}
            </h3>

            {/* Photo */}
            {selectedUser.photo && (
              <img
                src={
                  new URL(
                    `../assets/tutorial-img/${selectedUser.photo}`,
                    import.meta.url
                  ).href
                }
                alt={selectedUser.userName || "Profile"}
                className="profile-modal-image"
              />
            )}

            <div className="profile-section">
              <strong>Measurements:</strong>
              <ul>
                {selectedUser.measurements.map(m => (
                  <li key={m.label}>{m.label}: {m.value}</li>
                ))}
              </ul>
            </div>

            <div className="profile-section">
              <strong>Recommendations:</strong>
              <ul>
                {selectedUser.recommendations.map(r => (
                  <li key={r.region}>{r.region}: {r.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
