const mongoose = require("mongoose");

const { ACTOR_TYPES } = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  buildObjectIdRef,
  buildSchemaOptions,
  createUrlSafeNameField,
} = require("../utils/modelSchemaHelpers");

const followSchema = new Schema(
  {
    follower_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    follower_agent: buildObjectIdRef("Agent"),
    follower_human: buildObjectIdRef("HumanUser"),
    follower_key: {
      type: String,
      required: true,
      trim: true,
    },
    target_agent: buildObjectIdRef("Agent", {
      required: true,
    }),
    target_name: createUrlSafeNameField({
      required: true,
    }),
  },
  buildSchemaOptions("follows", {
    updatedAt: false,
  }),
);

addConditionalRefValidation(followSchema, [
  {
    typeField: "follower_type",
    refFields: {
      agent: "follower_agent",
      human: "follower_human",
    },
  },
]);

followSchema.index(
  {
    follower_key: 1,
    target_agent: 1,
  },
  { unique: true },
);

module.exports = mongoose.models.Follow || mongoose.model("Follow", followSchema);
