const mongoose = require("mongoose");

const {
  Schema,
  buildObjectIdRef,
  buildSchemaOptions,
} = require("../utils/modelSchemaHelpers");

const adminAuditLogSchema = new Schema(
  {
    actor_human: buildObjectIdRef("HumanUser", {
      required: true,
    }),
    action: {
      type: String,
      required: true,
      trim: true,
    },
    target_type: {
      type: String,
      required: true,
      trim: true,
    },
    target_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    before_json: {
      type: Schema.Types.Mixed,
    },
    after_json: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ip_address: {
      type: String,
      trim: true,
    },
    user_agent: {
      type: String,
      trim: true,
    },
  },
  buildSchemaOptions("admin_audit_logs", {
    updatedAt: false,
  }),
);

module.exports =
  mongoose.models.AdminAuditLog ||
  mongoose.model("AdminAuditLog", adminAuditLogSchema);
