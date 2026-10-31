import React from 'react';

export default function Navbar({ activeTab, setActiveTab, totalEvents, totalRegistrations }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <span className="brand-icon">🎓</span>
          <div>
            <h1>College Event Registration</h1>
            <p className="subtitle">Campus Events & Student Participation Portal</p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-label">Total Events:</span>
            <span className="stat-value">{totalEvents}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Total Registrations:</span>
            <span className="stat-value">{totalRegistrations}</span>
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Available Events
        </button>
        <button
          className={`nav-tab ${activeTab === 'add-event' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-event')}
        >
          ➕ Add Event (Organizer)
        </button>
        <button
          className={`nav-tab ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          👥 All Registered Participants
        </button>
      </nav>
    </header>
  );
}

