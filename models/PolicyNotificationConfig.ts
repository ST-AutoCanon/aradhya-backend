// import mongoose, {
//   Document,
//   Schema,
// } from "mongoose";

// /**
//  * ================================
//  * REMINDER SCHEDULE TYPE
//  * ================================
//  *
//  * BEFORE_EXPIRY
//  * ----------------
//  * Send one reminder a specific number
//  * of days before expiry.
//  *
//  * Example:
//  * daysBeforeExpiry = 7
//  *
//  * Expiry = 30 Aug
//  * Reminder = 23 Aug
//  *
//  *
//  * ON_EXPIRY
//  * ----------------
//  * Send reminder on expiry date.
//  *
//  *
//  * AFTER_EXPIRY
//  * ----------------
//  * Send reminder after expiry.
//  *
//  * Example:
//  * daysAfterExpiry = 2
//  *
//  * Expiry = 30 Aug
//  * Reminder = 1 Sep
//  *
//  *
//  * LAST_N_DAYS
//  * ----------------
//  * Send reminder every day during the
//  * last N days before expiry.
//  *
//  * Example:
//  * lastNDays = 3
//  *
//  * Expiry = 30 Aug
//  *
//  * Reminders:
//  *
//  * 28 Aug
//  * 29 Aug
//  * 30 Aug
//  */
// export type PolicyNotificationScheduleType =
//   | "BEFORE_EXPIRY"
//   | "ON_EXPIRY"
//   | "AFTER_EXPIRY"
//   | "LAST_N_DAYS";

// /**
//  * ================================
//  * CONFIG INTERFACE
//  * ================================
//  */
// export interface IPolicyNotificationConfig
//   extends Document {
//   /**
//    * Admin-friendly name.
//    *
//    * Example:
//    *
//    * "7 Days Before Expiry"
//    *
//    * "Last 3 Days Daily"
//    */
//   name: string;

//   /**
//    * Reminder schedule type.
//    */
//   type: PolicyNotificationScheduleType;

//   /**
//    * Number of days before expiry.
//    *
//    * Used when:
//    *
//    * type = BEFORE_EXPIRY
//    *
//    * Example:
//    *
//    * 7
//    * 5
//    * 2
//    * 1
//    */
//   daysBeforeExpiry?: number;

//   /**
//    * Number of days after expiry.
//    *
//    * Used when:
//    *
//    * type = AFTER_EXPIRY
//    *
//    * Example:
//    *
//    * 1
//    * 2
//    * 7
//    */
//   daysAfterExpiry?: number;

//   /**
//    * Number of days for a continuous
//    * daily reminder window.
//    *
//    * Used when:
//    *
//    * type = LAST_N_DAYS
//    *
//    * Example:
//    *
//    * 3
//    *
//    * means send every day during
//    * the last 3 days.
//    */
//   lastNDays?: number;

//   /**
//    * Email subject template.
//    *
//    * Example:
//    *
//    * "Policy Expiry Reminder"
//    *
//    * The service can append customer
//    * name if required.
//    */
//   subject: string;

//   /**
//    * Enable / disable this reminder.
//    *
//    * Disabled configurations remain
//    * in the database but are ignored
//    * by the cron.
//    */
//   enabled: boolean;

//   createdAt: Date;

//   updatedAt: Date;
// }

// /**
//  * ================================
//  * CONFIG SCHEMA
//  * ================================
//  */
// const policyNotificationConfigSchema =
//   new Schema<IPolicyNotificationConfig>(
//     {
//       /**
//        * ================================
//        * NAME
//        * ================================
//        */
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       /**
//        * ================================
//        * TYPE
//        * ================================
//        */
//       type: {
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
//        * ================================
//        * BEFORE EXPIRY
//        * ================================
//        */
//       daysBeforeExpiry: {
//         type: Number,
//         min: 1,
//       },

//       /**
//        * ================================
//        * AFTER EXPIRY
//        * ================================
//        */
//       daysAfterExpiry: {
//         type: Number,
//         min: 1,
//       },

