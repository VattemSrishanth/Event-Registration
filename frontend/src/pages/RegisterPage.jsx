import React from 'react';

export default function RegisterPage({ events, form, setForm, onSubmit, error }) {
  return (
    <div>
      <h2>Register student</h2>
      <div className="form-box">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Select Event</label>
            <select
              value={form.eventId}
              onChange={(e) => setForm({ ...form, eventId: e.target.value })}
            >
              <option value="">Select an event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.date})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Student Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Student Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary">
              Register
            </button>
          </div>
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

