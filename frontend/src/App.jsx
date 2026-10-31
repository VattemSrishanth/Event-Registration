import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import EventsPage from './pages/EventsPage';
import AddEventPage from './pages/AddEventPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationsPage from './pages/RegistrationsPage';
import './index.css';

const API = 'http://localhost:8080/api';

export default function App() {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [eventForm, setEventForm] = useState({ name: '', date: '', venue: '', organizerEmail: '' });
  const [editingId, setEditingId] = useState(null);
  const [regForm, setRegForm] = useState({ eventId: '', name: '', email: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evRes, partRes] = await Promise.all([
        axios.get(`${API}/events`),
        fetch(`${API}/participants`).then((r) => r.json()),
      ]);
      setEvents(evRes.data);
      setParticipants(partRes);
    } catch {
      setErr('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const { name, date, venue, organizerEmail } = eventForm;
    if (!name.trim() || !date || !venue.trim() || !organizerEmail.trim()) return setErr('All fields are required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail.trim())) return setErr('Invalid organizer email');

    try {
      if (editingId) {
        await axios.put(`${API}/events/${editingId}`, eventForm);
        setMsg('Event updated');
        setEditingId(null);
      } else {
        await axios.post(`${API}/events`, eventForm);
        setMsg('Event added');
      }
      setEventForm({ name: '', date: '', venue: '', organizerEmail: '' });
      loadData();
      setTab('events');
    } catch (e) { setErr(e.response?.data?.message || 'Error saving event'); }
  };

  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Delete event "${name}"?`)) return;
    try {
      await axios.delete(`${API}/events/${id}`);
      setMsg('Event deleted');
      loadData();
    } catch { setErr('Error deleting event'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr('');
    const { eventId, name, email } = regForm;
    if (!eventId) return setErr('Please select an event');
    if (!name.trim() || !email.trim()) return setErr('Name and email required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr('Invalid email format');

    try {
      await axios.post(`${API}/events/${eventId}/register`, { name: name.trim(), email: email.trim() });
      setMsg('Registered successfully');
      setRegForm({ eventId: '', name: '', email: '' });
      loadData();
      setTab('registrations');
    } catch (e) { setErr(e.response?.data?.message || 'Registration failed'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await fetch(`${API}/participants/${id}`, { method: 'DELETE' });
      setMsg('Registration cancelled');
      loadData();
    } catch { setErr('Error cancelling registration'); }
  };

  return (
    <div>
      <Navbar tab={tab} setTab={(t) => { setTab(t); setErr(''); }} />
      <main className="main-container">
        {msg && <div className="notice-bar success">{msg}</div>}
        {tab === 'events' && (
          <EventsPage
            events={events}
            loading={loading}
            onEdit={(ev) => {
              setEditingId(ev.id);
              setEventForm({ name: ev.name, date: ev.date, venue: ev.venue, organizerEmail: ev.organizerEmail });
              setTab('add');
            }}
            onDelete={handleDeleteEvent}
          />
        )}
        {tab === 'add' && (
          <AddEventPage
            form={eventForm}
            setForm={setEventForm}
            isEditing={Boolean(editingId)}
            onSubmit={handleEventSubmit}
            onCancel={() => { setEditingId(null); setTab('events'); }}
            error={err}
          />
        )}
        {tab === 'register' && (
          <RegisterPage
            events={events}
            form={regForm}
            setForm={setRegForm}
            onSubmit={handleRegister}
            error={err}
          />
        )}
        {tab === 'registrations' && (
          <RegistrationsPage participants={participants} onCancel={handleCancel} />
        )}
      </main>
    </div>
  );
}
