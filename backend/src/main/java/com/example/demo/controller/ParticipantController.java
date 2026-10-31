package com.example.demo.controller;

import com.example.demo.dto.ParticipantResponse;
import com.example.demo.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "*")
public class ParticipantController {

    private final EventService eventService;

    public ParticipantController(EventService eventService) {
        this.eventService = eventService;
    }

    // GET /api/participants - List all participants with clear event details
    @GetMapping
    public ResponseEntity<List<ParticipantResponse>> getAllParticipants() {
        return ResponseEntity.ok(eventService.getAllParticipants());
    }

    // DELETE /api/participants/{id} - Cancel a registration
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteParticipant(@PathVariable Long id) {
        eventService.deleteParticipant(id);
        return ResponseEntity.ok(Map.of("message", "Registration cancelled successfully", "participantId", String.valueOf(id)));
    }
}

