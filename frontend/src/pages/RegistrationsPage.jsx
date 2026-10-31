import React from 'react';

export default function RegistrationsPage({ participants, onCancel }) {
  return (
    <div>
      <h2>Registrations</h2>
      <div className="table-card">
        {participants.length === 0 ? (
          <div className="state-text">No student registrations recorded yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>STUDENT NAME</th>
                <th>STUDENT EMAIL</th>
                <th>REGISTERED EVENT</th>
                <th>REGISTRATION DATE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.eventName || `Event #${p.eventId}`}</td>
                  <td>{p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-right">
                    <button
                      className="action-link delete"
                      onClick={() => onCancel(p.id)}
                    >
                      Cancel
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
