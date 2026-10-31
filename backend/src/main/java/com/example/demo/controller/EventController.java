package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.model.Participant;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.ParticipantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Transactional
public class EventController {

    private final EventRepository eventRepo;
    private final ParticipantRepository participantRepo;

    public EventController(EventRepository eventRepo, ParticipantRepository participantRepo) {
        this.eventRepo = eventRepo;
        this.participantRepo = participantRepo;
    }

    // 1. GET all events
    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    // 2. POST create new event
    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        if (event.getName() == null || event.getName().isBlank() ||
            event.getDate() == null || event.getDate().isBlank() ||
            event.getVenue() == null || event.getVenue().isBlank() ||
            event.getOrganizerEmail() == null || !event.getOrganizerEmail().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required and valid email is needed!"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(eventRepo.save(event));
    }

    // 3. PUT update existing event
    @PutMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event updated) {
        return eventRepo.findById(id).map(event -> {
            event.setName(updated.getName());
            event.setDate(updated.getDate());
            event.setVenue(updated.getVenue());
            event.setOrganizerEmail(updated.getOrganizerEmail());
            return ResponseEntity.ok(eventRepo.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. DELETE event
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (!eventRepo.existsById(id)) return ResponseEntity.notFound().build();
        participantRepo.deleteByEventId(id);
        eventRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }

    // 5. POST register participant for an event
    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<?> registerParticipant(@PathVariable Long eventId, @RequestBody Participant p) {
        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) return ResponseEntity.badRequest().body(Map.of("message", "Event not found"));

        if (p.getName() == null || p.getName().isBlank() || p.getEmail() == null || !p.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid student name and email required"));
        }

        if (participantRepo.existsByEmailAndEventId(p.getEmail(), eventId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Student is already registered for this event!"));
        }

        p.setEventId(eventId);
        p.setEventName(event.getName());
        Participant saved = participantRepo.save(p);

        event.setRegistrationCount(event.getRegistrationCount() + 1);
        eventRepo.save(event);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 6. GET all registered participants
    @GetMapping("/participants")
    public List<Participant> getAllParticipants() {
        return participantRepo.findAll();
    }

    // 7. DELETE participant registration
    @DeleteMapping("/participants/{id}")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        return participantRepo.findById(id).map(p -> {
            eventRepo.findById(p.getEventId()).ifPresent(ev -> {
                if (ev.getRegistrationCount() > 0) ev.setRegistrationCount(ev.getRegistrationCount() - 1);
                eventRepo.save(ev);
            });
            participantRepo.delete(p);
            return ResponseEntity.ok(Map.of("message", "Registration cancelled"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
