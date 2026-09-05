// import mongoose, {
//   Document,
//   Schema,
//   Types,
// } from "mongoose";

// /**
//  * ============================================
//  * NOTIFICATION SCHEDULE TYPE
//  * ============================================
//  *
//  * BEFORE_EXPIRY:
//  *   Send once on a specific number of days
//  *   before expiry.
//  *
//  * ON_EXPIRY:
//  *   Send on the expiry date.
//  *
//  * AFTER_EXPIRY:
//  *   Send after the policy has expired.
//  *
//  * LAST_N_DAYS:
//  *   Send every day during the last N days
//  *   before expiry.
//  */
// export type PolicyNotificationScheduleType =
//   | "BEFORE_EXPIRY"
//   | "ON_EXPIRY"
//   | "AFTER_EXPIRY"
//   | "LAST_N_DAYS";

// /**
//  * ============================================
//  * EMAIL NOTIFICATION STATUS
//  * ============================================
//  */
// export type PolicyNotificationStatus =
//   | "PENDING"
//   | "PROCESSING"
//   | "SENT"
//   | "FAILED"
//   | "CANCELLED";

// /**
//  * ============================================
//  * EMAIL NOTIFICATION DETAILS
//  * ============================================
//  */
// export interface IPolicyNotificationEmail {
//   /**
//    * Email address to which the notification
//    * was/will be sent.
//    */
//   recipient: string;

//   /**
//    * Current delivery status.
//    */
//   status: PolicyNotificationStatus;

//   /**
//    * Number of times email sending was attempted.
//    */
//   attempts: number;

//   /**
//    * Time at which email was successfully sent.
//    */
//   sentAt?: Date;

//   /**
//    * Time of the most recent sending attempt.
//    */
//   lastAttemptAt?: Date;

//   /**
//    * Error from the most recent failed attempt.
//    */
//   errorMessage?: string;

//   /**
//    * Nodemailer/provider message ID.
//    *
//    * Useful for debugging when an email is marked
//    * SENT but the recipient says they did not receive it.
//    */
//   messageId?: string;
// }

// /**
//  * ============================================
//  * POLICY NOTIFICATION
//  * ============================================
//  *
//  * This collection stores an ACTUAL notification
//  * generated from a reminder configuration.
//  *
//  * IMPORTANT:
//  *
//  * expiryDate is stored as a snapshot.
//  *
//  * notificationCycleId identifies one complete
//  * reminder lifecycle for a policy.
//  *
//  * Example:
//  *
//  * Policy updated:
//  *
//  * Cycle 1
//  *   - 7 days before -> SENT
//  *   - expiry        -> SENT
//  *
//  * Policy updated again:
//  *
//  * Cycle 2
//  *   - 7 days before -> PENDING
//  *   - expiry        -> PENDING
//  *
//  * The old Cycle 1 notifications remain as history.
//  * They do not block Cycle 2 notifications.
//  */
// export interface IPolicyNotification
//   extends Document {
//   /**
//    * ============================================
//    * POLICY
//    * ============================================
//    *
//    * Policy to which this notification belongs.
//    */
//   policyId: Types.ObjectId;

//   /**
//    * ============================================
//    * NOTIFICATION CYCLE
//    * ============================================
//    *
//    * Identifies one complete reminder lifecycle
//    * for the policy.
//    *
//    * A new policy update/renewal should create
//    * a new notificationCycleId.
//    *
//    * Example:
//    *
//    * Cycle 1:
//    * 66abc123...
//    *
//    * Cycle 2:
//    * 77def456...
//    */
//   notificationCycleId: Types.ObjectId;

//   /**
//    * ============================================
//    * REMINDER CONFIG
//    * ============================================
//    *
//    * Admin-created reminder configuration.
//    */
//   reminderConfigId: Types.ObjectId;

