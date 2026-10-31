import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const [eventForm, setEventForm] = useState({ name: '', date: '', venue: '', organizerEmail: '' });
  const [editingId, setEditingId] = useState(null);

  const [regForm, setRegForm] = useState({ eventId: '', name: '', email: '' });

  useEffect(() => {
    loadEvents();
    loadParticipants();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/events`);
      setEvents(res.data);
    } catch (e) {
      setErr('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      const res = await fetch(`${API_BASE}/participants`);
      const data = await res.json();
      setParticipants(data);
    } catch (e) {
      setErr('Failed to load participants');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const { name, date, venue, organizerEmail } = eventForm;

    if (!name.trim() || !date || !venue.trim() || !organizerEmail.trim()) {
      setErr('All fields are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(organizerEmail.trim())) {
      setErr('Invalid organizer email address');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/events/${editingId}`, eventForm);
        setMsg('Event updated successfully');
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/events`, eventForm);
        setMsg('Event added successfully');
      }
      setEventForm({ name: '', date: '', venue: '', organizerEmail: '' });
      loadEvents();
      setTab('events');
    } catch (e) {
      setErr(e.response?.data?.message || 'Error saving event');
    }
  };

  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Delete event "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/events/${id}`);
      setMsg(`Event deleted`);
      loadEvents();
      loadParticipants();
    } catch (e) {
      setErr('Error deleting event');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const { eventId, name, email } = regForm;

    if (!eventId) {
      setErr('Please select an event');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setErr('Name and email are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErr('Invalid student email format');
      return;
    }

    try {
      await axios.post(`${API_BASE}/events/${eventId}/register`, {
        name: name.trim(),
        email: email.trim(),
      });
      setMsg('Participant registered successfully');
      setRegForm({ eventId: '', name: '', email: '' });
      loadEvents();
      loadParticipants();
      setTab('registrations');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    }
  };

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      const res = await fetch(`${API_BASE}/participants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMsg('Registration cancelled');
      loadEvents();
      loadParticipants();
    } catch (e) {
      setErr('Error cancelling registration');
    }
  };

  const filteredEvents = events.filter((ev) =>
    ev.name?.toLowerCase().includes(search.toLowerCase()) ||
    ev.venue?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <nav className="topbar">
        <span className="topbar-brand">College Events</span>
        <div className="topbar-nav">
          <button
            className={`nav-link ${tab === 'events' ? 'active' : ''}`}
            onClick={() => { setTab('events'); setErr(''); }}
          >
            Events
          </button>
          <button
            className={`nav-link ${tab === 'add' ? 'active' : ''}`}
            onClick={() => {
              setTab('add');
              setEditingId(null);
              setEventForm({ name: '', date: '', venue: '', organizerEmail: '' });
              setErr('');
            }}
          >
            {editingId ? 'Edit event' : 'Add event'}
          </button>
          <button
            className={`nav-link ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setErr(''); }}
          >
            Register student
          </button>
          <button
            className={`nav-link ${tab === 'registrations' ? 'active' : ''}`}
            onClick={() => { setTab('registrations'); setErr(''); }}
          >
            Registrations
          </button>
        </div>
      </nav>

      <main className="main-container">
        {msg && <div className="notice-bar success">{msg}</div>}

        {tab === 'events' && (
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
              <button className="btn-primary" onClick={() => {}}>Search</button>
            </div>

            <div className="table-card">
              {loading ? (
                <div className="state-text">Loading events...</div>
              ) : filteredEvents.length === 0 ? (
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
                    {filteredEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td>{ev.id}</td>
                        <td>{ev.name}</td>
                        <td>{ev.date}</td>
                        <td>{ev.venue}</td>
                        <td>{ev.organizerEmail}</td>
                        <td className="text-right">{ev.registrationCount}</td>
                        <td className="text-right">
                          <button
                            className="action-link edit"
                            onClick={() => {
                              setEditingId(ev.id);
                              setEventForm({
                                name: ev.name,
                                date: ev.date,
                                venue: ev.venue,
                                organizerEmail: ev.organizerEmail,
                              });
                              setTab('add');
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="action-link delete"
                            onClick={() => handleDeleteEvent(ev.id, ev.name)}
                          >
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
        )}

        {tab === 'add' && (
          <div>
            <h2>{editingId ? 'Edit event' : 'Add event'}</h2>
            <div className="form-box">
              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label>Event Name</label>
                  <input
                    type="text"
                    value={eventForm.name}
                    onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Organizer Email</label>
                  <input
                    type="email"
                    value={eventForm.organizerEmail}
                    onChange={(e) => setEventForm({ ...eventForm, organizerEmail: e.target.value })}
                  />
                </div>

                <div className="btn-row">
                  <button type="submit" className="btn-primary">
                    {editingId ? 'Save changes' : 'Add event'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setEditingId(null);
                        setTab('events');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                {err && <div className="form-error">{err}</div>}
              </form>
            </div>
          </div>
        )}

        {tab === 'register' && (
          <div>
            <h2>Register student</h2>
            <div className="form-box">
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label>Select Event</label>
                  <select
                    value={regForm.eventId}
                    onChange={(e) => setRegForm({ ...regForm, eventId: e.target.value })}
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
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Student Email Address</label>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  />
                </div>

                <div className="btn-row">
                  <button type="submit" className="btn-primary">
                    Register
                  </button>
                </div>
                {err && <div className="form-error">{err}</div>}
              </form>
            </div>
          </div>
        )}

        {tab === 'registrations' && (
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
                            onClick={() => handleCancelRegistration(p.id)}
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
        )}
      </main>
    </div>
  );
}
