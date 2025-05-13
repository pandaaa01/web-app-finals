// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import LandingPage from './components/LandingPage';
import GetMeasurements from './components/GetMeasurements';
import Profiles from './components/Profiles'; // Import the Profile component

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currImageIndex, setCurrImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (activeIndex !== null) {
      setCurrImageIndex(0);
    }
  }, [activeIndex]);

  useEffect(() => {
    if ([8].includes(currImageIndex)) {
      setHoveredIndex(0);
      console.log(currImageIndex);
    } else {
      setHoveredIndex(null);
    }
  }, [currImageIndex]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <Menu
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      </aside>
      <main className="main-content">
        {activeIndex === null && (
          <LandingPage
            currImageIndex={currImageIndex}
            setCurrImageIndex={setCurrImageIndex}
          />
        )}
        {activeIndex === 0 && <GetMeasurements />}
        {activeIndex === 1 && <Profiles />} {/* Render Profile when index is 1 */}
      </main>
    </div>
  );
}

export default App;
