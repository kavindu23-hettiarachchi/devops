# Docker Setup & Database Connection Guide

## What was fixed:

1. **Database Connection** - Updated `server.js` to properly call the `connectDB()` function at startup
2. **Duplicate Methods** - Removed three duplicate `login()` methods from `authController.js`
3. **Environment Variables** - Configured proper `.env` file with MongoDB Docker URI
4. **Docker Compose** - Enhanced with health checks, proper networking, and container names

## Running in WSL Docker:

### 1. Navigate to project directory
```bash
cd /mnt/c/Users/ASUS/Desktop/DevopsProject
```

### 2. Build and start all services
```bash
docker-compose up --build
```

### 3. Wait for services to be ready
- MongoDB should connect within ~40 seconds
- Backend health check will verify connectivity
- Frontend will be ready once build completes

### 4. Test the connection

**Test API:**
```bash
curl http://localhost:4000/api/test
```

**Register a user:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Access Services:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **MongoDB:** localhost:27017 (internal Docker: mongodb://mongodb:27017)

## If login/register still fails:

1. Check backend logs:
```bash
docker logs devops-backend
```

2. Check MongoDB status:
```bash
docker logs devops-mongodb
```

3. Verify MongoDB connection from backend container:
```bash
docker exec devops-backend curl http://localhost:5000/api/test
```

## Environment Variables:

The `.env` file already has Docker-compatible settings:
- `MONGODB_URI=mongodb://mongodb:27017/demo` - Uses Docker network hostname
- `PORT=5000` - Backend port inside container
- `JWT_SECRET` - Configured for auth tokens

**IMPORTANT:** Change `JWT_SECRET` to a strong value before deploying to production!

## Stopping services:
```bash
docker-compose down
```

## Removing volumes (clean database):
```bash
docker-compose down -v
```
