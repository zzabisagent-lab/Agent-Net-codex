const express = require("express");

const { getDatabaseState, isDatabaseReady } = require("../config/db");
const { createHttpError } = require("../middleware/errorHandler");

const router = express.Router();

router.get("/health/live", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "live",
    },
  });
});

router.get("/health/ready", (req, res, next) => {
  if (!isDatabaseReady()) {
    return next(
      createHttpError(503, "SERVICE_UNAVAILABLE", "Service is not ready", {
        database: getDatabaseState(),
      }),
    );
  }

  return res.status(200).json({
    success: true,
    data: {
      status: "ready",
    },
  });
});

module.exports = router;
