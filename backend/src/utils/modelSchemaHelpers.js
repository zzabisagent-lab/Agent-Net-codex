const mongoose = require("mongoose");

const {
  ACTOR_TYPES,
  EMAIL_PATTERN,
  URL_SAFE_NAME_PATTERN,
  VERIFICATION_MAX_LINKS,
  VERIFICATION_STATUSES,
} = require("../constants/modelConstants");

const { Schema } = mongoose;

function buildSchemaOptions(collectionName, options = {}) {
  const { updatedAt = true, ...rest } = options;

  return {
    collection: collectionName,
    timestamps: {
      createdAt: "created_at",
      updatedAt: updatedAt ? "updated_at" : false,
    },
    ...rest,
  };
}

function buildObjectIdRef(ref, options = {}) {
  return {
    type: Schema.Types.ObjectId,
    ref,
    default: null,
    ...options,
  };
}

function createUrlSafeNameField(options = {}) {
  return {
    type: String,
    trim: true,
    lowercase: true,
    match: [URL_SAFE_NAME_PATTERN, "must be URL-safe"],
    ...options,
  };
}

function createEmailField(options = {}) {
  return {
    type: String,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, "must be a valid email address"],
    ...options,
  };
}

function isHttpUrl(value) {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function buildActorKey(actorType, actorId) {
  if (!actorType || !actorId) {
    return null;
  }

  return `${actorType}:${String(actorId)}`;
}

function addConditionalRefValidation(schema, configs) {
  schema.pre("validate", function validateConditionalRefs(next) {
    configs.forEach((config) => {
      const error = getConditionalRefError(this, config);

      if (error) {
        this.invalidate(error.path, error.message);
      }
    });

    next();
  });
}

function getConditionalRefError(doc, config) {
  const { typeField, refFields, allowNone = false } = config;
  const typeValue = doc.get(typeField);
  const populatedRefEntries = Object.entries(refFields).filter(([, fieldName]) => {
    const value = doc.get(fieldName);
    return value !== undefined && value !== null;
  });

  if (!typeValue) {
    if (allowNone) {
      if (populatedRefEntries.length > 0) {
        return {
          path: typeField,
          message: `${typeField} must be set when its reference field is present`,
        };
      }

      return null;
    }

    return {
      path: typeField,
      message: `${typeField} is required`,
    };
  }

  const expectedField = refFields[typeValue];

  if (!expectedField) {
    return {
      path: typeField,
      message: `${typeField} is invalid`,
    };
  }

  if (!doc.get(expectedField)) {
    return {
      path: expectedField,
      message: `${expectedField} is required when ${typeField} is ${typeValue}`,
    };
  }

  const unexpectedField = Object.entries(refFields).find(
    ([candidateType, fieldName]) => candidateType !== typeValue && doc.get(fieldName),
  );

  if (unexpectedField) {
    return {
      path: unexpectedField[1],
      message: `${unexpectedField[1]} must be null when ${typeField} is ${typeValue}`,
    };
  }

  return null;
}

function buildVerificationFields() {
  return {
    verification_status: {
      type: String,
      enum: VERIFICATION_STATUSES,
      default: "none",
      required: true,
    },
    verification_required: {
      type: Boolean,
      default: false,
    },
    verification_prompt: {
      type: String,
      trim: true,
    },
    verification_requested_by: buildObjectIdRef("HumanUser"),
    verification_requested_at: {
      type: Date,
    },
    verification_due_at: {
      type: Date,
    },
    verification_submission_text: {
      type: String,
      trim: true,
    },
    verification_submission_links: {
      type: [
        {
          type: String,
          trim: true,
          validate: {
            validator: isHttpUrl,
            message: "verification_submission_links must contain valid http/https URLs",
          },
        },
      ],
      default: undefined,
      validate: {
        validator(links) {
          return !links || links.length <= VERIFICATION_MAX_LINKS;
        },
        message: `verification_submission_links cannot exceed ${VERIFICATION_MAX_LINKS} items`,
      },
    },
    verification_submitted_at: {
      type: Date,
    },
    verification_submitted_by_type: {
      type: String,
      enum: ACTOR_TYPES,
    },
    verification_submitted_by_agent: buildObjectIdRef("Agent"),
    verification_submitted_by_human: buildObjectIdRef("HumanUser"),
    verification_result_note: {
      type: String,
      trim: true,
    },
    verification_completed_at: {
      type: Date,
    },
  };
}

function applyVerificationValidation(schema) {
  addConditionalRefValidation(schema, [
    {
      typeField: "verification_submitted_by_type",
      refFields: {
        agent: "verification_submitted_by_agent",
        human: "verification_submitted_by_human",
      },
      allowNone: true,
    },
  ]);

  schema.pre("validate", function normalizeVerificationFields(next) {
    this.verification_required = this.verification_status === "pending";
    next();
  });
}

module.exports = {
  Schema,
  buildSchemaOptions,
  buildObjectIdRef,
  createUrlSafeNameField,
  createEmailField,
  isHttpUrl,
  buildActorKey,
  addConditionalRefValidation,
  buildVerificationFields,
  applyVerificationValidation,
};
