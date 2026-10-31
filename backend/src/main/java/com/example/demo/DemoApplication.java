package com.example.demo;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner init(EventRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Event("Annual Tech Fest 2026", "2026-11-15", "Auditorium A", "tech@college.edu"));
                repo.save(new Event("AI & Web Hackathon", "2026-11-20", "CS Lab 3", "hack@college.edu"));
                repo.save(new Event("College Cultural Night", "2026-12-05", "Open Amphitheatre", "cult@college.edu"));
            }
        };
    }
}
