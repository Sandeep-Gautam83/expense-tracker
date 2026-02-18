const mongoose = require("mongoose");

const idempotencyKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // TTL: 24 hours (in seconds)
  },
});

const IdempotencyKey = mongoose.model("IdempotencyKey", idempotencyKeySchema);

module.exports = IdempotencyKey;
