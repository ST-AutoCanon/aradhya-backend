
import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export type PolicyNotificationType =
  | "7_DAY_REMINDER"
  | "1_DAY_REMINDER"
  | "EXPIRED";

export type PolicyNotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED";

/**
 * Email notification details.
 */
export interface IPolicyNotificationEmail {
  recipient: string;

  status: PolicyNotificationStatus;

  sentAt?: Date;

  attempts: number;

  lastAttemptAt?: Date;

  errorMessage?: string;
}

export interface IPolicyNotification
  extends Document {
  policyId: Types.ObjectId;

  notificationType: PolicyNotificationType;

  subject: string;

  /**
   * Email notification only.
   */
  email?: IPolicyNotificationEmail;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * ================================
 * EMAIL CHANNEL SCHEMA
 * ================================
 */
const emailSchema =
  new Schema<IPolicyNotificationEmail>(
    {
      recipient: {
        type: String,
        required: true,
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "SENT",
          "FAILED",
        ],
        default: "PENDING",
        index: true,
      },

      sentAt: {
        type: Date,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      lastAttemptAt: {
        type: Date,
      },

      errorMessage: {
        type: String,
      },
    },
    {
      _id: false,
    }
  );

/**
 * ================================
 * POLICY NOTIFICATION SCHEMA
 * ================================
 */
const policyNotificationSchema =
  new Schema<IPolicyNotification>(
    {
      policyId: {
        type: Schema.Types.ObjectId,
        ref: "Policy",
        required: true,
        index: true,
      },

      notificationType: {
        type: String,
        enum: [
          "7_DAY_REMINDER",
          "1_DAY_REMINDER",
          "EXPIRED",
        ],
        required: true,
        index: true,
      },

      subject: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * ================================
       * EMAIL ONLY
       * ================================
       */
      email: {
        type: emailSchema,
        required: false,
      },
    },
    {
      timestamps: true,
    }
  );

/**
 * Prevent duplicate notification records
 * for the same policy + notification type.
 *
 * Example:
 *
 * Policy ABC123
 * ├── 7_DAY_REMINDER
 * ├── 1_DAY_REMINDER
 * └── EXPIRED
 *
 * Each notification type can exist only once
 * for a particular policy.
 */
policyNotificationSchema.index(
  {
    policyId: 1,
    notificationType: 1,
  },
  {
    unique: true,
  }
);

const PolicyNotification =
  mongoose.model<IPolicyNotification>(
    "PolicyNotification",
    policyNotificationSchema
  );

export default PolicyNotification;
