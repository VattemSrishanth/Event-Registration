import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event APIs using Axios
export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await apiClient.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await apiClient.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await apiClient.delete(`/events/${id}`);
  return response.data;
};

export const registerParticipant = async (eventId, participantData) => {
  const response = await apiClient.post(`/events/${eventId}/register`, participantData);
  return response.data;
};

export const getEventParticipants = async (eventId) => {
  const response = await apiClient.get(`/events/${eventId}/participants`);
  return response.data;
};

// Also supporting Fetch API endpoint calls as requested
export const getAllParticipants = async () => {
  const response = await fetch(`${BASE_URL}/participants`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch registered participants');
  }
  return response.json();
};

export const deleteParticipant = async (id) => {
  const response = await fetch(`${BASE_URL}/participants/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete registration');
  }
  return response.json();
};

