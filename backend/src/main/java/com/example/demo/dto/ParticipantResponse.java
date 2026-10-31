package com.example.demo.dto;

import java.time.LocalDateTime;

public class ParticipantResponse {

    private Long id;
    private String name;
    private String email;
    private LocalDateTime registeredAt;
    private Long eventId;
    private String eventName;

    public ParticipantResponse() {
    }

    public ParticipantResponse(Long id, String name, String email, LocalDateTime registeredAt, Long eventId, String eventName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.registeredAt = registeredAt;
        this.eventId = eventId;
        this.eventName = eventName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
}