//   /**
//    * ============================================
//    * EXPIRY DATE SNAPSHOT
//    * ============================================
//    *
//    * The policy expiry date when this notification
//    * was generated.
//    *
//    * This is important when the policy endDate
//    * changes later.
//    */
//   expiryDate: Date;

//   /**
//    * ============================================
//    * SCHEDULE TYPE
//    * ============================================
//    */
//   scheduleType: PolicyNotificationScheduleType;

//   /**
//    * ============================================
//    * SCHEDULE VALUE
//    * ============================================
//    *
//    * BEFORE_EXPIRY:
//    *   daysBeforeExpiry
//    *
//    * AFTER_EXPIRY:
//    *   daysAfterExpiry
//    *
//    * LAST_N_DAYS:
//    *   lastNDays
//    *
//    * ON_EXPIRY:
//    *   undefined
//    */
//   scheduleValue?: number;

//   /**
//    * ============================================
//    * SCHEDULED DATE
//    * ============================================
//    *
//    * The exact calendar date on which this
//    * notification should be processed.
//    */
//   scheduledDate: Date;

//   /**
//    * ============================================
//    * SUBJECT
//    * ============================================
//    */
//   subject: string;

//   /**
//    * ============================================
//    * EMAIL
//    * ============================================
//    */
//   email: IPolicyNotificationEmail;

//   createdAt: Date;

//   updatedAt: Date;
// }

// /**
//  * ============================================
//  * EMAIL CHANNEL SCHEMA
//  * ============================================
//  */
// const emailSchema =
//   new Schema<IPolicyNotificationEmail>(
//     {
//       /**
//        * ========================================
//        * RECIPIENT
//        * ========================================
//        */
//       recipient: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       /**
//        * ========================================
//        * STATUS
//        * ========================================
//        */
//       status: {
//         type: String,
//         enum: [
//           "PENDING",
//           "PROCESSING",
//           "SENT",
//           "FAILED",
//           "CANCELLED",
//         ],
//         default: "PENDING",
//         index: true,
//       },

//       /**
//        * ========================================
//        * ATTEMPTS
//        * ========================================
//        */
//       attempts: {
//         type: Number,
//         default: 0,
//         min: 0,
//       },

//       /**
//        * ========================================
//        * SENT AT
//        * ========================================
//        */
//       sentAt: {
//         type: Date,
//       },

//       /**
//        * ========================================
//        * LAST ATTEMPT AT
//        * ========================================
//        */
//       lastAttemptAt: {
//         type: Date,
//       },

//       /**
//        * ========================================
//        * ERROR MESSAGE
//        * ========================================
//        */
//       errorMessage: {
//         type: String,
//       },

//       /**
//        * ========================================
//        * EMAIL PROVIDER MESSAGE ID
//        * ========================================
//        */
//       messageId: {
//         type: String,
//       },
//     },
//     {
//       _id: false,
//     }
//   );

// /**
//  * ============================================
//  * POLICY NOTIFICATION SCHEMA
//  * ============================================
//  */
// const policyNotificationSchema =
//   new Schema<IPolicyNotification>(
//     {
//       /**
//        * ========================================
//        * POLICY
//        * ========================================
//        */
//       policyId: {
//         type: Schema.Types.ObjectId,
//         ref: "Policy",
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * NOTIFICATION CYCLE
//        * ========================================
//        *
//        * IMPORTANT:
//        *
//        * Every new policy reminder lifecycle
//        * gets a new notificationCycleId.
//        *
//        * This prevents an old SENT notification
//        * from blocking a new policy update cycle.
//        */
//       notificationCycleId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * REMINDER CONFIG
//        * ========================================
//        *
//        * Reference to the admin-created
//        * reminder configuration.
//        */
//       reminderConfigId: {
//         type: Schema.Types.ObjectId,
//         ref: "PolicyNotificationConfig",
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * EXPIRY DATE SNAPSHOT
//        * ========================================
//        *
//        * IMPORTANT:
//        *
//        * Do not use policy.endDate directly
//        * when checking old notifications.
//        *
//        * This stores the expiry date that was
//        * used when this notification was created.
//        */
//       expiryDate: {
//         type: Date,
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * SCHEDULE TYPE
//        * ========================================
//        */
//       scheduleType: {
//         type: String,
//         enum: [
//           "BEFORE_EXPIRY",
//           "ON_EXPIRY",
//           "AFTER_EXPIRY",
//           "LAST_N_DAYS",
//         ],
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * SCHEDULE VALUE
//        * ========================================
//        *
//        * Example:
//        *
//        * BEFORE_EXPIRY -> 5
//        * AFTER_EXPIRY  -> 1
//        * LAST_N_DAYS   -> 8
//        *
//        * ON_EXPIRY -> undefined
//        */
//       scheduleValue: {
//         type: Number,
//         min: 1,
//         required: false,
//       },

