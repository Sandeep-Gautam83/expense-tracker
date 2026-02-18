const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Expense = require("../models/Expense");
const IdempotencyKey = require("../models/IdempotencyKey");

// Test database connection
beforeAll(async () => {
  // Use test database
  const testDbUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker-test";

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(testDbUri);
});

// Clean up after each test
afterEach(async () => {
  await Expense.deleteMany({});
  await IdempotencyKey.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Idempotency Tests", () => {
  test("should create expense with idempotency key", async () => {
    const expenseData = {
      amount: 5050, // ₹50.50 in paise
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const idempotencyKey = "test-key-12345";

    const response = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", idempotencyKey)
      .send(expenseData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.amount).toBe(5050);
    expect(response.body.data.category).toBe("Food");

    // Verify expense was created in database
    const expenses = await Expense.find({});
    expect(expenses.length).toBe(1);

    // Verify idempotency key was stored
    const storedKey = await IdempotencyKey.findOne({ key: idempotencyKey });
    expect(storedKey).toBeTruthy();
  });

  test("should return cached response for duplicate idempotency key", async () => {
    const expenseData = {
      amount: 5050,
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const idempotencyKey = "duplicate-key-67890";

    // First request
    const response1 = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", idempotencyKey)
      .send(expenseData)
      .expect(201);

    const firstExpenseId = response1.body.data._id;

    // Second request with same key and same data
    const response2 = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", idempotencyKey)
      .send(expenseData)
      .expect(201);

    // Should return same expense ID
    expect(response2.body.data._id).toBe(firstExpenseId);

    // Verify only ONE expense was created in database
    const expenses = await Expense.find({});
    expect(expenses.length).toBe(1);
  });

  test("should create different expenses with different idempotency keys", async () => {
    const expenseData1 = {
      amount: 5050,
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const expenseData2 = {
      amount: 3000,
      category: "Transport",
      description: "Taxi",
      date: "2026-02-18",
    };

    await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "key-1")
      .send(expenseData1)
      .expect(201);

    await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "key-2")
      .send(expenseData2)
      .expect(201);

    // Should have two expenses
    const expenses = await Expense.find({});
    expect(expenses.length).toBe(2);
  });
});

describe("Money Handling Tests", () => {
  test("should accept amount in paise (integer)", async () => {
    const expenseData = {
      amount: 5050, // ₹50.50 in paise
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "money-test-1")
      .send(expenseData)
      .expect(201);

    expect(response.body.data.amount).toBe(5050);
  });

  test("should reject amount with decimals", async () => {
    const expenseData = {
      amount: 50.5, // Should be 5050
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "money-test-2")
      .send(expenseData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("paise");
  });

  test("should reject negative amounts", async () => {
    const expenseData = {
      amount: -1000,
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "money-test-3")
      .send(expenseData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("non-negative");
  });

  test("should reject invalid amount", async () => {
    const expenseData = {
      amount: "invalid",
      category: "Food",
      description: "Lunch",
      date: "2026-02-18",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "money-test-4")
      .send(expenseData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test("should handle large amounts correctly", async () => {
    const expenseData = {
      amount: 10000000, // ₹1,00,000.00 (one lakh rupees)
      category: "Shopping",
      description: "Laptop",
      date: "2026-02-18",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Idempotency-Key", "money-test-5")
      .send(expenseData)
      .expect(201);

    expect(response.body.data.amount).toBe(10000000);
  });
});

describe("API Endpoint Tests", () => {
  test("should get all expenses", async () => {
    // Create test expenses
    await Expense.create([
      {
        amount: 5050,
        category: "Food",
        description: "Lunch",
        date: "2026-02-18",
      },
      {
        amount: 3000,
        category: "Transport",
        description: "Taxi",
        date: "2026-02-17",
      },
    ]);

    const response = await request(app).get("/api/expenses").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
    expect(response.body.data.length).toBe(2);
  });

  test("should return empty array when no expenses exist", async () => {
    const response = await request(app).get("/api/expenses").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(0);
    expect(response.body.data.length).toBe(0);
  });
});
