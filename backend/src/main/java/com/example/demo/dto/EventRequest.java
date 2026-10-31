package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EventRequest {

    @NotBlank(message = "Event name is required")
    private String name;

    @NotNull(message = "Event date is required")
    private LocalDate date;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotBlank(message = "Organizer email is required")
    @Email(message = "Invalid organizer email address format")
    private String organizerEmail;

    public EventRequest() {
    }

    public EventRequest(String name, LocalDate date, String venue, String organizerEmail) {
        this.name = name;
        this.date = date;
        this.venue = venue;
        this.organizerEmail = organizerEmail;
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
}

