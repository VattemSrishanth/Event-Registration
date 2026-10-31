import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Event Form State
  const [eventForm, setEventForm] = useState({ name: '', date: '', venue: '', organizerEmail: '' });
  const [editingId, setEditingId] = useState(null);

  // Participant Registration State
  const [regForm, setRegForm] = useState({ eventId: '', name: '', email: '' });

  // Load data on start
  useEffect(() => {
    fetchEvents();
    fetchParticipants();
  }, []);

  // 1. GET Events using Axios
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events`);
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch events from backend');
    }
  };

  // 2. GET Participants using Fetch API
  const fetchParticipants = async () => {
    try {
      const res = await fetch(`${API_BASE}/participants`);
      const data = await res.json();
      setParticipants(data);
    } catch (err) {
      setError('Failed to fetch participants');
    }
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 4000);
  };

  const showErr = (err) => {
    setError(err);
    setTimeout(() => setError(''), 5000);
  };

  // 3. POST / PUT Event using Axios
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const { name, date, venue, organizerEmail } = eventForm;

    // Validation
    if (!name.trim() || !date || !venue.trim() || !organizerEmail.trim()) {
      return showErr('All event fields are required!');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(organizerEmail.trim())) {
      return showErr('Invalid organizer email format!');
    }

    try {
      if (editingId) {
        // PUT: Update Event
        await axios.put(`${API_BASE}/events/${editingId}`, eventForm);
        showMsg('Event updated successfully!');
        setEditingId(null);
      } else {
        // POST: Add Event
        await axios.post(`${API_BASE}/events`, eventForm);
        showMsg('Event created successfully!');
      }
      setEventForm({ name: '', date: '', venue: '', organizerEmail: '' });
      fetchEvents();
    } catch (err) {
      showErr(err.response?.data?.message || 'Error saving event');
    }
  };

  // 4. DELETE Event using Axios
  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Delete event "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/events/${id}`);
      showMsg(`Event "${name}" deleted.`);
      fetchEvents();
      fetchParticipants();
    } catch (err) {
      showErr(err.response?.data?.message || 'Error deleting event');
    }
  };

  // 5. POST Register Participant using Axios
  const handleRegister = async (e) => {
    e.preventDefault();
    const { eventId, name, email } = regForm;

    // Validation
    if (!eventId) return showErr('Please select an event!');
    if (!name.trim() || !email.trim()) return showErr('Participant name and email are required!');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return showErr('Invalid participant email format!');

    try {
      await axios.post(`${API_BASE}/events/${eventId}/register`, {
        name: name.trim(),
        email: email.trim(),
      });
      showMsg(`Successfully registered ${name}!`);
      setRegForm({ eventId: '', name: '', email: '' });
      fetchEvents();
      fetchParticipants();
    } catch (err) {
      showErr(err.response?.data?.message || 'Registration failed');
    }
  };

  // 6. DELETE Participant using Fetch API
  const handleCancelRegistration = async (id, name) => {
    if (!window.confirm(`Cancel registration for ${name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/participants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to cancel');
      showMsg(`Registration for ${name} cancelled.`);
      fetchEvents();
      fetchParticipants();
    } catch (err) {
      showErr(err.message || 'Error cancelling registration');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎓 College Event Registration System</h1>
        <p>Minimal & Clean Portal for Organizers and Students</p>
      </header>

      {/* Notifications */}
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="grid">
        {/* Form 1: Add / Edit Event (Organizer) */}
        <div className="card">
          <h2>{editingId ? '✏️ Edit Event' : '➕ Add College Event (Organizer)'}</h2>
          <form onSubmit={handleEventSubmit}>
            <div className="field">
              <label>Event Name:</label>
              <input
                type="text"
                placeholder="e.g. Annual Tech Symposium"
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Event Date:</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Venue:</label>
                <input
                  type="text"
                  placeholder="e.g. Auditorium Block A"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Organizer Email:</label>
              <input
                type="email"
                placeholder="e.g. organizer@college.edu"
                value={eventForm.organizerEmail}
                onChange={(e) => setEventForm({ ...eventForm, organizerEmail: e.target.value })}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Event' : 'Add Event'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setEventForm({ name: '', date: '', venue: '', organizerEmail: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Form 2: Register Participant (Student) */}
        <div className="card">
          <h2>✍️ Register for an Event (Student)</h2>
          <form onSubmit={handleRegister}>
            <div className="field">
              <label>Select Event:</label>
              <select
                value={regForm.eventId}
                onChange={(e) => setRegForm({ ...regForm, eventId: e.target.value })}
              >
                <option value="">-- Choose an Event --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.date} @ {ev.venue})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Student Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Student Email Address:</label>
              <input
                type="email"
                placeholder="e.g. rahul.verma@college.edu"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">
                Register Participant
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table 1: Available Events List */}
      <div className="card">
        <h2>📅 Available College Events ({events.length})</h2>
        {events.length === 0 ? (
          <p className="empty">No events available right now.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Organizer Email</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>#{ev.id}</td>
                    <td><strong>{ev.name}</strong></td>
                    <td>{ev.date}</td>
                    <td>{ev.venue}</td>
                    <td>{ev.organizerEmail}</td>
                    <td>
                      <span className="badge">{ev.registrationCount} students</span>
                    </td>
                    <td>
                      <button
                        className="btn-action edit"
                        onClick={() => {
                          setEditingId(ev.id);
                          setEventForm({
                            name: ev.name,
                            date: ev.date,
                            venue: ev.venue,
                            organizerEmail: ev.organizerEmail,
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDeleteEvent(ev.id, ev.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Table 2: Participants Registered (showing clearly which event each student is registered for) */}
      <div className="card">
        <h2>👥 Registered Participants & Their Events ({participants.length})</h2>
        {participants.length === 0 ? (
          <p className="empty">No student registrations recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Registered Event</th>
                  <th>Registration Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.email}</td>
                    <td>
                      <span className="badge-event">{p.eventName || `Event #${p.eventId}`}</span>
                    </td>
                    <td>{p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A'}</td>
                    <td>
                      <button
                        className="btn-action delete"
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
      </div>
    </div>
  );
}
