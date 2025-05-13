// src/components/ResultsMeasurements.jsx

import React, { useState, useEffect } from 'react';
import './ResultsMeasurements.css';
import characterImg from '../assets/tutorial-img/11.png';

export default function ResultsMeasurements({ onClose }) {
  // ─── Sample Data ─────────────────────────────────────────────────────────────
  const sampleMeasurements = [
    { label: 'Chest',          value: '86 cm' },
    { label: 'Waist',          value: '72 cm' },
    { label: 'Hip',            value: '90 cm' },
    { label: 'Shoulder Width', value: '42 cm' },
    { label: 'Thigh',          value: '55 cm' },
  ];
  const sizeRecommendations = [
    { region: 'Asia', label: 'XL' },
    { region: 'US',   label: 'XXL' },
    { region: 'EU',   label: 'L'  },
  ];

  // ─── State ─────────────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen]     = useState(false);
  const [userName, setUserName] = useState('');

  // ─── Lifecycle ─────────────────────────────────────────────────────────────────
  useEffect(() => setIsOpen(true), []);
  if (!isOpen) return null;

  // ─── Save Handler ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    // **IMPORTANT**: absolute URL to your Express server
    const endpoint = 'http://localhost:5000/api/saveUserData';
    console.log('Posting to', endpoint);

    const payload = {
      userName,
      measurements: sampleMeasurements,
      recommendations: sizeRecommendations,
      photo: '11.png'
    };

    try {
      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Non-JSON response:\n${text.slice(0,200)}`);
      }

      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      alert(`✅ Saved file: ${json.file}`);
    } catch (err) {
      alert(`❌ Save failed: ${err.message}`);
      console.error(err);
    } finally {
      onClose();
      window.location.reload();
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="rm-modal-overlay">
      <div className="rm-modal">
        <button className="rm-btn-close" onClick={onClose}>&times;</button>
        <h2 className="rm-modal__title">Measurement Results</h2>

        <div className="rm-name-input-wrapper">
          <input
            type="text"
            className="rm-name-input"
            placeholder="Enter your name (optional)"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>

        <div className="rm-modal__content">
          <div className="rm-measurements" style={{ flex: 2, position: 'relative' }}>
            <ul className="rm-modal__list">
              {sampleMeasurements.map(({ label, value }) => (
                <li key={label} className="rm-modal__item">
                  <span className="rm-label">{label}</span>
                  <span className="rm-value">{value}</span>
                </li>
              ))}
            </ul>
            <img src={characterImg} alt="Character" className="rm-character-img" />
          </div>

          <div
            className="rm-recommendations-card"
            style={{
              flex: 1,
              marginLeft: '1.5rem',
              background: 'rgba(221, 200, 163, 0.2)',
              border: '2px solid var(--rm-border)',
              borderRadius: '0.8rem',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <h3 className="rm-recommendations__title" style={{ margin: '0 0 0.5rem' }}>
              Recommended Sizes
            </h3>
            <ul className="rm-recommendations__list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sizeRecommendations.map(({ region, label }) => (
                <li key={region} className="rm-recommendations__item" style={{ margin: '0.3rem 0' }}>
                  <strong style={{ marginRight: '0.5rem' }}>{region}:</strong>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rm-modal__actions">
          <button className="rm-btn" onClick={handleSave}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
