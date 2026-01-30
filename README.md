# MusicStream - Full-Stack Music Library Application

A modern, full-stack music streaming application built with **Angular 21** and **Spring Boot 4.0**, featuring NgRx state management, real-time audio playback, and Docker deployment.

## 🚀 Features

### Frontend (Angular 21)
- ✨ **Modern UI** with Tailwind CSS and gradient designs
- 🎵 **Audio Player** with play/pause, seek, and volume controls
- 📊 **NgRx State Management** for predictable state updates
- 🔄 **Lazy Loading** for optimized performance
- 📱 **Responsive Design** for all devices
- 🎨 **Beautiful Animations** and smooth transitions

### Backend (Spring Boot 4.0)
- 🔐 **RESTful API** with proper error handling
- 📁 **File Upload** with validation (MP3, WAV, OGG)
- 🎼 **Audio Metadata Extraction** using Apache Tika
- 🗄️ **PostgreSQL Database** for data persistence
- 🔒 **CORS Configuration** for secure cross-origin requests
- 📝 **DTO Pattern** with MapStruct for clean architecture

### DevOps
- 🐳 **Docker** containerization for all services
- 🔄 **Docker Compose** for easy orchestration
- 🚀 **CI/CD Pipeline** with GitHub Actions
- 🔍 **Security Scanning** with Trivy
- 📦 **Multi-stage Builds** for optimized images

## 📋 Prerequisites

- **Java 17+**
- **Node.js 20+**
- **PostgreSQL 15+**
- **Docker & Docker Compose** (for containerized deployment)
- **Maven 3.9+**

## 🛠️ Installation & Setup

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd musicstream
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - PostgreSQL: localhost:5432

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure PostgreSQL**
   - Create database: `musicstream_db`
   - Update `src/main/resources/application.yml` with your credentials

3. **Build and run**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

4. **Backend will start on** http://localhost:8080

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Frontend will start on** http://localhost:4200

## 📁 Project Structure

```
musicstream/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── org/example/musicstream/
│   │   │   │       ├── config/          # CORS, Security configs
│   │   │   │       ├── controller/      # REST Controllers
│   │   │   │       ├── dto/             # Data Transfer Objects
│   │   │   │       ├── entity/          # JPA Entities
│   │   │   │       ├── exception/       # Exception Handlers
│   │   │   │       ├── mapper/          # MapStruct Mappers
│   │   │   │       ├── repository/      # JPA Repositories
│   │   │   │       └── service/         # Business Logic
│   │   │   └── resources/
│   │   │       └── application.yml      # Application Config
│   │   └── test/                        # Unit & Integration Tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/              # TypeScript Interfaces
│   │   │   │   └── services/            # API & Player Services
│   │   │   ├── features/
│   │   │   │   ├── tracks/              # Track Components
│   │   │   │   └── player/              # Audio Player
│   │   │   ├── store/
│   │   │   │   ├── tracks/              # Track NgRx Store
│   │   │   │   └── player/              # Player NgRx Store
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/                # Environment Configs
│   │   ├── main.ts
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions Pipeline
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/{id}` - Get track by ID
- `POST /api/tracks` - Create new track
- `PUT /api/tracks/{id}` - Update track
- `DELETE /api/tracks/{id}` - Delete track
- `POST /api/tracks/{id}/upload` - Upload audio file
- `GET /api/tracks/{id}/stream` - Stream audio file

## 🎯 Usage

### Adding a Track

1. Click **"+ Add New Track"** button
2. Fill in track details (Title, Artist, Category, Description)
3. Upload an audio file (MP3, WAV, or OGG, max 10MB)
4. Click **"Create Track"**

### Playing Music

1. Click the **Play** button on any track card
2. Use the audio player at the bottom to:
   - Play/Pause
   - Seek to position
   - Adjust volume
   - View progress

### Editing a Track

1. Click the **Edit** icon on a track card
2. Update track information
3. Optionally upload a new audio file
4. Click **"Update Track"**

### Deleting a Track

1. Click the **Delete** icon on a track card
2. Confirm deletion
3. Track and associated audio file will be removed

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend
```

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.yml`:
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/musicstream_db
    username: postgres
    password: your_password

storage:
  upload-dir: uploads/
```

### Frontend Configuration
Edit `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/musicstream-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve dist/music-stream/browser with your web server
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d
```

## 📊 Technologies Used

### Frontend
- Angular 21
- NgRx (Store, Effects, DevTools)
- RxJS
- Tailwind CSS
- TypeScript

### Backend
- Spring Boot 4.0
- Spring Data JPA
- Spring Security
- PostgreSQL
- Apache Tika
- MapStruct
- Lombok

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Nginx

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed as part of the MusicStream Full-Stack Integration Project.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Spring Team for Spring Boot
- NgRx Team for state management
- Tailwind CSS for beautiful styling

---

**Happy Coding! 🎵**
#   m u s i c S t r e a m _ V 2  
 