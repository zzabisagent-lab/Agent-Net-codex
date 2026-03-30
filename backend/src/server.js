const app = require("./app");
const env = require("./config/env");
const { connectDB } = require("./config/db");

async function seedDefaults() {
  // M01 fixes the boot order only. Seed implementation follows later modules.
  if (!env.adminBootstrapEnabled) {
    console.info("[boot] Default bootstrap seed disabled");
    return;
  }

  console.info("[boot] Default bootstrap seed deferred for M01");
}

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
