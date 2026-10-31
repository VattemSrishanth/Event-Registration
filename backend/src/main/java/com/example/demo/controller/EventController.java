package com.example.demo.controller;

import com.example.demo.dto.EventRequest;
import com.example.demo.dto.EventResponse;
import com.example.demo.dto.ParticipantRequest;
import com.example.demo.dto.ParticipantResponse;
import com.example.demo.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // GET /api/events - List all events with registration count
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // GET /api/events/{id} - Get event details including registered participants
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // POST /api/events - Add new event
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/events/{id} - Update an existing event
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        EventResponse updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/events/{id} - Delete an event
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully", "eventId", String.valueOf(id)));
    }

    // POST /api/events/{eventId}/register - Register a participant for a selected event
    @PostMapping("/{eventId}/register")
    public ResponseEntity<ParticipantResponse> registerParticipant(
            @PathVariable Long eventId,
            @Valid @RequestBody ParticipantRequest request) {
        ParticipantResponse response = eventService.registerParticipant(eventId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/events/{eventId}/participants - Display participants registered for an event
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<ParticipantResponse>> getEventParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getParticipantsByEvent(eventId));
    }
}