//       /**
//        * ========================================
//        * SCHEDULED DATE
//        * ========================================
//        */
//       scheduledDate: {
//         type: Date,
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * SUBJECT
//        * ========================================
//        */
//       subject: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       /**
//        * ========================================
//        * EMAIL
//        * ========================================
//        */
//       email: {
//         type: emailSchema,
//         required: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// /**
//  * ============================================
//  * PREVENT DUPLICATE NOTIFICATIONS
//  * ============================================
//  *
//  * A notification is considered unique by:
//  *
//  *   policy
//  *   +
//  *   notification cycle
//  *   +
//  *   reminder configuration
//  *   +
//  *   expiry date
//  *   +
//  *   scheduled date
//  *
//  * This is the important change.
//  *
//  * OLD:
//  *
//  *   policyId
//  *   +
//  *   reminderConfigId
//  *   +
//  *   expiryDate
//  *   +
//  *   scheduledDate
//  *
//  * NEW:
//  *
//  *   policyId
//  *   +
//  *   notificationCycleId
//  *   +
//  *   reminderConfigId
//  *   +
//  *   expiryDate
//  *   +
//  *   scheduledDate
//  *
//  * Example:
//  *
//  * ============================================
//  * CYCLE 1
//  * ============================================
//  *
//  * policyId          = ABC
//  * cycleId           = CYCLE_1
//  * configId          = XYZ
//  * expiryDate        = 2026-09-04
//  * scheduledDate     = 2026-08-29
//  *
//  * status = SENT
//  *
//  *
//  * ============================================
//  * POLICY UPDATED
//  * ============================================
//  *
//  * New cycle:
//  *
//  * cycleId = CYCLE_2
//  *
//  *
//  * ============================================
//  * CYCLE 2
//  * ============================================
//  *
//  * policyId          = ABC
//  * cycleId           = CYCLE_2
//  * configId          = XYZ
//  * expiryDate        = 2026-09-10
//  * scheduledDate     = 2026-08-29
//  *
//  * status = PENDING
//  *
//  *
//  * These are TWO different notifications.
//  *
//  * The old SENT record remains untouched.
//  */
// policyNotificationSchema.index(
//   {
//     policyId: 1,
//     notificationCycleId: 1,
//     reminderConfigId: 1,
//     expiryDate: 1,
//     scheduledDate: 1,
//   },
//   {
//     unique: true,
//   }
// );

// /**
//  * ============================================
//  * CRON QUERY INDEX
//  * ============================================
//  *
//  * Useful for finding notifications that need
//  * to be processed.
//  */
// policyNotificationSchema.index({
//   scheduledDate: 1,
//   "email.status": 1,
// });

// /**
//  * ============================================
//  * POLICY HISTORY INDEX
//  * ============================================
//  *
//  * Useful for finding all notifications for
//  * a particular policy.
//  */
// policyNotificationSchema.index({
//   policyId: 1,
//   scheduledDate: 1,
// });

