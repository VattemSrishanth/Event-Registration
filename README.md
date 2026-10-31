# College Event Registration System

A minimal, clean, and basic full-stack web application designed for college evaluations, lab practical exams, and project submission.

- **Frontend**: React 19 (`.jsx` strict, Vite, Axios & Fetch API)
- **Backend**: Spring Boot REST API (Java 21, Spring Data JPA, Hibernate)
- **Database**: Local Offline MySQL Database (`college_event_db` on `localhost:3306`)

> 📖 **Comprehensive Academic / Exam Write-up**:  
> See the complete 2–3 page lab record write-up in [PROJECT_REPORT.md](PROJECT_REPORT.md).

---

## 📁 Minimal Folder Structure

```
d:\Event-Registration\
├── backend\
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src\main\
│       ├── java\com\example\demo\
│       │   ├── DemoApplication.java       # Main entry & sample data
│       │   ├── model\
│       │   │   ├── Event.java             # Event JPA entity
│       │   │   └── Participant.java       # Participant JPA entity
│       │   ├── repository\
│       │   │   ├── EventRepository.java   # Event Data JPA repo
│       │   │   └── ParticipantRepository.java # Participant Data JPA repo
│       │   └── controller\
│       │       └── EventController.java   # REST Controller (GET, POST, PUT, DELETE)
│       └── resources\
│           └── application.properties     # MySQL DB configuration
│
└── frontend\
    ├── index.html
    ├── package.json
    └── src\
        ├── main.jsx
        ├── App.jsx                        # Single clean component (~130 lines)
        └── App.css                        # Minimal stylesheet
```

---

## 🔌 REST Endpoints Summary

| Method | Endpoint | Description | Frontend Caller |
|---|---|---|---|
| `GET` | `/api/events` | List all events with counts | Axios (`axios.get`) |
| `POST` | `/api/events` | Create new event | Axios (`axios.post`) |
| `PUT` | `/api/events/{id}` | Update existing event | Axios (`axios.put`) |
| `DELETE` | `/api/events/{id}` | Delete event | Axios (`axios.delete`) |
| `POST` | `/api/events/{id}/register` | Register student for event | Axios (`axios.post`) |
| `GET` | `/api/participants` | List registered students with event name | Fetch API (`fetch`) |
| `DELETE` | `/api/participants/{id}` | Cancel student registration | Fetch API (`fetch`) |

---

## 🏃 Quick Start Commands

### 1. Run Backend
```powershell
cd d:\Event-Registration\backend
.\mvnw.cmd spring-boot:run
```
*Backend URL: `http://localhost:8080/api/events`*

### 2. Run Frontend
```powershell
cd d:\Event-Registration\frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
*Frontend URL: `http://127.0.0.1:5173`*
