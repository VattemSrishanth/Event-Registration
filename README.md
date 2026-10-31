# College Event Registration System

A full-stack College Event Registration System built with **React (.jsx)** frontend, **Java Spring Boot REST API**, and a local offline **MySQL** database.

---

## 🚀 Architecture & Tech Stack

- **Frontend**: React 19 (JavaScript with strict `.jsx` syntax, Vite, Axios & Fetch API)
- **Backend**: Java 21, Spring Boot REST API (Spring Web, Spring Data JPA, Hibernate, Bean Validation)
- **Database**: Local MySQL (`college_event_db` on `localhost:3306`)

---

## ✨ Features

1. **Add Event (Organizer)**:
   - Event Name, Date, Venue, and Organizer Contact Email.
   - Comprehensive client-side & server-side validation (`@NotBlank`, `@Email`, `@NotNull`).
2. **Display Available Events**:
   - Live list of events with event details, dates, venues, organizer contact, and real-time registration counts.
3. **Participant Registration**:
   - Register participant with Name and Email for any selected event.
   - Prevents duplicate registration for the same event with friendly error messages.
4. **View Event Participants**:
   - Modal showing all participants registered for a specific event with timestamps.
5. **Registration Count**:
   - Shows the total number of registrations per each event and across the entire portal.
6. **Master Registry ("All Registered Participants")**:
   - Complete table making it clear which event each participant has registered for.
   - Filter by event or search by student name/email.
7. **Full CRUD Operations (GET, POST, PUT, DELETE)**:
   - `GET /api/events` - Fetch all events with registration counts
   - `GET /api/events/{id}` - Fetch single event details with participant list
   - `POST /api/events` - Create new event
   - `PUT /api/events/{id}` - Update event details
   - `DELETE /api/events/{id}` - Delete event (cascades registrations)
   - `POST /api/events/{eventId}/register` - Register participant
   - `GET /api/events/{eventId}/participants` - List participants for an event
   - `GET /api/participants` - List all participants with event details
   - `DELETE /api/participants/{id}` - Cancel a participant registration

---

## 🛠️ How to Run

### 1. Database Configuration
Ensure MySQL Server is running locally on port 3306.
Database configuration is in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_event_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=Srish@1804
```

### 2. Run Backend (Spring Boot)
```powershell
cd d:\Event-Registration\backend
.\mvnw.cmd spring-boot:run
```
Server runs on: `http://localhost:8080`

### 3. Run Frontend (React)
```powershell
cd d:\Event-Registration\frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Open browser: `http://127.0.0.1:5173`