// /**
//  * ============================================
//  * POLICY + CYCLE INDEX
//  * ============================================
//  *
//  * Useful when retrieving all notifications
//  * belonging to one policy reminder cycle.
//  */
// policyNotificationSchema.index({
//   policyId: 1,
//   notificationCycleId: 1,
//   scheduledDate: 1,
// });

// /**
//  * ============================================
//  * MODEL
//  * ============================================
//  */
// const PolicyNotification =
//   mongoose.model<IPolicyNotification>(
//     "PolicyNotification",
//     policyNotificationSchema
//   );

// export default PolicyNotification;


////////////////


// import mongoose, {
//   Document,
//   Schema,
//   Types,
// } from "mongoose";

// /**
//  * ============================================
//  * NOTIFICATION SCHEDULE TYPE
//  * ============================================
//  *
//  * BEFORE_EXPIRY:
//  *   Send once on a specific number of days
//  *   before expiry.
//  *
//  * ON_EXPIRY:
//  *   Send on the expiry date.
//  *
//  * AFTER_EXPIRY:
//  *   Send after the policy has expired.
//  *
//  * LAST_N_DAYS:
//  *   Send every day during the last N days
//  *   before expiry.
//  *
//  * RECURRING:
//  *   Send according to a recurring calendar
//  *   schedule defined in PolicyNotificationConfig.
//  *
//  *   Examples:
//  *
//  *   WEEKLY:
//  *     Every Monday
//  *
//  *   MONTHLY:
//  *     Every 1st of the month
//  *
//  *   YEARLY:
//  *     Every 1st January
//  */
// export type PolicyNotificationScheduleType =
//   | "BEFORE_EXPIRY"
//   | "ON_EXPIRY"
//   | "AFTER_EXPIRY"
//   | "LAST_N_DAYS"
//   | "RECURRING";

// /**
//  * ============================================
//  * EMAIL NOTIFICATION STATUS
//  * ============================================
//  */
// export type PolicyNotificationStatus =
//   | "PENDING"
//   | "PROCESSING"
//   | "SENT"
//   | "FAILED"
//   | "CANCELLED";

// /**
//  * ============================================
//  * EMAIL NOTIFICATION DETAILS
//  * ============================================
//  */
// export interface IPolicyNotificationEmail {
//   /**
//    * Email address to which the notification
//    * was/will be sent.
//    */
//   recipient: string;

//   /**
//    * Current delivery status.
//    */
//   status: PolicyNotificationStatus;

//   /**
//    * Number of times email sending was attempted.
//    */
//   attempts: number;

//   /**
//    * Time at which email was successfully sent.
//    */
//   sentAt?: Date;

//   /**
//    * Time of the most recent sending attempt.
//    */
//   lastAttemptAt?: Date;

//   /**
//    * Error from the most recent failed attempt.
//    */
//   errorMessage?: string;

//   /**
//    * Nodemailer/provider message ID.
//    *
//    * Useful for debugging when an email is marked
//    * SENT but the recipient says they did not receive it.
//    */
//   messageId?: string;
// }

// /**
//  * ============================================
//  * POLICY NOTIFICATION
//  * ============================================
//  *
//  * This collection stores an ACTUAL notification
//  * generated from a reminder configuration.
//  *
//  * IMPORTANT:
//  *
//  * expiryDate is stored as a snapshot for
//  * expiry-related notifications.
//  *
//  * For RECURRING notifications, expiryDate is
//  * still retained as the policy expiry snapshot
//  * available at the time the notification was
//  * generated.
//  *
//  * notificationCycleId identifies one complete
//  * reminder lifecycle for a policy.
//  */
// export interface IPolicyNotification
//   extends Document {
//   /**
//    * ============================================
//    * POLICY
//    * ============================================
//    */
//   policyId: Types.ObjectId;

//   /**
//    * ============================================
//    * NOTIFICATION CYCLE
//    * ============================================
//    *
//    * Identifies one complete reminder lifecycle
//    * for the policy.
//    *
//    * A new policy update/renewal should create
//    * a new notificationCycleId.
//    */
//   notificationCycleId: Types.ObjectId;

