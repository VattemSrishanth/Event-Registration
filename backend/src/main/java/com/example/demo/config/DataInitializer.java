package com.example.demo.config;

import com.example.demo.model.Event;
import com.example.demo.model.Participant;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.ParticipantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(EventRepository eventRepository, ParticipantRepository participantRepository) {
        return args -> {
            if (eventRepository.count() == 0) {
                // Event 1
                Event e1 = new Event(
                        "Annual Tech Symposium 2026",
                        LocalDate.of(2026, 11, 15),
                        "Main Auditorium, Block A",
                        "techfest@college.edu"
                );
                eventRepository.save(e1);

                Participant p1 = new Participant("Aarav Sharma", "aarav.sharma@example.com", e1);
                Participant p2 = new Participant("Sneha Patel", "sneha.patel@example.com", e1);
                participantRepository.save(p1);
                participantRepository.save(p2);

                // Event 2
                Event e2 = new Event(
                        "National Level AI & Web Hackathon",
                        LocalDate.of(2026, 11, 20),
                        "Computer Science Lab 3",
                        "hackathon@college.edu"
                );
                eventRepository.save(e2);

                Participant p3 = new Participant("Rohan Gupta", "rohan.gupta@example.com", e2);
                participantRepository.save(p3);

                // Event 3
                Event e3 = new Event(
                        "College Cultural Fest - Horizon",
                        LocalDate.of(2026, 12, 5),
                        "Open Air Amphitheatre",
                        "cultural@college.edu"
                );
                eventRepository.save(e3);

                System.out.println("Initialized sample events and registrations successfully.");
            }
        };
    }
}