//       /**
//        * ================================
//        * LAST N DAYS
//        * ================================
//        */
//       lastNDays: {
//         type: Number,
//         min: 1,
//       },

//       /**
//        * ================================
//        * EMAIL SUBJECT
//        * ================================
//        */
//       subject: {
//         type: String,
//         required: true,
//         trim: true,
//       },

//       /**
//        * ================================
//        * ENABLED
//        * ================================
//        */
//       enabled: {
//         type: Boolean,
//         default: true,
//         index: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// /**
//  * ================================
//  * VALIDATION
//  * ================================
//  *
//  * Make sure the configuration contains
//  * the correct number field for its type.
//  *
//  * BEFORE_EXPIRY
//  * → daysBeforeExpiry required
//  *
//  * ON_EXPIRY
//  * → no day field required
//  *
//  * AFTER_EXPIRY
//  * → daysAfterExpiry required
//  *
//  * LAST_N_DAYS
//  * → lastNDays required
//  */
// policyNotificationConfigSchema.pre(
//   "validate",
//   function (next) {
//     if (
//       this.type === "BEFORE_EXPIRY"
//     ) {
//       if (
//         !this.daysBeforeExpiry ||
//         this.daysBeforeExpiry < 1
//       ) {
//         return next(
//           new Error(
//             "daysBeforeExpiry is required and must be at least 1 for BEFORE_EXPIRY"
//           )
//         );
//       }
//     }

//     if (
//       this.type === "ON_EXPIRY"
//     ) {
//       /**
//        * Nothing else is required.
//        */
//     }

//     if (
//       this.type === "AFTER_EXPIRY"
//     ) {
//       if (
//         !this.daysAfterExpiry ||
//         this.daysAfterExpiry < 1
//       ) {
//         return next(
//           new Error(
//             "daysAfterExpiry is required and must be at least 1 for AFTER_EXPIRY"
//           )
//         );
//       }
//     }

//     if (
//       this.type === "LAST_N_DAYS"
//     ) {
//       if (
//         !this.lastNDays ||
//         this.lastNDays < 1
//       ) {
//         return next(
//           new Error(
//             "lastNDays is required and must be at least 1 for LAST_N_DAYS"
//           )
//         );
//       }
//     }

//     next();
//   }
// );



// /**
//  * Useful for finding configurations
//  * by schedule type.
//  */
// policyNotificationConfigSchema.index({
//   type: 1,
//   enabled: 1,
// });

// const PolicyNotificationConfig =
//   mongoose.model<IPolicyNotificationConfig>(
//     "PolicyNotificationConfig",
//     policyNotificationConfigSchema
//   );

// export default PolicyNotificationConfig;


import mongoose, {
  Document,
  Schema,
} from "mongoose";

/**
 * ================================
 * REMINDER SCHEDULE TYPE
 * ================================
 */
export type PolicyNotificationScheduleType =
  | "BEFORE_EXPIRY"
  | "ON_EXPIRY"
  | "AFTER_EXPIRY"
  | "LAST_N_DAYS"
  | "RECURRING";

/**
 * ================================
 * RECURRING FREQUENCY
 * ================================
 *
 * WEEKLY
 * ----------------
 * Example:
 * Every Monday
 *
 *
 * MONTHLY
 * ----------------
 * Example:
 * Every 1st of the month
 *
 *
 * YEARLY
 * ----------------
 * Example:
 * Every 1st January
 */
export type PolicyNotificationRecurringFrequency =
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

/**
 * ================================
 * DAY OF WEEK
 * ================================
 *
 * 0 = Sunday
 * 1 = Monday
 * 2 = Tuesday
 * 3 = Wednesday
 * 4 = Thursday
 * 5 = Friday
 * 6 = Saturday
 */
export type PolicyNotificationDayOfWeek =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6;

/**
 * ================================
 * CONFIG INTERFACE
 * ================================
 */
