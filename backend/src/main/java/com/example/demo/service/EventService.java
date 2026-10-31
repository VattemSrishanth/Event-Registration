package com.example.demo.service;

import com.example.demo.dto.EventRequest;
import com.example.demo.dto.EventResponse;
import com.example.demo.dto.ParticipantRequest;
import com.example.demo.dto.ParticipantResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Event;
import com.example.demo.model.Participant;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final ParticipantRepository participantRepository;

    public EventService(EventRepository eventRepository, ParticipantRepository participantRepository) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return mapToDetailResponse(event);
    }

    public EventResponse createEvent(EventRequest request) {
        Event event = new Event(
                request.getName().trim(),
                request.getDate(),
                request.getVenue().trim(),
                request.getOrganizerEmail().trim()
        );
        Event saved = eventRepository.save(event);
        return mapToSummaryResponse(saved);
    }

    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        event.setName(request.getName().trim());
        event.setDate(request.getDate());
        event.setVenue(request.getVenue().trim());
        event.setOrganizerEmail(request.getOrganizerEmail().trim());

        Event updated = eventRepository.save(event);
        return mapToSummaryResponse(updated);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    public ParticipantResponse registerParticipant(Long eventId, ParticipantRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        String email = request.getEmail().trim().toLowerCase();
        if (participantRepository.existsByEmailAndEventId(email, eventId)) {
            throw new IllegalStateException("Participant with email '" + email + "' is already registered for this event.");
        }

        Participant participant = new Participant(request.getName().trim(), email, event);
        Participant saved = participantRepository.save(participant);

        return mapToParticipantResponse(saved);
    }

    public List<ParticipantResponse> getParticipantsByEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }
        return participantRepository.findByEventId(eventId).stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList());
    }

    public List<ParticipantResponse> getAllParticipants() {
        return participantRepository.findAll().stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList());
    }

    public void deleteParticipant(Long participantId) {
        if (!participantRepository.existsById(participantId)) {
            throw new ResourceNotFoundException("Participant registration not found with ID: " + participantId);
        }
        participantRepository.deleteById(participantId);
    }

    private EventResponse mapToSummaryResponse(Event event) {
        int count = event.getParticipants() != null ? event.getParticipants().size() : 0;
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDate(),
                event.getVenue(),
                event.getOrganizerEmail(),
                count,
                null
        );
    }

    private EventResponse mapToDetailResponse(Event event) {
        List<ParticipantResponse> participantResponses = event.getParticipants() != null
                ? event.getParticipants().stream().map(this::mapToParticipantResponse).collect(Collectors.toList())
                : List.of();

        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDate(),
                event.getVenue(),
                event.getOrganizerEmail(),
                participantResponses.size(),
                participantResponses
        );
    }

    private ParticipantResponse mapToParticipantResponse(Participant p) {
        return new ParticipantResponse(
                p.getId(),
                p.getName(),
                p.getEmail(),
                p.getRegisteredAt(),
                p.getEvent() != null ? p.getEvent().getId() : null,
                p.getEvent() != null ? p.getEvent().getName() : null
        );
    }
}

