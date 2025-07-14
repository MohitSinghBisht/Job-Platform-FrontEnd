# Job Hunting Platform

A comprehensive job hunting platform built with Spring Boot and Angular, featuring role-based access for Recruiters and Job Seekers.

## Project Structure

The project is organized into two main parts:
- `backend`: Spring Boot application
- `frontend`: Angular application

## Features

### For Job Seekers
- Create and manage professional profiles
- Search and apply for jobs
- Track application status
- Receive notifications about application updates
- Save favorite jobs
- Add education, experience, and skills

### For Recruiters
- Create company profiles
- Post and manage job listings
- Review applications
- Contact candidates
- Track hiring pipeline

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT Authentication
- Spring Data JPA
- H2 Database (for development)
- MySQL/PostgreSQL (for production)
- Maven

### Frontend
- Angular 17
- Bootstrap 5
- TypeScript
- RxJS

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm 8 or higher
- Maven 3.6 or higher

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Build the project:
   ```
   mvn clean install
   ```
3. Run the application:
   ```
   mvn spring-boot:run
   ```
The backend server will start on http://localhost:8080.

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
The frontend application will be available at http://localhost:4200.

## API Documentation

The backend provides RESTful APIs secured with JWT authentication:

- Authentication endpoints: `/api/auth/`
- Job listings: `/api/jobs/`
- User profiles: `/api/profile/`
- Applications: Managed through jobs
- Notifications: `/api/notifications/`

## Security

- Role-based access control
- JWT token authentication
- Password encryption
- Protected API endpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.
