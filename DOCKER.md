# Docker Setup Guide

This guide explains how to run the MusicStream application using Docker.

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 4GB RAM available for Docker

## Quick Start

### 1. Clone and Navigate
```bash
cd musicstream
```

### 2. Build and Start All Services
```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** database on port 5432
- **Backend** (Spring Boot) on port 8080
- **Frontend** (Angular/Nginx) on port 80

### 3. Access the Application
Open your browser and navigate to: `http://localhost`

## Environment Variables

Copy the example environment file and customize:
```bash
cp .env.example .env
```

Edit `.env` to configure:
- Database credentials
- Backend settings
- Frontend configuration

## Docker Commands

### Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Start Services
```bash
# Start in foreground
docker-compose up

# Start in background (detached)
docker-compose up -d

# Start specific service
docker-compose up backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data!)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Development vs Production

### Development Mode
```bash
# Use default docker-compose.yml
docker-compose up
```

### Production Mode
```bash
# Use production override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Persistent Data

Data is stored in Docker volumes:
- `postgres_data` - Database data
- `backend_uploads` - Uploaded audio files

To backup data:
```bash
# Backup database
docker exec musicstream-db pg_dump -U postgres musicstream_db > backup.sql

# Restore database
docker exec -i musicstream-db psql -U postgres musicstream_db < backup.sql
```

## Troubleshooting

### Port Already in Use
If ports 80, 8080, or 5432 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Change host port
```

### Database Connection Issues
1. Check if database is healthy:
```bash
docker-compose ps
```

2. Check database logs:
```bash
docker-compose logs db
```

3. Verify connection from backend:
```bash
docker exec -it musicstream-backend ping db
```

### Frontend Can't Connect to Backend
1. Check backend health:
```bash
curl http://localhost:8080/actuator/health
```

2. Verify Nginx proxy configuration in `frontend/nginx.conf`

### Clear Everything and Start Fresh
```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove images
docker rmi musicstream-backend musicstream-frontend

# Rebuild and start
docker-compose up --build
```

## Health Checks

All services have health checks configured:

- **Database**: `pg_isready` check every 10s
- **Backend**: HTTP check on `/actuator/health` every 30s
- **Frontend**: HTTP check on port 80 every 30s

View health status:
```bash
docker-compose ps
```

## Updating the Application

### Update Code
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up --build -d
```

### Update Dependencies
```bash
# Backend: Update pom.xml, then rebuild
docker-compose build backend

# Frontend: Update package.json, then rebuild
docker-compose build frontend
```

## Security Considerations

1. **Change default passwords** in `.env` file
2. **Use secrets** for production (Docker Swarm secrets or Kubernetes secrets)
3. **Enable HTTPS** with a reverse proxy (Nginx/Traefik)
4. **Regular updates** of base images
5. **Scan images** for vulnerabilities:
```bash
docker scan musicstream-backend
docker scan musicstream-frontend
```

## Performance Optimization

### Resource Limits
Add resource limits in `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

### Multi-stage Build Benefits
- **Backend**: ~150MB (vs ~700MB with full JDK)
- **Frontend**: ~25MB (vs ~1GB with Node)

## Next Steps

- Set up CI/CD with GitHub Actions (see `.github/workflows/ci-cd.yml`)
- Deploy to cloud (AWS ECS, Google Cloud Run, Azure Container Instances)
- Set up monitoring (Prometheus, Grafana)
- Configure backups and disaster recovery
