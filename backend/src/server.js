const app = require("./app");
const env = require("./config/env");
const { connectDB } = require("./config/db");
const { seedDefaults } = require("./utils/seedDefaults");

async function startServer() {
  await connectDB();
  await seedDefaults();

  app.listen(env.port, () => {
    console.info(
      `[boot] Server listening on port ${env.port} with API base path ${env.apiBasePath}`,
    );
  });
}

startServer().catch((error) => {
  console.error("[boot] Failed to start server", error);
  process.exit(1);
});
