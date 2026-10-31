import React, { useState } from 'react';

export default function EventsPage({ events, loading, onEdit, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = events.filter((ev) =>
    ev.name?.toLowerCase().includes(search.toLowerCase()) ||
    ev.venue?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Events</h2>
      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search by event name or venue"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-primary" type="button">Search</button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="state-text">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="state-text">No events found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>DATE</th>
                <th>VENUE</th>
                <th>ORGANIZER</th>
                <th className="text-right">REGISTRATIONS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.name}</td>
                  <td>{ev.date}</td>
                  <td>{ev.venue}</td>
                  <td>{ev.organizerEmail}</td>
                  <td className="text-right">{ev.registrationCount}</td>
                  <td className="text-right">
                    <button className="action-link edit" onClick={() => onEdit(ev)}>
                      Edit
                    </button>
                    <button className="action-link delete" onClick={() => onDelete(ev.id, ev.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

