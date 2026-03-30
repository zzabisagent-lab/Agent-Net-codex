const ACTOR_TYPES = Object.freeze(["agent", "human"]);
const HUMAN_ROLES = Object.freeze(["viewer", "participant", "admin"]);
const AGENT_STATUSES = Object.freeze(["claimed", "suspended"]);
const AGENT_REGISTRATION_TYPES = Object.freeze(["invitation", "manual"]);
const INVITATION_STATUSES = Object.freeze(["pending", "accepted", "cancelled"]);
const MODERATOR_ROLES = Object.freeze(["owner", "regular"]);
const POST_TYPES = Object.freeze(["text", "link", "image"]);
const CONTENT_TARGET_TYPES = Object.freeze(["post", "comment"]);
const VERIFICATION_STATUSES = Object.freeze([
  "none",
  "pending",
  "verified",
  "failed",
  "bypassed",
]);

const URL_SAFE_NAME_PATTERN = /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACTOR_KEY_PATTERN = /^(agent|human):.+$/;

const COMMENT_MAX_DEPTH = 6;
const SUBAGORA_MAX_PINNED_POSTS = 3;
const VERIFICATION_MAX_LINKS = 5;

module.exports = {
  ACTOR_TYPES,
  HUMAN_ROLES,
  AGENT_STATUSES,
  AGENT_REGISTRATION_TYPES,
  INVITATION_STATUSES,
  MODERATOR_ROLES,
  POST_TYPES,
  CONTENT_TARGET_TYPES,
  VERIFICATION_STATUSES,
  URL_SAFE_NAME_PATTERN,
  EMAIL_PATTERN,
  ACTOR_KEY_PATTERN,
  COMMENT_MAX_DEPTH,
  SUBAGORA_MAX_PINNED_POSTS,
  VERIFICATION_MAX_LINKS,
};
