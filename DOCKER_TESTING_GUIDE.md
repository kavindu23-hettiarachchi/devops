# 🐳 Docker Testing Guide for Cart Fix

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# From the root project directory
docker compose up --build
```

This will start:
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:3000` (or `http://localhost:5173` if you're developing)
- MongoDB

### Option 2: Rebuild and Run

```bash
# Rebuild containers
docker compose build

# Start all services
docker compose up

# In another terminal, view logs
docker compose logs -f
```

### Stop Services

```bash
docker compose down
```

---

## Testing Cart in Docker

### Step 1: Verify Services are Running

```bash
# Check running containers
docker compose ps

# Expected output:
# NAME              COMMAND            STATUS      PORTS
# devopsproject-backend-1      ...      Up 2 min    0.0.0.0:4000->5000/tcp
# devopsproject-frontend-1     ...      Up 2 min    0.0.0.0:3000->5173/tcp
# devopsproject-mongodb-1      ...      Up 2 min    0.0.0.0:27017->27017/tcp
```

### Step 2: Access the Application

**Frontend:** `http://localhost:3000` or `http://localhost:5173`

**Backend API:** `http://localhost:4000`

### Step 3: Test the Cart Flow

1. **Register new user**
   ```
   http://localhost:3000/register
   - Username: docker_test
   - Email: docker@test.com
   - Password: Test123!
   ```

2. **Login**
   ```
   http://localhost:3000/login
   - Email: docker@test.com
   - Password: Test123!
   ```

3. **Add to Cart**
   - Scroll down to food items
   - Click "Add to Cart" on any item
   - Check navbar badge (should show "1")
   - Open DevTools (F12) → Console → Should see logs

4. **View Cart**
   - Click 🛒 Cart in navbar
   - Should see the item you added

5. **Verify Database**
   ```bash
   # Connect to MongoDB in container
   docker exec -it devopsproject-mongodb-1 mongosh
   
   # In MongoDB shell
   use food_delivery_db
   db.carts.findOne()
   
   # Should show your cart with items
   ```

---

## Debugging with Docker

### View Backend Logs

```bash
docker compose logs backend -f

# You should see:
# Adding to cart: {foodId: "...", quantity: 1}
# Cart after save: {items: [...], totalPrice: ...}
```

### View Frontend Console

Open browser DevTools (F12) and check:
- Console tab for JavaScript errors
- Network tab for API calls
- Look for POST to `/api/cart/add`

### Check Backend is Working

```bash
# Test API
curl http://localhost:4000/api/test

# Expected response:
# {"message":"API is working!"}
```

### Connect to MongoDB

```bash
# Access MongoDB shell
docker exec -it devopsproject-mongodb-1 mongosh

# Check database
show dbs
use food_delivery_db
db.carts.find()
db.orders.find()
db.users.find()
```

---

## Common Issues & Solutions

### Issue: Port Already in Use

**Error:** `bind: address already in use`

**Solution:**
```bash
# Find what's using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux

# Kill the process or use different port in docker-compose.yml
```

### Issue: Backend not connecting to MongoDB

**Solution:**
```bash
# Check MongoDB is running
docker compose ps

# Restart services
docker compose restart mongodb
docker compose restart backend
```

### Issue: Frontend not loading

**Solution:**
```bash
# Check frontend logs
docker compose logs frontend -f

# Restart frontend
docker compose restart frontend
```

### Issue: Cart still empty

**Check:**
1. Are you logged in? (Navbar should show "Welcome, [name]")
2. Open DevTools (F12) → Network tab → Check POST to `/api/cart/add`
3. Backend logs should show "Adding to cart" messages
4. Check MongoDB to see if cart document exists

```bash
# Terminal check
docker compose logs backend -f | grep "Adding to cart"
```

---

## Rebuild After Code Changes

After modifying code, rebuild and restart:

```bash
# Stop current services
docker compose down

# Rebuild containers
docker compose build

# Start again
docker compose up

# Or in one command
docker compose up --build
```

---

## Production Testing

### Check All Endpoints

```bash
# Register endpoint
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "Test123!"
  }'

# Login endpoint
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test123!"
  }'

# Get Foods
curl http://localhost:4000/api/foods

# Add to Cart (replace TOKEN)
curl -X POST http://localhost:4000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "foodId": "FOOD_ID",
    "quantity": 1
  }'
```

---

## Next Steps

After confirming cart works in Docker:

1. ✅ Test add to cart
2. ✅ Test remove from cart
3. ✅ Test update quantity
4. ✅ Test checkout
5. ✅ Test orders page
6. ✅ Test order status tracking

All features should work seamlessly! 🎉

---

## Useful Docker Commands

```bash
# View all containers
docker compose ps

# View logs (all services)
docker compose logs -f

# View specific service logs
docker compose logs backend -f
docker compose logs frontend -f
docker compose logs mongodb -f

# Execute command in container
docker exec -it devopsproject-backend-1 bash
docker exec -it devopsproject-frontend-1 bash

# Stop all services
docker compose stop

# Remove containers and volumes
docker compose down -v

# Rebuild specific service
docker compose build backend
```

---

**Good luck! 🚀**
