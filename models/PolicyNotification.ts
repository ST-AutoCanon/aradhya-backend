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
 *
 * RECURRING:
 *   Send according to a recurring calendar
 *   schedule defined in PolicyNotificationConfig.
 *
 *   Examples:
 *
 *   WEEKLY:
 *     Every Monday
 *
 *   MONTHLY:
 *     Every 5th of the month
 *
 *   YEARLY:
 *     Every 1st January
 */
export type PolicyNotificationScheduleType =
  | "BEFORE_EXPIRY"
  | "ON_EXPIRY"
  | "AFTER_EXPIRY"
  | "LAST_N_DAYS"
  | "RECURRING";

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
 * notificationCycleId is part of the notification
 * identity.
 *
 * Whenever a policy expiry date is changed and
 * a NEW notificationCycleId is created, the
 * notification system starts a completely new
 * reminder lifecycle.
 *
 * This applies to BOTH:
 *
 *   - expiry-based notifications
 *   - recurring notifications
 *
 * Example:
 *
 * OLD CYCLE
 *   policyId = ABC
 *   cycle = 111
 *   recurring = Sep 5
 *
 * NEW CYCLE
 *   policyId = ABC
 *   cycle = 222
 *   recurring = Sep 5
 *
 * These are two different notifications because
 * the notificationCycleId is different.
 */
export interface IPolicyNotification extends Document {
  /**
   * ============================================
   * POLICY
   * ============================================
   */
  policyId: Types.ObjectId;

  /**
   * ============================================
   * NOTIFICATION CYCLE
   * ============================================
   *
   * One complete reminder lifecycle for a policy.
   *
   * IMPORTANT:
   *
   * If policy expiry is changed/renewed, the
   * policy service must create a NEW
   * notificationCycleId.
   */
  notificationCycleId: Types.ObjectId;

  /**
   * ============================================
   * REMINDER CONFIG
   * ============================================
   *
   * Admin-created reminder configuration.
   */
  reminderConfigId: Types.ObjectId;

  /**
   * ============================================
   * EXPIRY DATE SNAPSHOT
   * ============================================
   *
   * The policy expiry date at the time the
   * notification was generated.
   *
   * For expiry-based notifications:
   *   Used as part of the historical identity.
   *
   * For recurring notifications:
   *   Retained as a snapshot of the policy expiry
   *   at the time the recurring notification was
   *   generated.
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
   *
   * RECURRING:
   *   undefined
   */
  scheduleValue?: number;

  /**
   * ============================================
   * SCHEDULED DATE
   * ============================================
   *
   * Exact calendar date for this notification.
   *
   * Recurring example:
   *
   *   2026-09-05
   *   2026-10-05
   *   2026-11-05
   */
  scheduledDate: Date;

  /**
   * ============================================
   * SUBJECT
   * ============================================
   */
  subject: string;

  /**
   * ============================================
   * EMAIL
   * ============================================
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
       * NOTIFICATION CYCLE
       * ========================================
       *
       * IMPORTANT:
       *
       * This MUST be included in notification
       * uniqueness.
       *
       * When expiry changes:
       *
       *   OLD CYCLE -> old notifications
       *   NEW CYCLE -> new notifications
       *
       * Therefore old SENT notifications cannot
       * block the new cycle.
       */
      notificationCycleId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      /**
       * ========================================
       * REMINDER CONFIG
       * ========================================
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
          "RECURRING",
        ],
        required: true,
        index: true,
      },

      /**
       * ========================================
       * SCHEDULE VALUE
       * ========================================
       *
       * BEFORE_EXPIRY -> daysBeforeExpiry
       * AFTER_EXPIRY  -> daysAfterExpiry
       * LAST_N_DAYS   -> lastNDays
       *
       * ON_EXPIRY     -> undefined
       * RECURRING     -> undefined
       */
      scheduleValue: {
        type: Number,
        min: 1,
        required: false,
      },

      /**
       * ========================================
       * SCHEDULED DATE
       * ========================================
       *
       * For recurring notifications this is
       * the occurrence date.
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
 * EXPIRY-BASED NOTIFICATION UNIQUENESS
 * ============================================
 *
 * Applies to:
 *
 *   BEFORE_EXPIRY
 *   ON_EXPIRY
 *   AFTER_EXPIRY
 *   LAST_N_DAYS
 *
 * Identity:
 *
 *   policyId
 *   +
 *   notificationCycleId
 *   +
 *   reminderConfigId
 *   +
 *   expiryDate
 *   +
 *   scheduleType
 *   +
 *   scheduledDate
 *
 * A new expiry date creates a new cycle.
 *
 * Therefore:
 *
 * OLD:
 *   Policy A + Cycle 1 + Expiry X
 *
 * NEW:
 *   Policy A + Cycle 2 + Expiry Y
 *
 * are separate notification lifecycles.
 */
policyNotificationSchema.index(
  {
    policyId: 1,
    notificationCycleId: 1,
    reminderConfigId: 1,
    expiryDate: 1,
    scheduleType: 1,
    scheduledDate: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      scheduleType: {
        $ne: "RECURRING",
      },
    },
  }
);

/**
 * ============================================
 * RECURRING NOTIFICATION UNIQUENESS
 * ============================================
 *
 * Applies ONLY to RECURRING notifications.
 *
 * Identity:
 *
 *   policyId
 *   +
 *   notificationCycleId
 *   +
 *   reminderConfigId
 *   +
 *   scheduleType
 *   +
 *   scheduledDate
 *
 * IMPORTANT:
 *
 * expiryDate is intentionally NOT part of the
 * recurring identity.
 *
 * The notificationCycleId handles the policy
 * lifecycle.
 *
 * Example:
 *
 * Cycle A:
 *   Sep 5 -> SENT
 *
 * Expiry updated -> Cycle B:
 *   Sep 5 -> NEW notification
 *
 * Because Cycle A !== Cycle B.
 */
policyNotificationSchema.index(
  {
    policyId: 1,
    notificationCycleId: 1,
    reminderConfigId: 1,
    scheduleType: 1,
    scheduledDate: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      scheduleType: "RECURRING",
    },
  }
);

/**
 * ============================================
 * CRON QUERY INDEX
 * ============================================
 *
 * Helps find notifications by scheduled date
 * and email status.
 */
policyNotificationSchema.index({
  scheduledDate: 1,
  "email.status": 1,
});

/**
 * ============================================
 * POLICY HISTORY INDEX
 * ============================================
 */
policyNotificationSchema.index({
  policyId: 1,
  scheduledDate: 1,
});

/**
 * ============================================
 * POLICY + CYCLE INDEX
 * ============================================
 *
 * Useful when retrieving all notifications
 * belonging to a particular policy cycle.
 */
policyNotificationSchema.index({
  policyId: 1,
  notificationCycleId: 1,
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