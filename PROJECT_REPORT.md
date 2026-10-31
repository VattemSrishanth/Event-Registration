# COLLEGE EVENT REGISTRATION SYSTEM
### Comprehensive Project Documentation & Exam Lab Record Write-up
*(Designed for 2–3 Pages Academic Record / Project Viva / Lab Submission)*

---

## 1. PROJECT TITLE & AIM

- **Project Title**: College Event Registration System
- **Objective / Aim**: To develop a full-stack web application that allows college event organizers to publish, manage, and monitor campus events, and allows students to browse available events and register for them. The system maintains accurate real-time participant counts and explicitly tracks which event each student has registered for.
- **Technology Stack**:
  - **Frontend**: React 19 (JavaScript, strict `.jsx` syntax, CSS3)
  - **Backend**: Java 21, Spring Boot REST API (Spring Web, Spring Data JPA, Hibernate)
  - **Database**: Local Offline MySQL Database (`college_event_db` on `localhost:3306`)
  - **HTTP Communication**: REST APIs connected using **Axios** and **Fetch API**

---

## 2. KEY FEATURES OF THE SYSTEM

1. **Add College Event (Organizer)**:
   - Organizer can input: Event Name, Event Date, Venue, and Organizer Contact Email.
   - Saves record into MySQL database via `POST /api/events`.

2. **Display Available Events**:
   - Displays all upcoming college events in a structured table.
   - Shows Event ID, Name, Date, Venue, Contact Email, and live Registered Count.

3. **Edit Event (Organizer)**:
   - Organizer can select an existing event, edit any details, and update it in MySQL via `PUT /api/events/{id}`.

4. **Delete Event (Organizer)**:
   - Organizer can delete an event via `DELETE /api/events/{id}`. All registered participants for that event are also removed.

5. **Register Participant (Student)**:
   - Students select an event from an interactive dropdown and enter their Full Name and Student Email.
   - Submits registration via `POST /api/events/{eventId}/register`.

6. **Clear Event-to-Participant Association**:
   - Displays a dedicated table of registered students explicitly showing the student's name, email, and the exact event they have registered for (`eventName` and `eventId`).

7. **Cancel Registration**:
   - Allows cancelling a student's registration via `DELETE /api/participants/{id}`, automatically decrementing the event's registration count.

8. **Input Validation & Error Handling**:
   - Checks that required fields are not blank.
   - Checks valid email format using regular expressions on frontend and server-side checks on backend.
   - Prevents duplicate registrations if a student tries to register twice for the same event with the same email.

---

## 3. PROJECT FOLDER & FILE STRUCTURE

```
d:\Event-Registration\
├── .gitignore                      # Git ignore file (excludes node_modules & target)
├── README.md                       # Quick start reference
├── PROJECT_REPORT.md               # Detailed academic write-up
│
├── backend\                        # Spring Boot Application
│   ├── pom.xml                     # Maven dependencies (Spring Web, JPA, MySQL)
│   ├── mvnw / mvnw.cmd             # Maven Wrapper scripts
│   └── src\
│       ├── main\
│       │   ├── java\com\example\demo\
│       │   │   ├── DemoApplication.java       # Main entry point & sample data runner
│       │   │   ├── model\
│       │   │   │   ├── Event.java             # JPA Entity for events
│       │   │   │   └── Participant.java       # JPA Entity for student participants
│       │   │   ├── repository\
│       │   │   │   ├── EventRepository.java   # Spring Data JPA repo for Event
│       │   │   │   └── ParticipantRepository.java # Spring Data JPA repo for Participant
│       │   │   └── controller\
│       │   │       └── EventController.java   # REST Controller (GET, POST, PUT, DELETE)
│       │   └── resources\
│       │       └── application.properties     # MySQL DB URL, credentials, Hibernate
│       └── test\
│           └── java\com\example\demo\DemoApplicationTests.java
│
└── frontend\                       # React Application
    ├── index.html                  # HTML entry point
    ├── package.json                # React & Axios dependencies
    ├── vite.config.js              # Vite configuration
    └── src\
        ├── main.jsx                # React DOM render entry
        ├── App.jsx                 # Single-view component handling all UI, forms & APIs
        └── App.css                 # Clean, responsive CSS stylesheet
```

