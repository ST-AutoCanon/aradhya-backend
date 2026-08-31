
import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

/**
 * ============================================
 * NOTIFICATION SCHEDULE TYPE
 * ============================================
 *
 * BEFORE_EXPIRY:
 *   Send once on a specific number of days
 *   before expiry.
 *
 * ON_EXPIRY:
 *   Send on the expiry date.
 *
 * AFTER_EXPIRY:
 *   Send after the policy has expired.
 *
 * LAST_N_DAYS:
 *   Send every day during the last N days
 *   before expiry.
 */
export type PolicyNotificationScheduleType =
  | "BEFORE_EXPIRY"
  | "ON_EXPIRY"
  | "AFTER_EXPIRY"
  | "LAST_N_DAYS";

/**
 * ============================================
 * EMAIL NOTIFICATION STATUS
 * ============================================
 */
export type PolicyNotificationStatus =
  | "PENDING"
  | "PROCESSING"
  | "SENT"
  | "FAILED"
  | "CANCELLED";

/**
 * ============================================
 * EMAIL NOTIFICATION DETAILS
 * ============================================
 */
export interface IPolicyNotificationEmail {
  /**
   * Email address to which the notification
   * was/will be sent.
   */
  recipient: string;

  /**
   * Current delivery status.
   */
  status: PolicyNotificationStatus;

  /**
   * Number of times email sending was attempted.
   */
  attempts: number;

  /**
   * Time at which email was successfully sent.
   */
  sentAt?: Date;

  /**
   * Time of the most recent sending attempt.
   */
  lastAttemptAt?: Date;

  /**
   * Error from the most recent failed attempt.
   */
  errorMessage?: string;

  /**
   * Nodemailer/provider message ID.
   *
   * Useful for debugging when an email is marked
   * SENT but the recipient says they did not receive it.
   */
  messageId?: string;
}

/**
 * ============================================
 * POLICY NOTIFICATION
 * ============================================
 *
 * This collection stores an ACTUAL notification
 * generated from a reminder configuration.
 *
 * IMPORTANT:
 *
 * expiryDate is stored as a snapshot.
 *
 * This means if the policy expiry date changes
 * later, old notification records remain
 * associated with the expiry date for which
 * they were originally generated.
 *
 * Example:
 *
 * Policy expiry:
 *   2026-09-04
 *
 * Reminder:
 *   LAST_N_DAYS = 8
 *
 * Notification:
 *
 *   expiryDate:    2026-09-04
 *   scheduledDate: 2026-08-29
 *   scheduleType:  LAST_N_DAYS
 *   scheduleValue: 8
 */
