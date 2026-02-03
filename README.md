# MusicStream

A full-stack music streaming application built with Angular and Spring Boot, featuring audio playback, track management, and a modern UI.

![MusicStream](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [CI/CD](#cicd)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Audio Playback**: Stream and play audio files with full playback controls
- **Track Management**: Create, read, update, and delete music tracks
- **File Upload**: Upload audio files (MP3, WAV, OGG) with validation
- **Modern UI**: Responsive design with Tailwind CSS and glassmorphism effects
- **State Management**: NgRx for predictable state management
- **Real-time Updates**: Live duration tracking and playback status
- **Category System**: Organize tracks by music genres
- **RESTful API**: Well-structured backend API with Spring Boot
- **Docker Support**: Containerized deployment with Docker Compose
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions

## 🛠 Tech Stack

### Frontend
- **Framework**: Angular 17+ (Standalone Components)
- **State Management**: NgRx (Store, Effects, Selectors)
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient
- **Testing**: Jasmine, Karma

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Validation**: Jakarta Validation
- **File Processing**: Apache Tika
- **Testing**: JUnit 5, Mockito

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Web Server**: Nginx (for frontend)
- **Database**: PostgreSQL 15

## 📦 Prerequisites

### For Local Development
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Java**: 17 or higher
- **Maven**: 3.8 or higher
- **PostgreSQL**: 15 or higher

### For Docker Deployment
- **Docker**: 20.x or higher
- **Docker Compose**: 2.x or higher

## 🚀 Quick Start

### Option 1: Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/musicstream.git
cd musicstream
```

#### 2. Setup Database
```bash
# Create PostgreSQL database
createdb musicstream

# Update backend/src/main/resources/application.yml with your database credentials
```

#### 3. Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 4. Start Frontend
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:4200`

### Option 2: Docker Deployment

#### 1. Clone and Configure
```bash
git clone https://github.com/yourusername/musicstream.git
cd musicstream

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

#### 2. Start with Docker Compose
```bash
docker-compose up -d
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 📁 Project Structure

```
musicstream/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── org/example/musicstream/
│   │   │   │       ├── config/          # Configuration classes
│   │   │   │       ├── controller/      # REST controllers
│   │   │   │       ├── dto/             # Data Transfer Objects
│   │   │   │       ├── entity/          # JPA entities
│   │   │   │       ├── exception/       # Exception handlers
│   │   │   │       ├── mapper/          # Entity-DTO mappers
│   │   │   │       ├── repository/      # JPA repositories
│   │   │   │       └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.yml      # Application config
│   │   └── test/                        # Unit tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/              # Reusable components
│   │   │   ├── core/
│   │   │   │   ├── models/              # TypeScript interfaces
│   │   │   │   └── services/            # HTTP services
│   │   │   ├── pages/                   # Page components
│   │   │   └── store/                   # NgRx store
│   │   │       ├── player/              # Player state
│   │   │       └── track/               # Track state
│   │   ├── assets/                      # Static assets
│   │   └── styles.css                   # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions workflow
│
├── docker-compose.yml          # Docker Compose configuration
├── .env.example                # Environment variables template
├── DOCKER.md                   # Docker documentation
├── CI-CD.md                    # CI/CD documentation
└── README.md                   # This file
```

## 💻 Development

### Backend Development

#### Running Tests
```bash
cd backend
mvn test
```

#### Building
```bash
mvn clean package
```

#### Code Style
- Follow Java naming conventions
- Use Lombok for boilerplate code
- Keep controllers thin, services fat
- Write unit tests for services

### Frontend Development

#### Running Tests
```bash
cd frontend
npm test
```

#### Building for Production
```bash
npm run build
```

#### Code Style
- Use Angular style guide
- Follow reactive programming patterns
- Use NgRx for state management
- Write unit tests for services and components

### API Endpoints

#### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/{id}` - Get track by ID
- `POST /api/tracks` - Create new track
- `PUT /api/tracks/{id}` - Update track
- `DELETE /api/tracks/{id}` - Delete track
- `POST /api/tracks/{id}/upload` - Upload audio file
- `GET /api/tracks/{id}/stream` - Stream audio file

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test                          # Run all tests
mvn test -Dtest=ClassName         # Run specific test class
```

### Frontend Tests
```bash
cd frontend
npm test                          # Run all tests
npm run test:coverage             # Run with coverage
```

## 🐳 Docker Deployment

### Build Images
```bash
docker-compose build
```

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Full Cleanup
```bash
docker-compose down -v --rmi all
```

## 🔄 CI/CD

The project uses GitHub Actions for continuous integration and deployment.

### Workflow Triggers
- Push to `main` branch
- Pull requests to `main` branch

### Pipeline Stages
1. **Backend Tests**: Run JUnit tests
2. **Frontend Tests**: Run Jasmine/Karma tests
3. **Build Docker Images**: Build and tag images
4. **Security Scan**: Scan for vulnerabilities

## 📚 API Documentation

### Track Model
```json
{
  "id": 1,
  "title": "Song Title",
  "artist": "Artist Name",
  "category": "Rock",
  "description": "Song description",
  "duration": 180,
  "fileUrl": "http://localhost:8080/api/tracks/1/stream",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Supported Audio Formats
- MP3 (audio/mpeg, audio/mp3)
- WAV (audio/wav, audio/x-wav, audio/vnd.wav)
- OGG (audio/ogg)

### File Size Limits
- Maximum file size: 10MB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention
- `add: new feature`
- `update: existing feature`
- `fix: bug fix`
- `remove: deprecated code`
- `refactor: code restructuring`

## 🔄 Diagramme De Class

![diagramme de class](diagramme_de_class/image)

**Built with ❤️ by the MusicStream Team**