---

## 4. BACKEND REST API IMPLEMENTATION

The backend is structured into standard Spring Boot layers:
- **`@Entity` Models**: Represent tables in the relational database.
- **`@Repository` Interfaces**: Extend `JpaRepository` to provide ready-made CRUD methods (`findAll()`, `save()`, `deleteById()`, etc.) without writing manual SQL.
- **`@RestController`**: Handles incoming HTTP requests, maps URLs, validates input, interacts with repositories, and returns JSON responses.

### Summary of Backend Classes:

1. **`DemoApplication.java`**:
   - Contains `main()` method to start Spring Boot Tomcat server on port `8080`.
   - Contains a `CommandLineRunner` bean that automatically pre-populates initial sample college events if the database is empty.

2. **`model/Event.java`**:
   - Entity mapped to table `events`.
   - Fields: `Long id`, `String name`, `String date`, `String venue`, `String organizerEmail`, `int registrationCount`.

3. **`model/Participant.java`**:
   - Entity mapped to table `participants`.
   - Fields: `Long id`, `String name`, `String email`, `Long eventId`, `String eventName`, `LocalDateTime registeredAt`.

4. **`repository/EventRepository.java`**:
   - Extends `JpaRepository<Event, Long>`.

5. **`repository/ParticipantRepository.java`**:
   - Extends `JpaRepository<Participant, Long>`.
   - Custom query methods: `boolean existsByEmailAndEventId(String email, Long eventId);`, `void deleteByEventId(Long eventId);`.

6. **`controller/EventController.java`**:
   - Annotated with `@RestController`, `@RequestMapping("/api")`, `@CrossOrigin(origins = "*")`, `@Transactional`.
   - Directly injects `EventRepository` and `ParticipantRepository`.

---

## 5. REST ENDPOINTS & FRONTEND INTEGRATION

| HTTP Method | Endpoint URL | Purpose | Invoked from `App.jsx` Using |
|---|---|---|---|
| **GET** | `/api/events` | Retrieve list of all events with registration count | `axios.get('.../api/events')` |
| **POST** | `/api/events` | Add a new college event | `axios.post('.../api/events', eventForm)` |
| **PUT** | `/api/events/{id}` | Update existing event details | `axios.put('.../api/events/' + id, eventForm)` |
| **DELETE** | `/api/events/{id}` | Delete event & its participants | `axios.delete('.../api/events/' + id)` |
| **POST** | `/api/events/{eventId}/register` | Register a student for selected event | `axios.post('.../api/events/' + id + '/register', regForm)` |
| **GET** | `/api/participants` | Retrieve all registered participants & their events | `fetch('.../api/participants')` |
| **DELETE** | `/api/participants/{id}` | Cancel student registration & decrement count | `fetch('.../api/participants/' + id, {method: 'DELETE'})` |

---

## 6. DATA HANDLING & MYSQL DATABASE SCHEMA

### Database Configuration (`application.properties`):
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/college_event_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=Srish@1804
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Table 1: `events`
| Field Name | Data Type | Key / Attributes | Description |
|---|---|---|---|
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for event |
| `name` | `VARCHAR(255)` | NOT NULL | Title of the event |
| `date` | `VARCHAR(255)` | NOT NULL | Scheduled event date (YYYY-MM-DD) |
| `venue` | `VARCHAR(255)` | NOT NULL | Room / Lab / Hall location |
| `organizer_email` | `VARCHAR(255)` | NOT NULL | Organizer contact email |
| `registration_count` | `INT` | NOT NULL, DEFAULT 0 | Total number of students registered |

### Table 2: `participants`
| Field Name | Data Type | Key / Attributes | Description |
|---|---|---|---|
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for registration |
| `name` | `VARCHAR(255)` | NOT NULL | Student's full name |
| `email` | `VARCHAR(255)` | NOT NULL | Student's email address |
| `event_id` | `BIGINT` | NOT NULL | ID of the registered event |
| `event_name` | `VARCHAR(255)` | NOT NULL | Name of the registered event |
| `registered_at` | `DATETIME` | NOT NULL | Timestamp of registration |

---

## 7. REACT UI & FRONTEND-BACKEND INTEGRATION

