const mongoose = require("mongoose");

const { HUMAN_ROLES } = require("../constants/modelConstants");
const {
  Schema,
  buildSchemaOptions,
  createEmailField,
} = require("../utils/modelSchemaHelpers");

const humanUserSchema = new Schema(
  {
    email: createEmailField({
      required: true,
    }),
    password_hash: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: HUMAN_ROLES,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    owned_agents: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Agent",
        },
      ],
      default: [],
    },
    last_login_at: {
      type: Date,
    },
  },
  buildSchemaOptions("human_users"),
);

humanUserSchema.index({ email: 1 }, { unique: true });
humanUserSchema.index({ nickname: 1 }, { unique: true });
humanUserSchema.index({ role: 1 });
humanUserSchema.index({ is_active: 1 });

module.exports =
  mongoose.models.HumanUser || mongoose.model("HumanUser", humanUserSchema);