//   /**
//    * ============================================
//    * REMINDER CONFIG
//    * ============================================
//    *
//    * Admin-created reminder configuration.
//    *
//    * For RECURRING notifications this points to
//    * the recurring configuration containing:
//    *
//    *   recurringFrequency
//    *   recurringDayOfWeek
//    *   recurringDayOfMonth
//    *   recurringMonth
//    */
//   reminderConfigId: Types.ObjectId;

//   /**
//    * ============================================
//    * EXPIRY DATE SNAPSHOT
//    * ============================================
//    *
//    * The policy expiry date when this notification
//    * was generated.
//    *
//    * For expiry-based schedules this is used to
//    * identify the expiry cycle.
//    *
//    * For RECURRING schedules this is retained as
//    * historical policy information.
//    */
//   expiryDate: Date;

//   /**
//    * ============================================
//    * SCHEDULE TYPE
//    * ============================================
//    */
//   scheduleType: PolicyNotificationScheduleType;

//   /**
//    * ============================================
//    * SCHEDULE VALUE
//    * ============================================
//    *
//    * BEFORE_EXPIRY:
//    *   daysBeforeExpiry
//    *
//    * AFTER_EXPIRY:
//    *   daysAfterExpiry
//    *
//    * LAST_N_DAYS:
//    *   lastNDays
//    *
//    * ON_EXPIRY:
//    *   undefined
//    *
//    * RECURRING:
//    *   undefined
//    *
//    * Recurring configuration is stored in
//    * PolicyNotificationConfig rather than here.
//    */
//   scheduleValue?: number;

//   /**
//    * ============================================
//    * SCHEDULED DATE
//    * ============================================
//    *
//    * The exact calendar date on which this
//    * notification should be processed.
//    *
//    * For recurring schedules, every occurrence
//    * gets its own scheduledDate.
//    *
//    * Example:
//    *
//    * Every Monday:
//    *
//    * 2026-09-07
//    * 2026-09-14
//    * 2026-09-21
//    * 2026-09-28
//    */
//   scheduledDate: Date;

//   /**
//    * ============================================
//    * SUBJECT
//    * ============================================
//    */
//   subject: string;

//   /**
//    * ============================================
//    * EMAIL
//    * ============================================
//    */
//   email: IPolicyNotificationEmail;

//   createdAt: Date;

//   updatedAt: Date;
// }

// /**
//  * ============================================
//  * EMAIL CHANNEL SCHEMA
//  * ============================================
//  */
// const emailSchema =
//   new Schema<IPolicyNotificationEmail>(
//     {
//       /**
//        * ========================================
//        * RECIPIENT
//        * ========================================
//        */
//       recipient: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       /**
//        * ========================================
//        * STATUS
//        * ========================================
//        */
//       status: {
//         type: String,
//         enum: [
//           "PENDING",
//           "PROCESSING",
//           "SENT",
//           "FAILED",
//           "CANCELLED",
//         ],
//         default: "PENDING",
//         index: true,
//       },

//       /**
//        * ========================================
//        * ATTEMPTS
//        * ========================================
//        */
//       attempts: {
//         type: Number,
//         default: 0,
//         min: 0,
//       },

//       /**
//        * ========================================
//        * SENT AT
//        * ========================================
//        */
//       sentAt: {
//         type: Date,
//       },

//       /**
//        * ========================================
//        * LAST ATTEMPT AT
//        * ========================================
//        */
//       lastAttemptAt: {
//         type: Date,
//       },

//       /**
//        * ========================================
//        * ERROR MESSAGE
//        * ========================================
//        */
//       errorMessage: {
//         type: String,
//       },

