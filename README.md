# 💼 Job Hunting Platform

A full-featured job hunting platform built using **Spring Boot** and **Angular**, designed to serve both **Job Seekers** and **Recruiters** with a smooth and secure experience.

---

## 🧱 Project Structure

```
job-hunting-platform/
├── backend/   → Spring Boot (Java 17)
└── frontend/  → Angular 17
```

---

## ✨ Features

### 👤 For Job Seekers
- Create & manage professional profiles
- Search & apply for jobs
- Track application status
- Receive job-related notifications
- Save favorite jobs
- Add education, experience & skills

### 🧑‍💼 For Recruiters
- Create company profiles
- Post & manage job listings
- Review applications
- Contact candidates
- Track hiring pipeline

---

## 🚀 Technologies Used

### 🔙 Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- H2 (dev), MySQL/PostgreSQL (prod)
- Maven

### 🔜 Frontend
- Angular 17
- TypeScript + RxJS
- Bootstrap 5

---

## 🛠️ Getting Started

### ✅ Prerequisites
- Java 17+
- Node.js 16+
- npm 8+
- Maven 3.6+

---

### 🔧 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
➡️ Runs on `http://localhost:8080`

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```
➡️ Runs on `http://localhost:4200`

---

## 📡 API Endpoints (secured with JWT)

| Feature         | Endpoint Prefix        |
|-----------------|------------------------|
| Auth            | `/api/auth/`           |
| Jobs            | `/api/jobs/`           |
| Profiles        | `/api/profile/`        |
| Notifications   | `/api/notifications/`  |

---

## 🔐 Security Highlights

- Role-based access control
- JWT authentication
- Encrypted passwords
- Protected REST endpoints

---

## 📄 License

Licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for full details.

---
