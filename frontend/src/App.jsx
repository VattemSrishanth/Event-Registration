import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import RegisterModal from './components/RegisterModal';
import ParticipantsModal from './components/ParticipantsModal';
import AllRegistrations from './components/AllRegistrations';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerParticipant,
} from './services/api';
import './App.css';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'add-event' | 'registrations'

  // Modals & form state
  const [editingEvent, setEditingEvent] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [viewingParticipantsEvent, setViewingParticipantsEvent] = useState(null);

  // Global banners
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setErrorBanner('');
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setErrorBanner(
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to Spring Boot backend. Please ensure the backend server is running on port 8080.'
      );
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(''), 4500);
  };

  const showError = (msg) => {
    setErrorBanner(msg);
    setTimeout(() => setErrorBanner(''), 6000);
  };

  // POST: Create Event
  const handleCreateEvent = async (formData) => {
    try {
      const created = await createEvent(formData);
      showSuccess(`Event "${created.name}" created successfully!`);
      await fetchEvents();
      setActiveTab('events');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create event';
      showError(msg);
      throw err;
    }
  };

  // PUT: Update Event
  const handleUpdateEvent = async (formData) => {
    if (!editingEvent) return;
    try {
      const updated = await updateEvent(editingEvent.id, formData);
      showSuccess(`Event "${updated.name}" updated successfully!`);
      setEditingEvent(null);
      await fetchEvents();
      setActiveTab('events');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update event';
      showError(msg);
      throw err;
    }
  };

  // DELETE: Delete Event
  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the event "${name}"? All associated registrations will also be removed.`)) {
      return;
    }
    try {
      await deleteEvent(id);
      showSuccess(`Event "${name}" was deleted successfully.`);
      await fetchEvents();
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to delete event');
    }
  };

  // POST: Register participant
  const handleRegisterParticipant = async (eventId, participantData) => {
    try {
      const resp = await registerParticipant(eventId, participantData);
      showSuccess(`Successfully registered ${resp.name} for ${resp.eventName}!`);
      await fetchEvents();
      return resp;
    } catch (err) {
      // Re-throw so modal can display field or duplicate email error
      throw err;
    }
  };

  // Calculate quick stats
  const totalRegistrations = events.reduce(
    (sum, ev) => sum + (ev.registrationCount || 0),
    0
  );

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'add-event') setEditingEvent(null);
        }}
        totalEvents={events.length}
        totalRegistrations={totalRegistrations}
      />

      <main className="main-content">
        {successBanner && (
          <div className="banner banner-success">
            <span>✅ {successBanner}</span>
            <button className="banner-close" onClick={() => setSuccessBanner('')}>
              ×
            </button>
          </div>
        )}

        {errorBanner && (
          <div className="banner banner-error">
            <span>⚠️ {errorBanner}</span>
            <button className="banner-close" onClick={() => setErrorBanner('')}>
              ×
            </button>
          </div>
        )}

        {activeTab === 'events' && (
          <EventList
            events={events}
            loading={loading}
            onRegister={(ev) => setRegisteringEvent(ev)}
            onViewParticipants={(ev) => setViewingParticipantsEvent(ev)}
            onEdit={(ev) => {
              setEditingEvent(ev);
              setActiveTab('add-event');
            }}
            onDelete={handleDeleteEvent}
            onAddNew={() => {
              setEditingEvent(null);
              setActiveTab('add-event');
            }}
          />
        )}

        {activeTab === 'add-event' && (
          <EventForm
            initialData={editingEvent}
            isEditing={Boolean(editingEvent)}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={() => {
              setEditingEvent(null);
              setActiveTab('events');
            }}
          />
        )}

        {activeTab === 'registrations' && (
          <AllRegistrations onRefreshEvents={fetchEvents} />
        )}
      </main>

      {/* Participant Registration Modal */}
      {registeringEvent && (
        <RegisterModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
          onRegisterSuccess={handleRegisterParticipant}
        />
      )}

      {/* View Event Participants Modal */}
      {viewingParticipantsEvent && (
        <ParticipantsModal
          event={viewingParticipantsEvent}
          onClose={() => setViewingParticipantsEvent(null)}
          onOpenRegister={(ev) => setRegisteringEvent(ev)}
          onRefreshEvents={fetchEvents}
        />
      )}

      <footer className="app-footer">
        <p>
          College Event Registration System • React (.jsx) + Spring Boot REST API + Local MySQL Database
        </p>
      </footer>
    </div>
  );
}
