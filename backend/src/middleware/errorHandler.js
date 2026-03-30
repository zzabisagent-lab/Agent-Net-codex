const DEFAULT_MESSAGES = {
  AUTH_UNAUTHORIZED: "Authentication is required",
  AUTH_FORBIDDEN: "You do not have permission to access this resource",
  BAD_REQUEST: "The request could not be processed",
  INTERNAL_ERROR: "An unexpected error occurred",
  RATE_LIMITED: "Too many requests were sent",
  RESOURCE_NOT_FOUND: "Requested resource was not found",
  SERVICE_UNAVAILABLE: "Service is temporarily unavailable",
};

const STATUS_TO_ERROR_CODE = {
  400: "BAD_REQUEST",
  401: "AUTH_UNAUTHORIZED",
  403: "AUTH_FORBIDDEN",
  404: "RESOURCE_NOT_FOUND",
  409: "CONFLICT",
  429: "RATE_LIMITED",
  503: "SERVICE_UNAVAILABLE",
};

class AppError extends Error {
  constructor(statusCode, errorCode, errorMessage, details = {}) {
    super(errorMessage);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.details = details;
  }
}

function createHttpError(statusCode, errorCode, errorMessage, details = {}) {
  return new AppError(statusCode, errorCode, errorMessage, details);
}

function notFoundHandler(req, res, next) {
  next(
    createHttpError(
      404,
      "RESOURCE_NOT_FOUND",
      "Requested resource was not found",
    ),
  );
}

function errorHandler(err, req, res, next) {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const errorCode =
    err.errorCode || STATUS_TO_ERROR_CODE[statusCode] || "INTERNAL_ERROR";
  const errorMessage =
    err instanceof AppError
      ? err.errorMessage
      : DEFAULT_MESSAGES[errorCode] || DEFAULT_MESSAGES.INTERNAL_ERROR;
  const details =
    err.details && typeof err.details === "object" ? err.details : {};

  if (statusCode >= 500) {
    console.error("[error] Unhandled server error", err);
  }

  res.status(statusCode).json({
    success: false,
    error_code: errorCode,
    error_message: errorMessage,
    details,
  });
}

module.exports = {
  AppError,
  createHttpError,
  errorHandler,
  notFoundHandler,
};
