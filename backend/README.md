# BookIt Backend API

## Setup Instructions

1. **Rename the env file:**
   ```bash
   # Rename env.txt to .env
   mv env.txt .env
   # OR on Windows:
   ren env.txt .env
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Make sure MongoDB is running:**
   - Install MongoDB locally or use MongoDB Atlas
   - Default connection: `mongodb://localhost:27017/bookit`

4. **Seed the database with initial data:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### GET /api/experiences
Returns list of all active experiences

### GET /api/experiences/:id
Returns detailed information about a specific experience including slot availability

### POST /api/bookings
Creates a new booking
**Body:** `{ experienceId, fullName, email, date, time, location, quantity, price, taxes, total, agreedToTerms }`

### POST /api/promo/validate
Validates a promo code
**Body:** `{ code, subtotal }`

### GET /api/bookings/:refId
Retrieves booking details by reference ID

### GET /api/health
Health check endpoint

## Available Promo Codes
- **SAVE10** - 10% off (min purchase ₹500, max discount ₹200)
- **FLAT100** - ₹100 off (min purchase ₹1000)
- **WELCOME20** - 20% off (no minimum, max discount ₹500)

## Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookit
NODE_ENV=development
```
