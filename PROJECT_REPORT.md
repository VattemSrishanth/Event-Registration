College Event Registration System

This application allows college event organizers to create and manage campus events and lets students register to attend them. The project is built using React for the frontend, Spring Boot for the REST API backend, and MySQL for local offline data storage.

Architecture:
React (Frontend) --Axios/Fetch--> Spring Boot REST API --Spring Data JPA--> MySQL Database

Features Implemented:
1. Add event with name, date, venue, and organizer contact email.
2. Display the list of available events with live registration count.
3. Edit existing event details.
4. Delete an event and remove its registrations.
5. Register a student for a selected event using name and email.
6. Display registered participants and make it clear which event each participant registered for.
7. Cancel a participant registration.
Validation rules check that all fields are filled, emails contain valid format with @ and a domain, and duplicate registrations of the same email for the same event are rejected.

Frontend, App.jsx:
App.jsx acts as the main component that keeps the state for events and participants. It renders the top navigation bar to switch between pages and passes down event handlers for adding, editing, deleting, and registering.

Tab / Page | Page Component | Backend Endpoint Called
Events | EventsPage.jsx | GET /api/events, DELETE /api/events/{id}
Add event | AddEventPage.jsx | POST /api/events, PUT /api/events/{id}
Register student | RegisterPage.jsx | POST /api/events/{eventId}/register
Registrations | RegistrationsPage.jsx | GET /api/participants, DELETE /api/participants/{id}

Backend:
Method | Endpoint | Description
GET | /api/events | Returns all events with registration count
POST | /api/events | Creates a new event
PUT | /api/events/{id} | Updates an existing event
DELETE | /api/events/{id} | Deletes an event
POST | /api/events/{id}/register | Registers a student for an event
GET | /api/participants | Returns all registrations with event names
DELETE | /api/participants/{id} | Cancels a registration

The API returns 200 OK for successful reads, updates, and deletions, 201 Created for new records, 400 Bad Request for validation errors or duplicate registrations, and 404 Not Found when an ID does not exist.

Database:
The project uses a local MySQL database named college_event_db. Spring Boot connects to it using the MySQL Connector/J driver and Hibernate ddl-auto update via the datasource properties in application.properties.

Table: events
Column | Type | Rules
id | BIGINT | Primary key, auto increment
name | VARCHAR(255) | Not null
date | VARCHAR(255) | Not null
venue | VARCHAR(255) | Not null
organizer_email | VARCHAR(255) | Not null
registration_count | INT | Default 0

Table: participants
Column | Type | Rules
id | BIGINT | Primary key, auto increment
name | VARCHAR(255) | Not null
email | VARCHAR(255) | Not null
event_id | BIGINT | Not null
event_name | VARCHAR(255) | Not null
registered_at | DATETIME | Not null

The project runs locally with the backend on port 8080 and the frontend on port 5173.

How to Run:

Backend:
```bash
cd backend
./mvnw spring-boot:run
```

Frontend:
```bash
cd frontend
npm run dev
```

Test:
```bash
cd backend
./mvnw test
```
