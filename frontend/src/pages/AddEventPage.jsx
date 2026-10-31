import React from 'react';

export default function AddEventPage({ form, setForm, isEditing, onSubmit, onCancel, error }) {
  return (
    <div>
      <h2>{isEditing ? 'Edit event' : 'Add event'}</h2>
      <div className="form-box">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Organizer Email</label>
            <input
              type="email"
              value={form.organizerEmail}
              onChange={(e) => setForm({ ...form, organizerEmail: e.target.value })}
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Save changes' : 'Add event'}
            </button>
            {isEditing && (
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
