import React, { useState } from 'react';

export default function EventList({
  events,
  loading,
  onRegister,
  onViewParticipants,
  onEdit,
  onDelete,
  onAddNew,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter((ev) => {
    const term = searchTerm.toLowerCase();
    return (
      ev.name?.toLowerCase().includes(term) ||
      ev.venue?.toLowerCase().includes(term) ||
      ev.organizerEmail?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="card event-list-card">
      <div className="card-header list-header">
        <div>
          <h2>Available College Events</h2>
          <p className="card-subtitle">
            Browse upcoming college events, view registration counts, and register participants.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddNew}>
          ➕ Add New Event
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search events by name, venue, or organizer email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="btn-clear" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Loading college events from server...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>
            {searchTerm
              ? `No events found matching "${searchTerm}".`
              : 'No college events available right now.'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={onAddNew}>
              Create the first event
            </button>
          )}
        </div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="event-card">
              <div className="event-card-top">
                <span className="badge badge-date">📅 {ev.date}</span>
                <span className="badge badge-count">
                  👥 {ev.registrationCount} {ev.registrationCount === 1 ? 'Registered' : 'Registered'}
                </span>
              </div>

              <h3 className="event-title">{ev.name}</h3>

              <div className="event-info">
                <p className="info-item">
                  <span className="info-icon">📍</span>
                  <span className="info-text">{ev.venue}</span>
                </p>
                <p className="info-item">
                  <span className="info-icon">✉️</span>
                  <span className="info-text" title={ev.organizerEmail}>
                    {ev.organizerEmail}
                  </span>
                </p>
              </div>

              <div className="event-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onRegister(ev)}
                >
                  ✍️ Register
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onViewParticipants(ev)}
                >
                  👥 View ({ev.registrationCount})
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  title="Edit Event"
                  onClick={() => onEdit(ev)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-danger-outline"
                  title="Delete Event"
                  onClick={() => onDelete(ev.id, ev.name)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

