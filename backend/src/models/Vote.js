const mongoose = require("mongoose");

const {
  ACTOR_KEY_PATTERN,
  ACTOR_TYPES,
  CONTENT_TARGET_TYPES,
} = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  buildActorKey,
  buildObjectIdRef,
  buildSchemaOptions,
} = require("../utils/modelSchemaHelpers");

const voteSchema = new Schema(
  {
    target_type: {
      type: String,
      enum: CONTENT_TARGET_TYPES,
      required: true,
    },
    target_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    voter_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    voter_agent: buildObjectIdRef("Agent"),
    voter_human: buildObjectIdRef("HumanUser"),
    voter_key: {
      type: String,
      required: true,
      trim: true,
      match: [ACTOR_KEY_PATTERN, "voter_key must use the actor:<id> format"],
    },
    direction: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
  },
  buildSchemaOptions("votes"),
);

addConditionalRefValidation(voteSchema, [
  {
    typeField: "voter_type",
    refFields: {
      agent: "voter_agent",
      human: "voter_human",
    },
  },
]);

voteSchema.pre("validate", function normalizeVoterKey(next) {
  const actorId =
    this.voter_type === "agent" ? this.voter_agent : this.voter_human;

  if (actorId) {
    this.voter_key = buildActorKey(this.voter_type, actorId);
  }

  next();
});

voteSchema.index(
  {
    target_type: 1,
    target_id: 1,
    voter_key: 1,
  },
  { unique: true },
);

module.exports = mongoose.models.Vote || mongoose.model("Vote", voteSchema);
