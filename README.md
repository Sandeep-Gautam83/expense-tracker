# Expense Tracker - MERN Stack

A production-ready personal finance tool built with MongoDB, Express, React, and Node.js. This application handles real-world scenarios like unreliable networks, browser refreshes, and duplicate submissions.

## 🎯 Features

- ✅ Create expense entries with amount, category, description, and date
- ✅ View list of all expenses
- ✅ Filter expenses by category
- ✅ Sort expenses by date (newest first)
- ✅ See total of visible expenses
- ✅ Idempotent API (handles retries and duplicate submissions)
- ✅ Precise money handling (no floating-point errors)

## 🏗️ Architecture Decisions

### Idempotency Handling
- **Problem**: Users may click submit multiple times, browsers retry failed requests, or pages get refreshed during submission
- **Solution**: Implemented idempotency keys using UUID headers. Each request includes a unique key that's checked before processing
- **Trade-off**: Requires extra database storage for keys, but prevents duplicate expense entries in all scenarios

### Money Storage
- **Decision**: Store amounts as integers (paise/cents) instead of decimals
- **Rationale**: JavaScript floating-point arithmetic is unreliable (0.1 + 0.2 ≠ 0.3). Storing ₹50.50 as 5050 paise ensures accuracy
- **Implementation**: Frontend multiplies by 100 before sending, backend stores integers, display converts back using Intl.NumberFormat

### Database Choice
- **Choice**: MongoDB with Mongoose ODM
- **Rationale**: 
  - Full MERN stack consistency
  - Flexible schema for future extensions
  - TTL indexes for auto-expiring idempotency keys
  - Good performance for read-heavy workload
- **Trade-off**: Requires MongoDB installation/Atlas setup vs SQLite's simplicity

### Project Structure
- **Monorepo**: Both backend and frontend in same repository for easier atomic commits
- **Separate folders**: `/server` and `/client` can be deployed independently if needed

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation OR MongoDB Atlas account)
- npm or yarn

### Installing MongoDB

**Option 1: Local MongoDB**
- Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`

**Option 2: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` with your connection string

### Installation

```bash
# Clone the repository
cd ExpenseTracker

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies (after Commit 3)
cd client
npm install
cd ..
```

### Environment Variables

Copy `.env.example` to `.env` and update:

```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

PORT=5000
NODE_ENV=development
```

### Running the Application

```bash
# Start backend only
npm run server

# Start frontend only (after Commit 3)
npm run client

# Start both concurrently
npm run dev
```

## 📡 API Endpoints

### POST /api/expenses
Create a new expense entry.

**Headers:**
```
Content-Type: application/json
Idempotency-Key: <uuid> (added in Commit 2)
```

**Request Body:**
```json
{
  "amount": 5050,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-02-18T12:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "amount": 5050,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2026-02-18T12:30:00.000Z",
    "createdAt": "2026-02-18T12:30:00.000Z",
    "updatedAt": "2026-02-18T12:30:00.000Z"
  }
}
```

### GET /api/expenses
Retrieve all expenses.

**Query Parameters (added in Commit 4):**
- `category` - Filter by category
- `sort=date_desc` - Sort by date (newest first)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

## 🧪 Testing

```bash
cd server
npm test
```

Tests focus on:
- Idempotency (duplicate keys don't create duplicates)
- Money handling (amounts stored as integers)
- API endpoints (CRUD operations)

## 📝 Development Progress

### ✅ Commit 1: Backend Foundation & Database Setup
- Express server with MongoDB connection
- Expense model with proper schema
- Basic CRUD endpoints
- CORS and error handling middleware
- Project structure and configuration

### 🔜 Commit 2: Idempotency & Money Handling (Planned)
- IdempotencyKey model with TTL
- Middleware to check duplicate keys
- Money validation and conversion
- Integration tests

### 🔜 Commit 3: React Frontend Foundation (Planned)
- Vite + React setup
- Tailwind CSS styling
- Expense form with UUID generation
- Expense list with currency formatting

### 🔜 Commit 4: Filtering, Sorting & Totals (Planned)
- Category filter dropdown
- Date sorting controls
- Total calculation display
- Query parameter handling

### 🔜 Commit 5: Validation, Error Handling & Polish (Planned)
- Frontend and backend validation
- Error states and messages
- Loading spinners
- Summary view by category
- Unit tests

## 🎯 What Was Intentionally NOT Implemented

Due to time constraints and prioritization:

- **Authentication/Authorization**: Single-user application, would add complexity without core value
- **Pagination**: Not needed for small expense lists, would implement if scaling beyond 1000 entries
- **Recurring Expenses**: Nice feature but not part of core acceptance criteria
- **Export to CSV/PDF**: Valuable but lower priority than core functionality
- **Budget Limits/Alerts**: Would require additional user preference system
- **Multi-currency Support**: Designed for INR only, architecture allows future extension
- **Advanced Analytics**: Beyond "simple total" requirement
- **Mobile Native App**: Web-first approach, responsive design sufficient
- **Offline Support**: Would require service workers and sync logic

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS
- **Testing**: Jest, Supertest
- **Dev Tools**: Nodemon, Concurrently

## 📄 License

ISC

## 👤 Author

Built as a demonstration of MERN stack proficiency with focus on production-ready code, handling edge cases, and data correctness.
