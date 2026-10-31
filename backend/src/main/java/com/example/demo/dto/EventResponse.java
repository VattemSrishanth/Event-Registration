package com.example.demo.dto;

import java.time.LocalDate;
import java.util.List;

public class EventResponse {

    private Long id;
    private String name;
    private LocalDate date;
    private String venue;
    private String organizerEmail;
    private int registrationCount;
    private List<ParticipantResponse> participants;

    public EventResponse() {
    }

    public EventResponse(Long id, String name, LocalDate date, String venue, String organizerEmail, int registrationCount, List<ParticipantResponse> participants) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.venue = venue;
        this.organizerEmail = organizerEmail;
        this.registrationCount = registrationCount;
        this.participants = participants;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public int getRegistrationCount() {
        return registrationCount;
    }

    public void setRegistrationCount(int registrationCount) {
        this.registrationCount = registrationCount;
    }

    public List<ParticipantResponse> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ParticipantResponse> participants) {
        this.participants = participants;
    }
}

