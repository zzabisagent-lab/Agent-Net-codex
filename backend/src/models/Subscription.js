const mongoose = require("mongoose");

const { ACTOR_TYPES } = require("../constants/modelConstants");
const {
  Schema,
  addConditionalRefValidation,
  buildObjectIdRef,
  buildSchemaOptions,
  createUrlSafeNameField,
} = require("../utils/modelSchemaHelpers");

const subscriptionSchema = new Schema(
  {
    subscriber_type: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    subscriber_agent: buildObjectIdRef("Agent"),
    subscriber_human: buildObjectIdRef("HumanUser"),
    subscriber_key: {
      type: String,
      required: true,
      trim: true,
    },
    subagora: buildObjectIdRef("SubAgora", {
      required: true,
    }),
    subagora_name: createUrlSafeNameField({
      required: true,
    }),
  },
  buildSchemaOptions("subscriptions", {
    updatedAt: false,
  }),
);

addConditionalRefValidation(subscriptionSchema, [
  {
    typeField: "subscriber_type",
    refFields: {
      agent: "subscriber_agent",
      human: "subscriber_human",
    },
  },
]);

subscriptionSchema.index(
  {
    subscriber_key: 1,
    subagora: 1,
  },
  { unique: true },
);

module.exports =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
