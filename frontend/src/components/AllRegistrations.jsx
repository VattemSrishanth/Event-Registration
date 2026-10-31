import React, { useState, useEffect } from 'react';
import { getAllParticipants, deleteParticipant } from '../services/api';

export default function AllRegistrations({ onRefreshEvents }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');
      // Calling fetch API endpoint as specified
      const data = await getAllParticipants();
      setParticipants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch registered participants');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id, name, eventName) => {
    if (!window.confirm(`Cancel registration of "${name}" for event "${eventName}"?`)) {
      return;
    }

    try {
      await deleteParticipant(id);
      setSuccessMsg(`Cancelled registration for "${name}".`);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      if (onRefreshEvents) onRefreshEvents();
    } catch (err) {
      setError(err.message || 'Failed to cancel registration');
    }
  };

  // Distinct event names for filtering
  const eventNames = Array.from(
    new Set(participants.map((p) => p.eventName).filter(Boolean))
  );

  const filtered = participants.filter((p) => {
    const matchesEvent =
      selectedEventFilter === 'ALL' || p.eventName === selectedEventFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.eventName?.toLowerCase().includes(term);
    return matchesEvent && matchesSearch;
  });

  return (
    <div className="card registrations-card">
      <div className="card-header list-header">
        <div>
          <h2>All Registered Participants</h2>
          <p className="card-subtitle">
            Complete registry of all student registrations, explicitly linking each participant to their registered event.
          </p>
        </div>
        <button className="btn btn-outline" onClick={loadAll}>
          🔄 Refresh
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-row">
        <div className="filter-search">
          <input
            type="text"
            placeholder="🔍 Search participant name, email, or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select">
          <label>Filter by Event:</label>
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
          >
            <option value="ALL">All Events ({participants.length})</option>
            {eventNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading registration records...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {search || selectedEventFilter !== 'ALL'
              ? 'No registrations found matching the applied filter.'
              : 'No participants have registered for any event yet.'}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Participant Name</th>
                <th>Student Email</th>
                <th>Registered Event Name</th>
                <th>Event ID</th>
                <th>Registration Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.email}</td>
                  <td>
                    <span className="badge badge-event">
                      🎯 {p.eventName || 'Unknown Event'}
                    </span>
                  </td>
                  <td>
                    <code>#{p.eventId}</code>
                  </td>
                  <td>
                    {p.registeredAt
                      ? new Date(p.registeredAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-danger"
                      onClick={() => handleCancel(p.id, p.name, p.eventName)}
                      title="Cancel Registration"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

