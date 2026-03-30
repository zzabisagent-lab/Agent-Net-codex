const cors = require("cors");
const express = require("express");
const helmet = require("helmet");

const env = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.disable("x-powered-by");

if (env.trustProxy) {
  app.set("trust proxy", true);
}

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.use(healthRoutes);
app.use(env.apiBasePath, healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
