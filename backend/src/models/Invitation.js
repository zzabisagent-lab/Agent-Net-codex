const mongoose = require("mongoose");

const {
  ACTOR_TYPES,
  HUMAN_ROLES,
  INVITATION_STATUSES,
} = require("../constants/modelConstants");
const {
  Schema,
  buildObjectIdRef,
  buildSchemaOptions,
  createEmailField,
  createUrlSafeNameField,
} = require("../utils/modelSchemaHelpers");

const invitationSchema = new Schema(
  {
    target_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    email: createEmailField({
      required: true,
    }),
    agent_name: createUrlSafeNameField(),
    human_role: {
      type: String,
      enum: HUMAN_ROLES,
    },
    token_hash: {
      type: String,
      required: true,
    },
    invited_by: buildObjectIdRef("HumanUser", {
      required: true,
    }),
    status: {
      type: String,
      enum: INVITATION_STATUSES,
      required: true,
      default: "pending",
    },
    expires_at: {
      type: Date,
      required: true,
    },
    accepted_at: {
      type: Date,
    },
    cancelled_at: {
      type: Date,
    },
    result_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    resend_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  buildSchemaOptions("invitations"),
);

invitationSchema.pre("validate", function validateInvitationTarget(next) {
  if (this.target_type === "agent") {
    if (!this.agent_name) {
      this.invalidate(
        "agent_name",
        "agent_name is required when target_type is agent",
      );
    }

    if (this.human_role) {
      this.invalidate(
        "human_role",
        "human_role must be null when target_type is agent",
      );
    }
  }

  if (this.target_type === "human") {
    if (!this.human_role) {
      this.invalidate(
        "human_role",
        "human_role is required when target_type is human",
      );
    }

    if (this.agent_name) {
      this.invalidate(
        "agent_name",
        "agent_name must be null when target_type is human",
      );
    }
  }

  if (this.status === "pending") {
    if (this.accepted_at) {
      this.invalidate(
        "accepted_at",
        "accepted_at must be null when status is pending",
      );
    }

    if (this.cancelled_at) {
      this.invalidate(
        "cancelled_at",
        "cancelled_at must be null when status is pending",
      );
    }
  }

  if (this.status === "accepted") {
    if (!this.accepted_at) {
      this.invalidate(
        "accepted_at",
        "accepted_at is required when status is accepted",
      );
    }

    if (this.cancelled_at) {
      this.invalidate(
        "cancelled_at",
        "cancelled_at must be null when status is accepted",
      );
    }
  }

  if (this.status === "cancelled") {
    if (!this.cancelled_at) {
      this.invalidate(
        "cancelled_at",
        "cancelled_at is required when status is cancelled",
      );
    }

    if (this.accepted_at) {
      this.invalidate(
        "accepted_at",
        "accepted_at must be null when status is cancelled",
      );
    }
  }

  next();
});

invitationSchema.pre("save", async function validateInvitationStatusTransition() {
  if (this.isNew || !this.isModified("status")) {
    return;
  }

  const existingInvitation = await this.constructor
    .findById(this._id)
    .select("status")
    .lean();

  if (!existingInvitation) {
    return;
  }

  if (
    (existingInvitation.status === "accepted" ||
      existingInvitation.status === "cancelled") &&
    existingInvitation.status !== this.status
  ) {
    this.invalidate(
      "status",
      `${existingInvitation.status} invitations cannot transition to another status`,
    );

    throw new mongoose.Error.ValidationError(this);
  }
});

invitationSchema.index({ token_hash: 1 }, { unique: true });
invitationSchema.index({ email: 1 });
invitationSchema.index({ status: 1 });
invitationSchema.index({ target_type: 1 });
invitationSchema.index({ expires_at: 1 });

module.exports =
  mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema);