The frontend uses **React (JavaScript with `.jsx`)** structured inside `App.jsx`:

1. **State Hooks (`useState`)**:
   - `events`: Array of event objects from server.
   - `participants`: Array of student registration records.
   - `eventForm`: Controlled state for `{ name, date, venue, organizerEmail }`.
   - `editingId`: Tracks whether form is in "Add" or "Edit" mode.
   - `regForm`: Controlled state for `{ eventId, name, email }`.
   - `message` & `error`: Status alert banners for user feedback.

2. **Lifecycle Hook (`useEffect`)**:
   - Triggers `fetchEvents()` and `fetchParticipants()` on component mount to load data from MySQL via the Spring Boot backend.

3. **Single-Page Dashboard Layout**:
   - **Top Left**: Add/Edit Event Form for Organizers.
   - **Top Right**: Event Registration Form for Students (with Event dropdown).
   - **Middle**: Available Events Table with live counts and Edit/Delete action buttons.
   - **Bottom**: Registered Students Table displaying Name, Email, Registered Event Name, Date, and Cancel button.

---

## 8. INPUT VALIDATION & ERROR HANDLING

1. **Client-Side Validation (`App.jsx`)**:
   - **Required Fields**: Checks `!name.trim() || !date || !venue.trim() || !organizerEmail.trim()` before submitting.
   - **Email Format**: Evaluates regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` to ensure valid email syntax (must include `@` and `.`).
   - Displays immediate visual warning banners (`alert error`).

2. **Server-Side Validation (`EventController.java`)**:
   - Validates that fields are not `null` or `isBlank()`.
   - Re-verifies email contains `@`.
   - **Duplicate Prevention**: Queries `participantRepo.existsByEmailAndEventId(p.getEmail(), eventId)`; if true, returns `400 Bad Request` with `"Student is already registered for this event!"`.

3. **HTTP Status Codes**:
   - `200 OK`: Successful retrieval, update, or deletion.
   - `201 Created`: Successfully created event or registration record.
   - `400 Bad Request`: Validation failure or duplicate email.
   - `404 Not Found`: Target ID does not exist in the database.

---

## 9. TESTING & OUTPUT VERIFICATION

| S.No | Test Case Description | Input Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **1** | Fetch available events | `GET /api/events` | Return JSON list of all events with registration count | Returned 3 sample events | **PASS** |
| **2** | Add new event | Name: "AI Bootcamp", Date: "2026-11-28", Venue: "Lab 1", Email: "ai@college.edu" | Event created in MySQL, status `201 Created` | Event added and shown in table | **PASS** |
| **3** | Update existing event | Update Name to "AI Bootcamp - Advanced" | Event updated in MySQL, status `200 OK` | Updated name reflected in UI | **PASS** |
| **4** | Delete event | Click Delete on Event #4 | Event and related registrations removed, status `200 OK` | Event removed from list | **PASS** |
| **5** | Register student for event | Event: Tech Symposium, Name: "Priya Nair", Email: "priya@example.com" | Record created in `participants`, count increments by 1 | Participant added, count updated | **PASS** |
| **6** | Duplicate email registration | Register same email for same event | Server returns `400 Bad Request` with duplicate warning | "Student is already registered..." error shown | **PASS** |
| **7** | Invalid email format | Email: "bademail" | Validation catches error, prevents submission | "Invalid email format" error shown | **PASS** |
| **8** | Cancel registration | Click Cancel on participant #1 | Record deleted from `participants`, event count decrements | Registration removed, count updated | **PASS** |

---

## 10. STEP-BY-STEP EXECUTION GUIDE

1. **Verify MySQL Service**:
   - Ensure MySQL 8.0 service is running on port `3306`.
   - Database `college_event_db` is created automatically or via:
     ```sql
     CREATE DATABASE IF NOT EXISTS college_event_db;
     ```

2. **Start Spring Boot Backend**:
   ```powershell
   cd d:\Event-Registration\backend
   .\mvnw.cmd spring-boot:run
   ```
   *Runs on `http://localhost:8080`*

3. **Start React Frontend**:
   ```powershell
   cd d:\Event-Registration\frontend
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
   *Access in browser at `http://127.0.0.1:5173`*
