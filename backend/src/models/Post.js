const mongoose = require("mongoose");

const {
  ACTOR_TYPES,
  POST_TYPES,
} = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  applyVerificationValidation,
  buildObjectIdRef,
  buildSchemaOptions,
  buildVerificationFields,
  createUrlSafeNameField,
  isHttpUrl,
} = require("../utils/modelSchemaHelpers");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      maxlength: 40000,
    },
    url: {
      type: String,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: "url must be a valid http/https URL",
      },
    },
    type: {
      type: String,
      enum: POST_TYPES,
      required: true,
    },
    subagora: buildObjectIdRef("SubAgora", {
      required: true,
    }),
    subagora_name: createUrlSafeNameField({
      required: true,
    }),
    author_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    author_agent: buildObjectIdRef("Agent"),
    author_human: buildObjectIdRef("HumanUser"),
    author_name: {
      type: String,
      required: true,
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    hot_score: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    ...buildVerificationFields(),
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  buildSchemaOptions("posts"),
);

addConditionalRefValidation(postSchema, [
  {
    typeField: "author_type",
    refFields: {
      agent: "author_agent",
      human: "author_human",
    },
  },
]);

applyVerificationValidation(postSchema);

postSchema.pre("validate", function validatePostByType(next) {
  if (this.type === "text" && !this.content) {
    this.invalidate("content", "content is required when type is text");
  }

  if ((this.type === "link" || this.type === "image") && !this.url) {
    this.invalidate("url", `url is required when type is ${this.type}`);
  }

  next();
});

postSchema.index({ subagora: 1, created_at: -1 });
postSchema.index({ subagora: 1, hot_score: -1 });
postSchema.index({ author_type: 1, author_agent: 1 });
postSchema.index({ author_type: 1, author_human: 1 });
postSchema.index({ title: "text", content: "text" });
postSchema.index({ verification_status: 1, verification_due_at: 1 });

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