export interface IPolicyNotificationConfig
  extends Document {
  /**
   * Admin-friendly name.
   *
   * Example:
   *
   * "7 Days Before Expiry"
   *
   * "Every Monday"
   *
   * "Every 1st of Month"
   */
  name: string;

  /**
   * Reminder schedule type.
   */
  type: PolicyNotificationScheduleType;

  /**
   * Number of days before expiry.
   *
   * Used when:
   *
   * type = BEFORE_EXPIRY
   */
  daysBeforeExpiry?: number;

  /**
   * Number of days after expiry.
   *
   * Used when:
   *
   * type = AFTER_EXPIRY
   */
  daysAfterExpiry?: number;

  /**
   * Number of days for a continuous
   * daily reminder window.
   *
   * Used when:
   *
   * type = LAST_N_DAYS
   */
  lastNDays?: number;

  /**
   * ================================
   * RECURRING FREQUENCY
   * ================================
   *
   * Used when:
   *
   * type = RECURRING
   */
  recurringFrequency?: PolicyNotificationRecurringFrequency;

  /**
   * ================================
   * WEEKLY DAY
   * ================================
   *
   * Used when:
   *
   * recurringFrequency = WEEKLY
   *
   * Example:
   *
   * 1 = Monday
   */
  recurringDayOfWeek?: PolicyNotificationDayOfWeek;

  /**
   * ================================
   * MONTHLY DAY
   * ================================
   *
   * Used when:
   *
   * recurringFrequency = MONTHLY
   *
   * Example:
   *
   * 1  = 1st of every month
   * 15 = 15th of every month
   * 30 = 30th of every month
   */
  recurringDayOfMonth?: number;

  /**
   * ================================
   * YEARLY MONTH
   * ================================
   *
   * Used when:
   *
   * recurringFrequency = YEARLY
   *
   * Example:
   *
   * 1 = January
   * 12 = December
   */
  recurringMonth?: number;

  /**
   * ================================
   * YEARLY DAY
   * ================================
   *
   * Used when:
   *
   * recurringFrequency = YEARLY
   *
   * Example:
   *
   * recurringMonth = 1
   * recurringDayOfMonth = 1
   *
   * means:
   *
   * Every 1st January.
   */
  subject: string;

  /**
   * Enable / disable this reminder.
   */
  enabled: boolean;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * ================================
 * CONFIG SCHEMA
 * ================================
 */
const policyNotificationConfigSchema =
  new Schema<IPolicyNotificationConfig>(
    {
      /**
       * ================================
       * NAME
       * ================================
       */
      name: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * ================================
       * TYPE
       * ================================
       */
      type: {
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
       * ================================
       * BEFORE EXPIRY
       * ================================
       */
      daysBeforeExpiry: {
        type: Number,
        min: 1,
      },

      /**
       * ================================
       * AFTER EXPIRY
       * ================================
       */
      daysAfterExpiry: {
        type: Number,
        min: 1,
      },

      /**
       * ================================
       * LAST N DAYS
       * ================================
       */
      lastNDays: {
        type: Number,
        min: 1,
      },

      /**
       * ================================
       * RECURRING FREQUENCY
       * ================================
       */
      recurringFrequency: {
        type: String,
        enum: [
          "WEEKLY",
          "MONTHLY",
          "YEARLY",
        ],
      },

      /**
       * ================================
       * RECURRING DAY OF WEEK
       * ================================
       *
       * 0 = Sunday
       * 1 = Monday
       * 2 = Tuesday
       * 3 = Wednesday
       * 4 = Thursday
       * 5 = Friday
       * 6 = Saturday
       */
      recurringDayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
      },

      /**
       * ================================
       * RECURRING DAY OF MONTH
       * ================================
       *
       * 1 - 31
       */
      recurringDayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
      },

      /**
       * ================================
       * RECURRING MONTH
       * ================================
       *
       * 1 = January
       * 12 = December
       */
      recurringMonth: {
        type: Number,
        min: 1,
        max: 12,
      },

      /**
       * ================================
       * EMAIL SUBJECT
       * ================================
       */
      subject: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * ================================
       * ENABLED
       * ================================
       */
      enabled: {
        type: Boolean,
        default: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

/**
 * ================================
 * VALIDATION
 * ================================
 */
policyNotificationConfigSchema.pre(
  "validate",
  function (next) {
    /**
     * ==================================
     * BEFORE EXPIRY
     * ==================================
     */
    if (
      this.type ===
      "BEFORE_EXPIRY"
    ) {
      if (
        !this.daysBeforeExpiry ||
        this.daysBeforeExpiry < 1
      ) {
        return next(
          new Error(
            "daysBeforeExpiry is required and must be at least 1 for BEFORE_EXPIRY"
          )
        );
      }
    }

    /**
     * ==================================
     * ON EXPIRY
     * ==================================
     */
    if (
      this.type ===
      "ON_EXPIRY"
    ) {
      // Nothing required.
    }

    /**
     * ==================================
     * AFTER EXPIRY
     * ==================================
     */
    if (
      this.type ===
      "AFTER_EXPIRY"
    ) {
      if (
        !this.daysAfterExpiry ||
        this.daysAfterExpiry < 1
      ) {
        return next(
          new Error(
            "daysAfterExpiry is required and must be at least 1 for AFTER_EXPIRY"
          )
        );
      }
    }

    /**
     * ==================================
     * LAST N DAYS
     * ==================================
     */
    if (
      this.type ===
      "LAST_N_DAYS"
    ) {
      if (
        !this.lastNDays ||
        this.lastNDays < 1
      ) {
        return next(
          new Error(
            "lastNDays is required and must be at least 1 for LAST_N_DAYS"
          )
        );
      }
    }

    /**
     * ==================================
     * RECURRING
     * ==================================
     */
    if (
      this.type ===
      "RECURRING"
    ) {
      /**
       * Frequency is required.
       */
      if (
        !this.recurringFrequency
      ) {
        return next(
          new Error(
            "recurringFrequency is required for RECURRING"
          )
        );
      }

      /**
       * ==================================
       * WEEKLY
       * ==================================
       *
       * Example:
       *
       * Every Monday
       */
      if (
        this.recurringFrequency ===
        "WEEKLY"
      ) {
        if (
          this.recurringDayOfWeek ===
          undefined ||
          this.recurringDayOfWeek ===
          null
        ) {
          return next(
            new Error(
              "recurringDayOfWeek is required for WEEKLY recurring notifications"
            )
          );
        }
      }

      /**
       * ==================================
       * MONTHLY
       * ==================================
       *
       * Example:
       *
       * Every 1st of the month
       */
      if (
        this.recurringFrequency ===
        "MONTHLY"
      ) {
        if (
          !this.recurringDayOfMonth ||
          this.recurringDayOfMonth <
            1 ||
          this.recurringDayOfMonth >
            31
        ) {
          return next(
            new Error(
              "recurringDayOfMonth is required and must be between 1 and 31 for MONTHLY recurring notifications"
            )
          );
        }
      }

      /**
       * ==================================
       * YEARLY
       * ==================================
       *
       * Example:
       *
       * Every 1st January
       */
      if (
        this.recurringFrequency ===
        "YEARLY"
      ) {
        if (
          !this.recurringMonth ||
          this.recurringMonth <
            1 ||
          this.recurringMonth >
            12
        ) {
          return next(
            new Error(
              "recurringMonth is required and must be between 1 and 12 for YEARLY recurring notifications"
            )
          );
        }

        if (
          !this.recurringDayOfMonth ||
          this.recurringDayOfMonth <
            1 ||
          this.recurringDayOfMonth >
            31
        ) {
          return next(
            new Error(
              "recurringDayOfMonth is required and must be between 1 and 31 for YEARLY recurring notifications"
            )
          );
        }
      }
    }

    next();
  }
);

/**
 * ================================
 * CONFIGURATION INDEX
 * ================================
 */
policyNotificationConfigSchema.index({
  type: 1,
  enabled: 1,
});

/**
 * ================================
 * MODEL
 * ================================
 */
const PolicyNotificationConfig =
  mongoose.model<IPolicyNotificationConfig>(
    "PolicyNotificationConfig",
    policyNotificationConfigSchema
  );

export default PolicyNotificationConfig;