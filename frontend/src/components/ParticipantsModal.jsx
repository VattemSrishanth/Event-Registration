import React, { useState, useEffect } from 'react';
import { getEventParticipants, deleteParticipant } from '../services/api';

export default function ParticipantsModal({ event, onClose, onOpenRegister, onRefreshEvents }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (event?.id) {
      loadParticipants();
    }
  }, [event?.id]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEventParticipants(event.id);
      setParticipants(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (participantId, participantName) => {
    if (!window.confirm(`Are you sure you want to cancel the registration for "${participantName}"?`)) {
      return;
    }

    try {
      await deleteParticipant(participantId);
      setActionMsg(`Registration for ${participantName} was successfully cancelled.`);
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
      if (onRefreshEvents) onRefreshEvents();
    } catch (err) {
      setError(err.message || 'Failed to cancel registration');
    }
  };

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Registered Participants</h3>
            <p className="modal-subtitle">
              Event: <strong>{event.name}</strong> ({participants.length} registered)
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {actionMsg && <div className="alert alert-success">{actionMsg}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="modal-toolbar">
          <div className="badge badge-primary">
            Total Registrations: {participants.length}
          </div>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              onClose();
              onOpenRegister(event);
            }}
          >
            ➕ Register New Participant
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading registered participants...</div>
        ) : participants.length === 0 ? (
          <div className="empty-state">
            <p>No participants have registered for this event yet.</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                onClose();
                onOpenRegister(event);
              }}
            >
              Be the first to register!
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participant Name</th>
                  <th>Email Address</th>
                  <th>Registered Date & Time</th>
                  <th>Registered Event</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.email}</td>
                    <td>
                      {p.registeredAt
                        ? new Date(p.registeredAt).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td>
                      <span className="badge badge-info">{event.name}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs btn-danger"
                        title="Cancel Registration"
                        onClick={() => handleCancelRegistration(p.id, p.name)}
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

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

