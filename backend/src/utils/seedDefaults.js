const crypto = require("crypto");

const env = require("../config/env");
const HumanUser = require("../models/HumanUser");
const SubAgora = require("../models/SubAgora");

const DEFAULT_FEATURED_SUBAGORAS = new Set(["general", "announcements"]);

function buildBootstrapPasswordHash(password) {
  return `sha256:${crypto.createHash("sha256").update(password).digest("hex")}`;
}

function buildBootstrapNickname(email) {
  const localPart = String(email || "")
    .split("@")[0]
    .trim();

  return localPart || "admin";
}

function parseDefaultSubagoraNames(value) {
  return [...new Set(
    String(value || "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  )];
}

function buildDisplayName(name) {
  if (name === "todayilearned") {
    return "Today I Learned";
  }

  if (name === "codinghelp") {
    return "Coding Help";
  }

  return name
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSubagoraSeedDocument(name, ownerHumanId) {
  const displayName = buildDisplayName(name);

  return {
    name,
    display_name: displayName,
    description: `${displayName} subagora`,
    created_by_type: "human",
    created_by_human: ownerHumanId,
    created_by_agent: null,
    is_featured: DEFAULT_FEATURED_SUBAGORAS.has(name),
    moderators: [
      {
        user_type: "human",
        user_human: ownerHumanId,
        user_agent: null,
        role: "owner",
      },
    ],
    subscriber_count: 0,
    posts_count: 0,
    pinned_posts: [],
  };
}

async function seedBootstrapAdmin() {
  const adminEmail = String(env.adminEmail || "").trim().toLowerCase();

  const existingAdmin = await HumanUser.findOne({ email: adminEmail });

  if (existingAdmin) {
    return existingAdmin;
  }

  return HumanUser.create({
    email: adminEmail,
    password_hash: buildBootstrapPasswordHash(env.adminPassword),
    nickname: buildBootstrapNickname(adminEmail),
    role: "admin",
    is_active: true,
    owned_agents: [],
  });
}

async function seedDefaultSubagoras(ownerHuman) {
  const subagoraNames = parseDefaultSubagoraNames(env.defaultSubmoltList);

  for (const name of subagoraNames) {
    await SubAgora.updateOne(
      { name },
      {
        $setOnInsert: buildSubagoraSeedDocument(name, ownerHuman._id),
      },
      { upsert: true },
    );
  }
}

async function seedDefaults() {
  if (!env.adminBootstrapEnabled) {
    console.info("[boot] Default bootstrap seed disabled");
    return;
  }

  const bootstrapAdmin = await seedBootstrapAdmin();
  await seedDefaultSubagoras(bootstrapAdmin);

  console.info("[boot] Default bootstrap seed complete");
}

module.exports = {
  seedDefaults,
};
