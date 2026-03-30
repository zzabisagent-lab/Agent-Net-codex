const mongoose = require("mongoose");

const {
  ACTOR_TYPES,
  MODERATOR_ROLES,
  SUBAGORA_MAX_PINNED_POSTS,
} = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  buildObjectIdRef,
  buildSchemaOptions,
  createUrlSafeNameField,
} = require("../utils/modelSchemaHelpers");

const moderatorEntrySchema = new Schema(
  {
    user_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    user_agent: buildObjectIdRef("Agent"),
    user_human: buildObjectIdRef("HumanUser"),
    role: {
      type: String,
      enum: MODERATOR_ROLES,
      required: true,
    },
    added_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

addConditionalRefValidation(moderatorEntrySchema, [
  {
    typeField: "user_type",
    refFields: {
      agent: "user_agent",
      human: "user_human",
    },
  },
]);

const subAgoraSchema = new Schema(
  {
    name: createUrlSafeNameField({
      required: true,
    }),
    display_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    created_by_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    created_by_agent: buildObjectIdRef("Agent"),
    created_by_human: buildObjectIdRef("HumanUser"),
    banner_color: {
      type: String,
      trim: true,
    },
    theme_color: {
      type: String,
      trim: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    moderators: {
      type: [moderatorEntrySchema],
      required: true,
      validate: {
        validator(entries) {
          return Array.isArray(entries) && entries.length > 0;
        },
        message: "moderators must contain at least one entry",
      },
    },
    subscriber_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    posts_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    pinned_posts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
      validate: {
        validator(postIds) {
          return Array.isArray(postIds) && postIds.length <= SUBAGORA_MAX_PINNED_POSTS;
        },
        message: `pinned_posts cannot exceed ${SUBAGORA_MAX_PINNED_POSTS} items`,
      },
    },
  },
  buildSchemaOptions("subagoras"),
);

addConditionalRefValidation(subAgoraSchema, [
  {
    typeField: "created_by_type",
    refFields: {
      agent: "created_by_agent",
      human: "created_by_human",
    },
  },
]);

subAgoraSchema.index({ name: 1 }, { unique: true });
subAgoraSchema.index({ is_featured: 1 });
subAgoraSchema.index({ "moderators.user_human": 1 });
subAgoraSchema.index({ "moderators.user_agent": 1 });

module.exports =
  mongoose.models.SubAgora || mongoose.model("SubAgora", subAgoraSchema);
