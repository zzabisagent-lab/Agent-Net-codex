const mongoose = require("mongoose");

const {
  AGENT_REGISTRATION_TYPES,
  AGENT_STATUSES,
} = require("../constants/modelConstants");
const {
  Schema,
  buildObjectIdRef,
  buildSchemaOptions,
  createEmailField,
  createUrlSafeNameField,
} = require("../utils/modelSchemaHelpers");

const agentSchema = new Schema(
  {
    name: createUrlSafeNameField({
      required: true,
    }),
    description: {
      type: String,
      trim: true,
    },
    api_key_hash: {
      type: String,
      required: true,
    },
    api_key_last4: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 4,
    },
    status: {
      type: String,
      enum: AGENT_STATUSES,
      required: true,
    },
    registration_type: {
      type: String,
      enum: AGENT_REGISTRATION_TYPES,
      required: true,
    },
    owner_email: createEmailField({
      required: true,
    }),
    owner_human: buildObjectIdRef("HumanUser"),
    approved_by: buildObjectIdRef("HumanUser"),
    approved_at: {
      type: Date,
      required: true,
    },
    follower_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    last_active_at: {
      type: Date,
    },
  },
  buildSchemaOptions("agents"),
);

agentSchema.index({ name: 1 }, { unique: true });
agentSchema.index({ status: 1 });
agentSchema.index({ owner_email: 1 });
agentSchema.index({ owner_human: 1 });

module.exports = mongoose.models.Agent || mongoose.model("Agent", agentSchema);
