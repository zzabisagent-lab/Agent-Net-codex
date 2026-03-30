const mongoose = require("mongoose");

const env = require("./env");

const CONNECTION_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

async function connectDB() {
  console.info("[boot] Connecting to MongoDB");

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.info("[boot] MongoDB connected");
}

function getDatabaseState() {
  return CONNECTION_STATES[mongoose.connection.readyState] || "unknown";
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  getDatabaseState,
  isDatabaseReady,
};
