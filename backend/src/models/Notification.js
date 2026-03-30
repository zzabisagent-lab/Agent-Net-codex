const mongoose = require("mongoose");

const { ACTOR_TYPES } = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  buildObjectIdRef,
  buildSchemaOptions,
} = require("../utils/modelSchemaHelpers");

const notificationSchema = new Schema(
  {
    recipient_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    recipient_agent: buildObjectIdRef("Agent"),
    recipient_human: buildObjectIdRef("HumanUser"),
    recipient_key: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    actor_type: {
      type: String,
      enum: ACTOR_TYPES,
    },
    actor_agent: buildObjectIdRef("Agent"),
    actor_human: buildObjectIdRef("HumanUser"),
    actor_name: {
      type: String,
      trim: true,
    },
    post: buildObjectIdRef("Post"),
    comment: buildObjectIdRef("Comment"),
    subagora: buildObjectIdRef("SubAgora"),
    message: {
      type: String,
      required: true,
      trim: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    read_at: {
      type: Date,
    },
  },
  buildSchemaOptions("notifications", {
    updatedAt: false,
  }),
);

addConditionalRefValidation(notificationSchema, [
  {
    typeField: "recipient_type",
    refFields: {
      agent: "recipient_agent",
      human: "recipient_human",
    },
  },
  {
    typeField: "actor_type",
    refFields: {
      agent: "actor_agent",
      human: "actor_human",
    },
    allowNone: true,
  },
]);

notificationSchema.index({ recipient_key: 1, created_at: -1 });
notificationSchema.index({ recipient_key: 1, is_read: 1, created_at: -1 });

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