//       /**
//        * ========================================
//        * EMAIL PROVIDER MESSAGE ID
//        * ========================================
//        */
//       messageId: {
//         type: String,
//       },
//     },
//     {
//       _id: false,
//     }
//   );

// /**
//  * ============================================
//  * POLICY NOTIFICATION SCHEMA
//  * ============================================
//  */
// const policyNotificationSchema =
//   new Schema<IPolicyNotification>(
//     {
//       /**
//        * ========================================
//        * POLICY
//        * ========================================
//        */
//       policyId: {
//         type: Schema.Types.ObjectId,
//         ref: "Policy",
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * NOTIFICATION CYCLE
//        * ========================================
//        */
//       notificationCycleId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * REMINDER CONFIG
//        * ========================================
//        */
//       reminderConfigId: {
//         type: Schema.Types.ObjectId,
//         ref: "PolicyNotificationConfig",
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * EXPIRY DATE SNAPSHOT
//        * ========================================
//        */
//       expiryDate: {
//         type: Date,
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * SCHEDULE TYPE
//        * ========================================
//        */
//       scheduleType: {
//         type: String,
//         enum: [
//           "BEFORE_EXPIRY",
//           "ON_EXPIRY",
//           "AFTER_EXPIRY",
//           "LAST_N_DAYS",
//           "RECURRING",
//         ],
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * SCHEDULE VALUE
//        * ========================================
//        *
//        * BEFORE_EXPIRY -> daysBeforeExpiry
//        * AFTER_EXPIRY  -> daysAfterExpiry
//        * LAST_N_DAYS   -> lastNDays
//        *
//        * ON_EXPIRY     -> undefined
//        * RECURRING     -> undefined
//        */
//       scheduleValue: {
//         type: Number,
//         min: 1,
//         required: false,
//       },

//       /**
//        * ========================================
//        * SCHEDULED DATE
//        * ========================================
//        *
//        * For recurring notifications, this is
//        * the actual occurrence date.
//        */
//       scheduledDate: {
//         type: Date,
//         required: true,
//         index: true,
//       },

//       /**
//        * ========================================
//        * SUBJECT
//        * ========================================
//        */
//       subject: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       /**
//        * ========================================
//        * EMAIL
//        * ========================================
//        */
//       email: {
//         type: emailSchema,
//         required: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// /**
//  * ============================================
//  * PREVENT DUPLICATE NOTIFICATIONS
//  * ============================================
//  *
//  * A notification is considered unique by:
//  *
//  *   policy
//  *   +
//  *   notification cycle
//  *   +
//  *   reminder configuration
//  *   +
//  *   expiry date
//  *   +
//  *   scheduled date
//  *
//  * This works for expiry-based notifications.
//  *
//  * For RECURRING notifications, the scheduledDate
//  * identifies the individual recurring occurrence.
//  */
// policyNotificationSchema.index(
//   {
//     policyId: 1,
//     notificationCycleId: 1,
//     reminderConfigId: 1,
//     expiryDate: 1,
//     scheduledDate: 1,
//   },
//   {
//     unique: true,
//   }
// );

// /**
//  * ============================================
//  * CRON QUERY INDEX
//  * ============================================
//  */
// policyNotificationSchema.index({
//   scheduledDate: 1,
//   "email.status": 1,
// });

// /**
//  * ============================================
//  * POLICY HISTORY INDEX
//  * ============================================
//  */
// policyNotificationSchema.index({
//   policyId: 1,
//   scheduledDate: 1,
// });

// /**
//  * ============================================
//  * POLICY + CYCLE INDEX
//  * ============================================
//  */
// policyNotificationSchema.index({
//   policyId: 1,
//   notificationCycleId: 1,
//   scheduledDate: 1,
// });

// /**
//  * ============================================
//  * MODEL
//  * ============================================
//  */
// const PolicyNotification =
//   mongoose.model<IPolicyNotification>(
//     "PolicyNotification",
//     policyNotificationSchema
//   );

// export default PolicyNotification;

/////

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