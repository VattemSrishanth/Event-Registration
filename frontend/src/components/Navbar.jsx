import React from 'react';

export default function Navbar({ tab, setTab }) {
  return (
    <nav className="topbar">
      <span className="topbar-brand">College Events</span>
      <div className="topbar-nav">
        <button
          className={`nav-link ${tab === 'events' ? 'active' : ''}`}
          onClick={() => setTab('events')}
        >
          Events
        </button>
        <button
          className={`nav-link ${tab === 'add' ? 'active' : ''}`}
          onClick={() => setTab('add')}
        >
          Add event
        </button>
        <button
          className={`nav-link ${tab === 'register' ? 'active' : ''}`}
          onClick={() => setTab('register')}
        >
          Register student
        </button>
        <button
          className={`nav-link ${tab === 'registrations' ? 'active' : ''}`}
          onClick={() => setTab('registrations')}
        >
          Registrations
        </button>
      </div>
    </nav>
  );
}

