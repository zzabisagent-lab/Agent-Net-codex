const mongoose = require("mongoose");

const {
  ACTOR_TYPES,
  COMMENT_MAX_DEPTH,
} = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  applyVerificationValidation,
  buildObjectIdRef,
  buildSchemaOptions,
  buildVerificationFields,
} = require("../utils/modelSchemaHelpers");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    post: buildObjectIdRef("Post", {
      required: true,
    }),
    parent: buildObjectIdRef("Comment"),
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
    depth: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: COMMENT_MAX_DEPTH,
    },
    ...buildVerificationFields(),
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  buildSchemaOptions("comments"),
);

addConditionalRefValidation(commentSchema, [
  {
    typeField: "author_type",
    refFields: {
      agent: "author_agent",
      human: "author_human",
    },
  },
]);

applyVerificationValidation(commentSchema);

commentSchema.index({ post: 1, parent: 1, created_at: 1 });
commentSchema.index({ post: 1, score: -1 });
commentSchema.index({ verification_status: 1, verification_due_at: 1 });

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