export interface IPolicyNotification
  extends Document {
  /**
   * Policy to which this notification belongs.
   */
  policyId: Types.ObjectId;

  /**
   * Admin-created reminder configuration.
   */
  reminderConfigId: Types.ObjectId;

  /**
   * ============================================
   * EXPIRY DATE SNAPSHOT
   * ============================================
   *
   * The policy expiry date when this notification
   * was generated.
   *
   * This is important when the policy endDate
   * changes later.
   */
  expiryDate: Date;

  /**
   * ============================================
   * SCHEDULE TYPE
   * ============================================
   */
  scheduleType: PolicyNotificationScheduleType;

  /**
   * ============================================
   * SCHEDULE VALUE
   * ============================================
   *
   * BEFORE_EXPIRY:
   *   daysBeforeExpiry
   *
   * AFTER_EXPIRY:
   *   daysAfterExpiry
   *
   * LAST_N_DAYS:
   *   lastNDays
   *
   * ON_EXPIRY:
   *   undefined
   */
  scheduleValue?: number;

  /**
   * ============================================
   * SCHEDULED DATE
   * ============================================
   *
   * The exact calendar date on which this
   * notification should be processed.
   *
   * Example:
   *
   * LAST_N_DAYS = 3
   *
   * 2026-08-28
   * 2026-08-29
   * 2026-08-30
   */
  scheduledDate: Date;

  /**
   * Email subject.
   */
  subject: string;

  /**
   * Email delivery information.
   */
  email: IPolicyNotificationEmail;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * ============================================
 * EMAIL CHANNEL SCHEMA
 * ============================================
 */
const emailSchema =
  new Schema<IPolicyNotificationEmail>(
    {
      /**
       * ========================================
       * RECIPIENT
       * ========================================
       */
      recipient: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * ========================================
       * STATUS
       * ========================================
       */
      status: {
        type: String,
        enum: [
          "PENDING",
          "PROCESSING",
          "SENT",
          "FAILED",
          "CANCELLED",
        ],
        default: "PENDING",
        index: true,
      },

      /**
       * ========================================
       * ATTEMPTS
       * ========================================
       */
      attempts: {
        type: Number,
        default: 0,
        min: 0,
      },

      /**
       * ========================================
       * SENT AT
       * ========================================
       */
      sentAt: {
        type: Date,
      },

      /**
       * ========================================
       * LAST ATTEMPT AT
       * ========================================
       */
      lastAttemptAt: {
        type: Date,
      },

      /**
       * ========================================
       * ERROR MESSAGE
       * ========================================
       */
      errorMessage: {
        type: String,
      },

      /**
       * ========================================
       * EMAIL PROVIDER MESSAGE ID
       * ========================================
       *
       * Nodemailer returns this after sendMail().
       *
       * Useful for debugging delivery.
       */
      messageId: {
        type: String,
      },
    },
    {
      _id: false,
    }
  );

/**
 * ============================================
 * POLICY NOTIFICATION SCHEMA
 * ============================================
 */
const policyNotificationSchema =
  new Schema<IPolicyNotification>(
    {
      /**
       * ========================================
       * POLICY
       * ========================================
       */
      policyId: {
        type: Schema.Types.ObjectId,
        ref: "Policy",
        required: true,
        index: true,
      },

      /**
       * ========================================
       * REMINDER CONFIG
       * ========================================
       *
       * Reference to the admin-created
       * reminder configuration.
       */
      reminderConfigId: {
        type: Schema.Types.ObjectId,
        ref: "PolicyNotificationConfig",
        required: true,
        index: true,
      },

      /**
       * ========================================
       * EXPIRY DATE SNAPSHOT
       * ========================================
       *
       * IMPORTANT:
       *
       * Do not use policy.endDate directly
       * when checking old notifications.
       *
       * This stores the expiry date that was
       * used when this notification was created.
       */
      expiryDate: {
        type: Date,
        required: true,
        index: true,
      },

      /**
       * ========================================
       * SCHEDULE TYPE
       * ========================================
       */
      scheduleType: {
        type: String,
        enum: [
          "BEFORE_EXPIRY",
          "ON_EXPIRY",
          "AFTER_EXPIRY",
          "LAST_N_DAYS",
        ],
        required: true,
        index: true,
      },

      /**
       * ========================================
       * SCHEDULE VALUE
       * ========================================
       *
       * Example:
       *
       * BEFORE_EXPIRY -> 5
       * AFTER_EXPIRY  -> 1
       * LAST_N_DAYS   -> 8
       *
       * ON_EXPIRY -> undefined
       */
      scheduleValue: {
        type: Number,
        min: 1,
      },

      /**
       * ========================================
       * SCHEDULED DATE
       * ========================================
       */
      scheduledDate: {
        type: Date,
        required: true,
        index: true,
      },

      /**
       * ========================================
       * SUBJECT
       * ========================================
       */
      subject: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * ========================================
       * EMAIL
       * ========================================
       */
      email: {
        type: emailSchema,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

/**
 * ============================================
 * PREVENT DUPLICATE NOTIFICATIONS
 * ============================================
 *
 * A notification is considered unique by:
 *
 *   policy
 *   +
 *   reminder configuration
 *   +
 *   expiry date
 *   +
 *   scheduled date
 *
 * This is important because the policy expiry
 * date can change.
 *
 * Example:
 *
 * OLD:
 *
 * policyId       = ABC
 * configId       = XYZ
 * expiryDate     = 2026-09-04
 * scheduledDate  = 2026-08-29
 *
 * NEW:
 *
 * policyId       = ABC
 * configId       = XYZ
 * expiryDate     = 2026-09-10
 * scheduledDate  = 2026-08-29
 *
 * These are TWO different notification schedules.
 */
policyNotificationSchema.index(
  {
    policyId: 1,
    reminderConfigId: 1,
    expiryDate: 1,
    scheduledDate: 1,
  },
  {
    unique: true,
  }
);

/**
 * ============================================
 * CRON QUERY INDEX
 * ============================================
 *
 * Useful for finding notifications that need
 * to be processed.
 */
policyNotificationSchema.index({
  scheduledDate: 1,
  "email.status": 1,
});

/**
 * ============================================
 * POLICY HISTORY INDEX
 * ============================================
 *
 * Useful for finding all notifications for
 * a particular policy.
 */
policyNotificationSchema.index({
  policyId: 1,
  scheduledDate: 1,
});

/**
 * ============================================
 * MODEL
 * ============================================
 */
const PolicyNotification =
  mongoose.model<IPolicyNotification>(
    "PolicyNotification",
    policyNotificationSchema
  );

export default PolicyNotification;

