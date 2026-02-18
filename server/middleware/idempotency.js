const IdempotencyKey = require("../models/IdempotencyKey");

/**
 * Middleware to handle idempotent POST requests
 * Checks if idempotency key exists and returns cached response
 * Prevents duplicate expense creation from retries/refreshes
 */
const handleIdempotency = async (req, res, next) => {
  // Only apply to POST requests
  if (req.method !== "POST") {
    return next();
  }

  const idempotencyKey = req.headers["idempotency-key"];

  // If no idempotency key provided, proceed (will be required in validation later)
  if (!idempotencyKey) {
    return next();
  }

  try {
    // Check if this key has been used before
    const existingKey = await IdempotencyKey.findOne({ key: idempotencyKey });

    if (existingKey) {
      // Return cached response
      console.log(
        `Idempotency key found: ${idempotencyKey} - returning cached response`,
      );
      return res
        .status(existingKey.response.statusCode || 201)
        .json(existingKey.response.body);
    }

    // Store the original res.json to intercept response
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = async function (body) {
      // Cache the response with the idempotency key
      try {
        await IdempotencyKey.create({
          key: idempotencyKey,
          response: {
            statusCode: res.statusCode,
            body: body,
          },
        });
        console.log(`Idempotency key saved: ${idempotencyKey}`);
      } catch (error) {
        // If caching fails (e.g., duplicate key race condition), just log it
        console.error("Failed to cache idempotency key:", error.message);
      }

      // Send the response as normal
      return originalJson(body);
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = handleIdempotency;
