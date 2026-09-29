// import Policy from "../../models/policyInfo";
// import PolicyNotification from "../../models/PolicyNotification";

// import PolicyNotificationConfig, {
//   IPolicyNotificationConfig,
//   PolicyNotificationScheduleType,
// } from "../../models/PolicyNotificationConfig";

// import { sendMail } from "../messaging/emailService";

// import { Types } from "mongoose";

// /**
//  * ============================================================
//  * TYPES
//  * ============================================================
//  */

// type NotificationConfig =
//   IPolicyNotificationConfig;

// /**
//  * ============================================================
//  * INDIA TIMEZONE
//  * ============================================================
//  */

// const INDIA_TIMEZONE = "Asia/Kolkata";

// /**
//  * ============================================================
//  * MILLISECONDS IN ONE DAY
//  * ============================================================
//  */

// const MILLISECONDS_IN_DAY =
//   1000 * 60 * 60 * 24;

// /**
//  * ============================================================
//  * GET INDIA DATE STRING
//  * ============================================================
//  *
//  * Returns:
//  *
//  * YYYY-MM-DD
//  *
//  * Example:
//  *
//  * 2026-09-07
//  */

// const getIndiaDateString = (
//   date: Date = new Date()
// ): string => {
//   return date.toLocaleDateString(
//     "en-CA",
//     {
//       timeZone: INDIA_TIMEZONE,
//     }
//   );
// };

// /**
//  * ============================================================
//  * CREATE INDIA DATE
//  * ============================================================
//  *
//  * Creates UTC midnight representing the Indian
//  * calendar date.
//  *
//  * Example:
//  *
//  * 2026-09-07
//  *
//  * becomes:
//  *
//  * 2026-09-07T00:00:00.000Z
//  */

// const createIndiaDate = (
//   dateString: string
// ): Date => {
//   const [
//     year,
//     month,
//     day,
//   ] = dateString
//     .split("-")
//     .map(Number);

//   return new Date(
//     Date.UTC(
//       year,
//       month - 1,
//       day,
//       0,
//       0,
//       0,
//       0
//     )
//   );
// };

// /**
//  * ============================================================
//  * GET DATE KEY
//  * ============================================================
//  */

// const getDateKey = (
//   date: Date
// ): string => {
//   return date
//     .toISOString()
//     .slice(0, 10);
// };

// /**
//  * ============================================================
//  * GET INDIA DATE PARTS
//  * ============================================================
//  *
//  * Returns:
//  *
//  * {
//  *   year,
//  *   month,
//  *   day
//  * }
//  *
//  * based on India calendar date.
//  */

// const getIndiaDateParts = (
//   date: Date
// ): {
//   year: number;
//   month: number;
//   day: number;
// } => {
//   const dateString =
//     getIndiaDateString(date);

//   const [
//     year,
//     month,
//     day,
//   ] = dateString
//     .split("-")
//     .map(Number);

//   return {
//     year,
//     month,
//     day,
//   };
// };

// /**
//  * ============================================================
//  * GET INDIA DAY OF WEEK
//  * ============================================================
//  *
//  * Returns:
//  *
//  * 0 = Sunday
//  * 1 = Monday
//  * 2 = Tuesday
//  * 3 = Wednesday
//  * 4 = Thursday
//  * 5 = Friday
//  * 6 = Saturday
//  */

// const getIndiaDayOfWeek = (
//   date: Date
// ): number => {
//   const indiaDateString =
//     getIndiaDateString(date);

//   const indiaDate =
//     createIndiaDate(
//       indiaDateString
//     );

//   return indiaDate.getUTCDay();
// };

// /**
//  * ============================================================
//  * FORMAT EXPIRY DATE
//  * ============================================================
//  */

// const formatExpiryDate = (
//   endDate: Date | string
// ): string => {
//   return new Date(
//     endDate
//   ).toLocaleDateString(
//     "en-IN",
//     {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//       timeZone:
//         INDIA_TIMEZONE,
//     }
//   );
// };

// /**
//  * ============================================================
//  * GET POLICY EXPIRY DATE
//  * ============================================================
//  *
//  * Converts policy.endDate into the Indian
//  * calendar date represented as UTC midnight.
//  */

// const getPolicyExpiryDate = (
//   endDate: Date | string
// ): Date => {
//   const indiaDateString =
//     new Date(
//       endDate
//     ).toLocaleDateString(
//       "en-CA",
//       {
//         timeZone:
//           INDIA_TIMEZONE,
//       }
//     );

//   return createIndiaDate(
//     indiaDateString
//   );
// };

// /**
//  * ============================================================
//  * BUILD SUBJECT
//  * ============================================================
//  */

// const buildSubject = (
//   config: NotificationConfig,
//   customerName: string
// ): string => {
//   let subject =
//     config.subject ||
//     "Policy Expiry Notification";

//   const daysBefore =
//     Number(
//       config.daysBeforeExpiry ??
//         0
//     );

//   const daysAfter =
//     Number(
//       config.daysAfterExpiry ??
//         0
//     );

//   const lastNDays =
//     Number(
//       config.lastNDays ??
//         0
//     );

//   /**
//    * Customer name
//    */

//   subject =
//     subject.replace(
//       /{{customerName}}/gi,
//       customerName || ""
//     );

//   /**
//    * Generic days placeholder
//    */

//   subject =
//     subject.replace(
//       /{{days}}/gi,
//       String(
//         config.type ===
//           "BEFORE_EXPIRY"
//           ? daysBefore
//           : config.type ===
//             "AFTER_EXPIRY"
//           ? daysAfter
//           : config.type ===
//             "LAST_N_DAYS"
//           ? lastNDays
//           : 0
//       )
//     );

//   /**
//    * Specific placeholders
//    */

//   subject =
//     subject.replace(
//       /{{daysBeforeExpiry}}/gi,
//       String(daysBefore)
//     );

//   subject =
//     subject.replace(
//       /{{daysAfterExpiry}}/gi,
//       String(daysAfter)
//     );

//   subject =
//     subject.replace(
//       /{{lastNDays}}/gi,
//       String(lastNDays)
//     );

//   return subject;
// };

// /**
//  * ============================================================
//  * GET REMINDER HEADING
//  * ============================================================
//  */

// const getHeading = (
//   config: NotificationConfig
// ): string => {
//   switch (config.type) {
//     case "BEFORE_EXPIRY": {
//       const days =
//         config.daysBeforeExpiry;

//       return `Policy Expiring in ${days} Day${
//         days === 1
//           ? ""
//           : "s"
//       }`;
//     }

//     case "ON_EXPIRY":
//       return "Policy Expires Today";

//     case "AFTER_EXPIRY": {
//       const days =
//         config.daysAfterExpiry;

//       return `Policy Expired ${days} Day${
//         days === 1
//           ? ""
//           : "s"
//       } Ago`;
//     }

//     case "LAST_N_DAYS":
//       return "Policy Expiry Reminder";

//     case "RECURRING":
//       return "Insurance Policy Reminder";

//     default:
//       return "Policy Expiry Notification";
//   }
// };

// /**
//  * ============================================================
//  * GET REMINDER MESSAGE
//  * ============================================================
//  */

// const getMessage = (
//   config: NotificationConfig
// ): string => {
//   switch (config.type) {
//     case "BEFORE_EXPIRY": {
//       const days =
//         config.daysBeforeExpiry;

//       return `Your insurance policy will expire in ${days} day${
//         days === 1
//           ? ""
//           : "s"
//       }.`;
//     }

//     case "ON_EXPIRY":
//       return "Your insurance policy expires today. Please renew it as soon as possible.";

//     case "AFTER_EXPIRY": {
//       const days =
//         config.daysAfterExpiry;

//       return `Your insurance policy expired ${days} day${
//         days === 1
//           ? ""
//           : "s"
//       } ago. Please renew it as soon as possible.`;
//     }

//     case "LAST_N_DAYS":
//       return "Your insurance policy is approaching its expiry date. Please renew it as soon as possible.";

//     case "RECURRING":
//       return "This is your scheduled insurance policy reminder. Please review your policy details and contact us if any action is required.";

//     default:
//       return "Please check your insurance policy expiry details.";
//   }
// };

// /**
//  * ============================================================
//  * BUILD EMAIL HTML
//  * ============================================================
//  */

// const buildEmailHtml = (
//   config: NotificationConfig,
//   policy: any
// ): string => {
//   const expiryDate =
//     formatExpiryDate(
//       policy.endDate
//     );

//   const heading =
//     getHeading(config);

//   const message =
//     getMessage(config);

//   return `
//     <div style="
//       font-family: Arial, sans-serif;
//       font-size: 14px;
//       line-height: 1.6;
//       color: #333;
//     ">

//       <h2>${heading}</h2>

//       <p>
//         Dear <strong>${policy.customerName}</strong>,
//       </p>

//       <p>
//         ${message}
//       </p>

//       <table
//         cellpadding="8"
//         cellspacing="0"
//         border="1"
//         style="
//           border-collapse: collapse;
//           width: 100%;
//           max-width: 600px;
//         "
//       >

//         <tr>
//           <td>
//             <strong>Customer Name</strong>
//           </td>

//           <td>
//             ${policy.customerName}
//           </td>
//         </tr>

//         <tr>
//           <td>
//             <strong>Policy Number</strong>
//           </td>

//           <td>
//             ${policy.policyNumber}
//           </td>
//         </tr>

//         <tr>
//           <td>
//             <strong>Vehicle Number</strong>
//           </td>

//           <td>
//             ${policy.vehicleNo}
//           </td>
//         </tr>

//         <tr>
//           <td>
//             <strong>Insurer</strong>
//           </td>

//           <td>
//             ${policy.insurerCompany}
//           </td>
//         </tr>

//         <tr>
//           <td>
//             <strong>Policy Expiry Date</strong>
//           </td>

//           <td>
//             ${expiryDate}
//           </td>
//         </tr>
//         <tr>
//   <td><strong>Renewal Premium</strong></td>
//   <td>₹${policy.renewalPremium}</td>
// </tr>

//       </table>

//       <p style="margin-top: 20px;">
//         Please contact us if you would like
//         to renew your policy.
//       </p>

//       <p>
//         Regards,<br />
//         <strong>Insurance Team</strong>
//       </p>

//     </div>
//   `;
// };

// /**
//  * ============================================================
//  * GET DAYS UNTIL EXPIRY
//  * ============================================================
//  */

// // const getDaysUntilExpiry = (
// //   policy: any,
// //   today: Date
// // ): number => {
// //   const expiryDate =
// //     getPolicyExpiryDate(
// //       policy.endDate
// //     );

// //   const difference =
// //     expiryDate.getTime() -
// //     today.getTime();

// //   return Math.round(
// //     difference /
// //       MILLISECONDS_IN_DAY
// //   );
// // };


// const getDaysUntilExpiry = (
//   policy: any,
//   today: Date
// ): number => {
//   const expiryDate = getPolicyExpiryDate(policy.endDate);

//   const todayKey = getIndiaDateString(today);
//   const expiryKey = getIndiaDateString(expiryDate);

//   const todayDate = createIndiaDate(todayKey);
//   const expiryDateOnly = createIndiaDate(expiryKey);

//   return Math.round(
//     (expiryDateOnly.getTime() - todayDate.getTime()) /
//       MILLISECONDS_IN_DAY
//   );
// };



// const getScheduledDateForConfig = (
//   policy: any,
//   config: NotificationConfig,
//   today: Date
// ): Date | null => {
//   /**
//    * ========================================================
//    * RECURRING
//    * ========================================================
//    *
//    * Recurring notifications are sent only during the
//    * LAST 30 DAYS before policy expiry.
//    *
//    * Example:
//    *
//    * Policy expiry = 11 March 2027
//    *
//    * WEEKLY / SATURDAY:
//    *
//    * 20 Feb 2027 -> 19 days remaining -> SEND
//    * 27 Feb 2027 -> 12 days remaining -> SEND
//    * 06 Mar 2027 ->  5 days remaining -> SEND
//    *
//    * Outside last 30 days:
//    *
//    * 08 Feb 2027 -> 31 days remaining -> NO
//    *
//    * After expiry:
//    *
//    * 12 Mar 2027 -> -1 day -> NO
//    */

//   if (config.type === "RECURRING") {
//     /**
//      * ======================================================
//      * GET POLICY EXPIRY DATE
//      * ======================================================
//      */

//     const expiryDate = getPolicyExpiryDate(
//       policy.endDate
//     );

//     const expiryDateKey = getDateKey(
//       expiryDate
//     );

//     const todayDateKey = getDateKey(
//       today
//     );

//     /**
//      * ======================================================
//      * GET DAYS UNTIL EXPIRY
//      * ======================================================
//      */

//     const daysUntilExpiry =
//       getDaysUntilExpiry(
//         policy,
//         today
//       );

//     console.log(
//       `🔁 Recurring check for policy ${policy.policyNumber}`
//     );

//     console.log(
//       `   Today: ${todayDateKey}`
//     );

//     console.log(
//       `   Expiry: ${expiryDateKey}`
//     );

//     console.log(
//       `   Days until expiry: ${daysUntilExpiry}`
//     );

//     /**
//      * ======================================================
//      * LAST 30 DAYS CHECK
//      * ======================================================
//      *
//      * Eligible:
//      *
//      *   30 days before expiry
//      *   through expiry day
//      *
//      * Not eligible:
//      *
//      *   More than 30 days before expiry
//      *   OR
//      *   after expiry
//      */

//     if (
//       daysUntilExpiry < 0 ||
//       daysUntilExpiry > 30
//     ) {
//       console.log(
//         "⏭️ Outside last 30 days before policy expiry. Recurring reminder skipped."
//       );

//       return null;
//     }

//     /**
//      * ======================================================
//      * WEEKLY
//      * ======================================================
//      */

//     if (
//       config.recurringFrequency ===
//       "WEEKLY"
//     ) {
//       const recurringDayOfWeek =
//         config.recurringDayOfWeek;

//       /**
//        * Validate configured weekday.
//        *
//        * 0 = Sunday
//        * 1 = Monday
//        * 2 = Tuesday
//        * 3 = Wednesday
//        * 4 = Thursday
//        * 5 = Friday
//        * 6 = Saturday
//        */

//       if (
//         recurringDayOfWeek ===
//           undefined ||
//         recurringDayOfWeek ===
//           null ||
//         recurringDayOfWeek < 0 ||
//         recurringDayOfWeek > 6
//       ) {
//         console.error(
//           `❌ Invalid WEEKLY recurring configuration: ${config.name}`
//         );

//         return null;
//       }

//       /**
//        * Get today's weekday using India timezone.
//        */

//       const todayDayOfWeek =
//         getIndiaDayOfWeek(
//           today
//         );

//       console.log(
//         `   Today day of week: ${todayDayOfWeek}`
//       );

//       console.log(
//         `   Configured day of week: ${recurringDayOfWeek}`
//       );

//       /**
//        * Only send on configured weekday.
//        */

//       if (
//         todayDayOfWeek !==
//         recurringDayOfWeek
//       ) {
//         console.log(
//           "⏭️ Today is not the configured recurring day."
//         );

//         return null;
//       }

//       /**
//        * ====================================================
//        * RECURRING WEEKLY REMINDER IS DUE
//        * ====================================================
//        */

//       console.log(
//         "🔔 RECURRING WEEKLY REMINDER IS DUE"
//       );

//       console.log(
//         `   Policy: ${policy.policyNumber}`
//       );

//       console.log(
//         `   Expiry: ${expiryDateKey}`
//       );

//       console.log(
//         `   Today: ${todayDateKey}`
//       );

//       console.log(
//         `   Days remaining: ${daysUntilExpiry}`
//       );

//       console.log(
//         `   Day of week: ${todayDayOfWeek}`
//       );

//       return today;
//     }

//     /**
//      * ======================================================
//      * MONTHLY
//      * ======================================================
//      *
//      * Monthly recurring notifications are also restricted
//      * to the last 30 days before expiry.
//      *
//      * Example:
//      *
//      * recurringDayOfMonth = 20
//      * expiry = 11 March
//      *
//      * If 20 Feb is within the last 30 days:
//      * -> SEND
//      */

//     if (
//       config.recurringFrequency ===
//       "MONTHLY"
//     ) {
//       const recurringDayOfMonth =
//         config.recurringDayOfMonth;

//       /**
//        * Validate configured day.
//        */

//       if (
//         recurringDayOfMonth ===
//           undefined ||
//         recurringDayOfMonth ===
//           null ||
//         recurringDayOfMonth < 1 ||
//         recurringDayOfMonth > 31
//       ) {
//         console.error(
//           `❌ Invalid MONTHLY recurring configuration: ${config.name}`
//         );

//         return null;
//       }

//       /**
//        * Get today's India calendar day.
//        */

//       const {
//         day: todayDay,
//       } = getIndiaDateParts(
//         today
//       );

//       /**
//        * Only send on configured day of month.
//        */

//       if (
//         todayDay !==
//         recurringDayOfMonth
//       ) {
//         console.log(
//           "⏭️ Today is not the configured recurring day of month."
//         );

//         return null;
//       }

//       console.log(
//         "🔔 RECURRING MONTHLY REMINDER IS DUE"
//       );

//       console.log(
//         `   Policy: ${policy.policyNumber}`
//       );

//       console.log(
//         `   Expiry: ${expiryDateKey}`
//       );

//       console.log(
//         `   Today: ${todayDateKey}`
//       );

//       console.log(
//         `   Days remaining: ${daysUntilExpiry}`
//       );

//       return today;
//     }

//     /**
//      * ======================================================
//      * YEARLY
//      * ======================================================
//      *
//      * Yearly recurring notifications are restricted to
//      * the last 30 days before expiry.
//      */

//     if (
//       config.recurringFrequency ===
//       "YEARLY"
//     ) {
//       const recurringMonth =
//         config.recurringMonth;

//       const recurringDayOfMonth =
//         config.recurringDayOfMonth;

//       /**
//        * Validate month.
//        */

//       if (
//         recurringMonth ===
//           undefined ||
//         recurringMonth ===
//           null ||
//         recurringMonth < 1 ||
//         recurringMonth > 12
//       ) {
//         console.error(
//           `❌ Invalid YEARLY recurring month: ${config.name}`
//         );

//         return null;
//       }

//       /**
//        * Validate day.
//        */

//       if (
//         recurringDayOfMonth ===
//           undefined ||
//         recurringDayOfMonth ===
//           null ||
//         recurringDayOfMonth < 1 ||
//         recurringDayOfMonth > 31
//       ) {
//         console.error(
//           `❌ Invalid YEARLY recurring day: ${config.name}`
//         );

//         return null;
//       }

//       /**
//        * Get India date parts.
//        */

//       const {
//         year: todayYear,
//         month: todayMonth,
//         day: todayDay,
//       } = getIndiaDateParts(
//         today
//       );

//       const {
//         year: expiryYear,
//       } = getIndiaDateParts(
//         expiryDate
//       );

//       /**
//        * Match configured month/day and expiry year.
//        */

//       if (
//         todayMonth !==
//           recurringMonth ||
//         todayYear !==
//           expiryYear ||
//         todayDay !==
//           recurringDayOfMonth
//       ) {
//         console.log(
//           "⏭️ Today does not match yearly recurring configuration."
//         );

//         return null;
//       }

//       console.log(
//         "🔔 RECURRING YEARLY REMINDER IS DUE"
//       );

//       console.log(
//         `   Policy: ${policy.policyNumber}`
//       );

//       console.log(
//         `   Expiry: ${expiryDateKey}`
//       );

//       console.log(
//         `   Today: ${todayDateKey}`
//       );

//       console.log(
//         `   Days remaining: ${daysUntilExpiry}`
//       );

//       return today;
//     }

//     /**
//      * ======================================================
//      * INVALID FREQUENCY
//      * ======================================================
//      */

//     console.error(
//       `❌ Invalid recurring frequency for config ${config.name}`
//     );

//     return null;
//   }

//   /**
//    * ========================================================
//    * EXPIRY BASED REMINDERS
//    * ========================================================
//    */

//   const daysUntilExpiry =
//     getDaysUntilExpiry(
//       policy,
//       today
//     );

//   /**
//    * ========================================================
//    * BEFORE EXPIRY
//    * ========================================================
//    */

//   if (
//     config.type ===
//     "BEFORE_EXPIRY"
//   ) {
//     const daysBefore =
//       config.daysBeforeExpiry;

//     if (
//       daysBefore ===
//         undefined ||
//       daysBefore ===
//         null ||
//       daysBefore < 1
//     ) {
//       return null;
//     }

//     if (
//       daysUntilExpiry ===
//       daysBefore
//     ) {
//       return today;
//     }

//     return null;
//   }

//   /**
//    * ========================================================
//    * ON EXPIRY
//    * ========================================================
//    */

//   if (
//     config.type ===
//     "ON_EXPIRY"
//   ) {
//     if (
//       daysUntilExpiry ===
//       0
//     ) {
//       return today;
//     }

//     return null;
//   }

//   /**
//    * ========================================================
//    * AFTER EXPIRY
//    * ========================================================
//    */

//   if (
//     config.type ===
//     "AFTER_EXPIRY"
//   ) {
//     const daysAfter =
//       config.daysAfterExpiry;

//     if (
//       daysAfter ===
//         undefined ||
//       daysAfter ===
//         null ||
//       daysAfter < 1
//     ) {
//       return null;
//     }

//     if (
//       daysUntilExpiry ===
//       -daysAfter
//     ) {
//       return today;
//     }

//     return null;
//   }

//   /**
//    * ========================================================
//    * LAST N DAYS
//    * ========================================================
//    *
//    * Example:
//    *
//    * lastNDays = 3
//    * expiry = 30 Aug
//    *
//    * Sends:
//    *
//    * 28 Aug
//    * 29 Aug
//    * 30 Aug
//    */

//   if (
//     config.type ===
//     "LAST_N_DAYS"
//   ) {
//     const lastNDays =
//       config.lastNDays;

//     if (
//       lastNDays ===
//         undefined ||
//       lastNDays ===
//         null ||
//       lastNDays < 1
//     ) {
//       return null;
//     }

//     // if (
//     //   daysUntilExpiry >= 0 &&
//     //   daysUntilExpiry <
//     //     lastNDays
//     // ) {
//     //   return today;
//     // }


//     if (
//   daysUntilExpiry >= 0 &&
//   daysUntilExpiry <= lastNDays - 1
// ) {
//   return today;
//     }
    
//     return null;
//   }

//   return null;
// };


// const getScheduleValue = (
//   config: NotificationConfig
// ): number | undefined => {
//   switch (config.type) {
//     case "BEFORE_EXPIRY":
//       return config.daysBeforeExpiry;

//     case "AFTER_EXPIRY":
//       return config.daysAfterExpiry;

//     case "LAST_N_DAYS":
//       return config.lastNDays;

//     case "ON_EXPIRY":
//       return undefined;

//     case "RECURRING":
//       return undefined;

//     default:
//       return undefined;
//   }
// };


// const getNotificationCycleId =
//   async (
//     policy: any
//   ): Promise<Types.ObjectId> => {
//     /**
//      * Existing cycle
//      */

//     if (
//       policy.notificationCycleId
//     ) {
//       return new Types.ObjectId(
//         policy.notificationCycleId
//       );
//     }

//     /**
//      * Legacy policy without cycle ID.
//      */

//     const newCycleId =
//       new Types.ObjectId();

//     console.log(
//       `🆕 Creating notification cycle for legacy policy ${policy.policyNumber}`
//     );

//     console.log(
//       `   Cycle ID: ${newCycleId.toString()}`
//     );

//     await Policy.updateOne(
//       {
//         _id: policy._id,
//       },
//       {
//         $set: {
//           notificationCycleId:
//             newCycleId,
//         },
//       }
//     );

//     /**
//      * Update local policy object.
//      */

//     policy.notificationCycleId =
//       newCycleId;

//     return newCycleId;
//   };

// /**
//  * ============================================================
//  * BUILD NOTIFICATION QUERY
//  * ============================================================
//  *
//  * EXPIRY BASED:
//  *
//  * policyId
//  * +
//  * notificationCycleId
//  * +
//  * reminderConfigId
//  * +
//  * expiryDate
//  * +
//  * scheduleType
//  * +
//  * scheduledDate
//  *
//  *
//  * RECURRING:
//  *
//  * policyId
//  * +
//  * reminderConfigId
//  * +
//  * scheduleType
//  * +
//  * scheduledDate
//  *
//  *
//  * This means:
//  *
//  * Every Monday:
//  *
//  * 2026-09-07 -> one notification
//  * 2026-09-14 -> another notification
//  * 2026-09-21 -> another notification
//  *
//  * A policy renewal does not create a duplicate
//  * notification for the same calendar date.
//  */

// const buildNotificationQuery = (
//   policy: any,
//   config: NotificationConfig,
//   notificationCycleId: Types.ObjectId,
//   expiryDate: Date,
//   scheduledDate: Date,
//   scheduleValue?: number
// ) => {
//   if (config.type === "RECURRING") {
//     return {
//       policyId: policy._id,

//       notificationCycleId,

//       reminderConfigId: config._id,

//       scheduleType: config.type,

//       scheduledDate,
//     };
//   }

//   const query: any = {
//     policyId: policy._id,

//     notificationCycleId,

//     reminderConfigId: config._id,

//     expiryDate,

//     scheduleType: config.type,

//     scheduledDate,
//   };

//   if (scheduleValue !== undefined) {
//     query.scheduleValue = scheduleValue;
//   }

//   return query;
// };

// /**
//  * ============================================================
//  * PROCESS ONE NOTIFICATION
//  * ============================================================
//  */

// const processNotification =
//   async (
//     policy: any,
//     config: NotificationConfig,
//     scheduledDate: Date,
//     notificationCycleId: Types.ObjectId
//   ): Promise<void> => {
//     /**
//      * ========================================================
//      * RECIPIENT
//      * ========================================================
//      */

//     const recipientEmail =
//       typeof policy.email ===
//         "string" &&
//       policy.email.trim()
//         ? policy.email
//             .toLowerCase()
//             .trim()
//         : null;

//     if (!recipientEmail) {
//       console.log(
//         `⚠️ No email for policy ${policy.policyNumber}. Skipping.`
//       );

//       return;
//     }

//     /**
//      * ========================================================
//      * EXPIRY DATE SNAPSHOT
//      * ========================================================
//      *
//      * Still stored for recurring notifications as historical
//      * policy information.
//      */

//     const expiryDate =
//       getPolicyExpiryDate(
//         policy.endDate
//       );

//     /**
//      * ========================================================
//      * SUBJECT
//      * ========================================================
//      */

//     const subject =
//       buildSubject(
//         config,
//         policy.customerName
//       );

//     /**
//      * ========================================================
//      * SCHEDULE VALUE
//      * ========================================================
//      */

//     const scheduleValue =
//       getScheduleValue(
//         config
//       );

//     /**
//      * ========================================================
//      * NOTIFICATION QUERY
//      * ========================================================
//      */

//     const notificationQuery =
//       buildNotificationQuery(
//         policy,
//         config,
//         notificationCycleId,
//         expiryDate,
//         scheduledDate,
//         scheduleValue
//       );

//     /**
//      * ========================================================
//      * LOG LOOKUP
//      * ========================================================
//      */

//     console.log(
//       "🔎 Notification lookup:"
//     );

//     console.log(
//       JSON.stringify(
//         {
//           policyId:
//             policy._id?.toString(),

//           notificationCycleId:
//             notificationCycleId.toString(),

//           reminderConfigId:
//             config._id?.toString(),

//           expiryDate:
//             expiryDate.toISOString(),

//           scheduleType:
//             config.type,

//           scheduleValue,

//           scheduledDate:
//             scheduledDate.toISOString(),

//           identity:
//             config.type ===
//             "RECURRING"
//               ? "policyId + reminderConfigId + scheduleType + scheduledDate"
//               : "policyId + notificationCycleId + reminderConfigId + expiryDate + scheduleType + scheduledDate",
//         },
//         null,
//         2
//       )
//     );

//     /**
//      * ========================================================
//      * FIND EXISTING NOTIFICATION
//      * ========================================================
//      */

//     let notification =
//       await PolicyNotification.findOne(
//         notificationQuery
//       );

//     /**
//      * ========================================================
//      * CREATE NOTIFICATION
//      * ========================================================
//      */

//     if (!notification) {
//       console.log(
//         "🆕 Notification does not exist. Creating..."
//       );

//       try {
//         notification =
//           await PolicyNotification.create(
//             {
//               policyId:
//                 policy._id,

//               /**
//                * For recurring notifications this cycle
//                * is retained as historical information.
//                *
//                * It is NOT part of the recurring identity.
//                */
//               notificationCycleId,

//               reminderConfigId:
//                 config._id,

//               expiryDate,

//               scheduleType:
//                 config.type as PolicyNotificationScheduleType,

//               scheduleValue,

//               scheduledDate,

//               subject,

//               email: {
//                 recipient:
//                   recipientEmail,

//                 status:
//                   "PENDING",

//                 attempts: 0,
//               },
//             }
//           );

//         console.log(
//           "✅ Notification document created:"
//         );

//         console.log(
//           `   Notification ID: ${notification._id}`
//         );

//         console.log(
//           `   Cycle ID: ${notificationCycleId.toString()}`
//         );

//         console.log(
//           `   Type: ${config.type}`
//         );

//         console.log(
//           `   Scheduled: ${getDateKey(
//             scheduledDate
//           )}`
//         );

//         console.log(
//           `   Expiry: ${getDateKey(
//             expiryDate
//           )}`
//         );
//       } catch (
//         error: any
//       ) {
//         /**
//          * ====================================================
//          * DUPLICATE KEY
//          * ====================================================
//          */

//         if (
//           error?.code === 11000
//         ) {
//           console.log(
//             "ℹ️ Notification already exists due to duplicate index. Loading existing document..."
//           );

//           notification =
//             await PolicyNotification.findOne(
//               notificationQuery
//             );

//           if (
//             !notification
//           ) {
//             console.error(
//               "❌ Duplicate key was reported, but notification could not be found."
//             );

//             console.error(
//               "Duplicate error:",
//               error
//             );

//             return;
//           }
//         } else {
//           /**
//            * ==================================================
//            * DO NOT HIDE DATABASE ERRORS
//            * ==================================================
//            */

//           console.error(
//             "❌ PolicyNotification.create() failed"
//           );

//           console.error(
//             "❌ Error name:",
//             error?.name
//           );

//           console.error(
//             "❌ Error message:",
//             error?.message
//           );

//           console.error(
//             "❌ Error code:",
//             error?.code
//           );

//           console.error(
//             "❌ Full Mongo/Mongoose error:",
//             error
//           );

//           throw error;
//         }
//       }
//     }

//     /**
//      * ========================================================
//      * SAFETY CHECK
//      * ========================================================
//      */

//     if (!notification) {
//       console.error(
//         `❌ Could not create/find notification for ${policy.policyNumber}`
//       );

//       return;
//     }

//     /**
//      * ========================================================
//      * EMAIL OBJECT
//      * ========================================================
//      */

//     if (!notification.email) {
//       notification.email = {
//         recipient:
//           recipientEmail,

//         status:
//           "PENDING",

//         attempts: 0,
//       };
//     }

//     /**
//      * ========================================================
//      * UPDATE RECIPIENT
//      * ========================================================
//      */

//     if (
//       notification.email
//         .recipient !==
//       recipientEmail
//     ) {
//       notification.email
//         .recipient =
//         recipientEmail;

//       /**
//        * Do not reset SENT.
//        */

//       if (
//         notification.email
//           .status !==
//         "SENT"
//       ) {
//         notification.email
//           .status =
//           "PENDING";
//       }
//     }

//     /**
//      * ========================================================
//      * UPDATE SUBJECT
//      * ========================================================
//      */

//     notification.subject =
//       subject;

//     /**
//      * ========================================================
//      * SAVE BEFORE SEND
//      * ========================================================
//      */

//     await notification.save();

//     /**
//      * ========================================================
//      * ALREADY SENT
//      * ========================================================
//      */

//     if (
//       notification.email
//         .status ===
//       "SENT"
//     ) {
//       console.log(
//         `⏭️ Already sent: ${config.name} | ` +
//         `${config.type} | ` +
//         `value=${scheduleValue} | ` +
//         `policy=${policy.policyNumber} | ` +
//         `cycle=${notificationCycleId.toString()} | ` +
//         `date=${getDateKey(
//           scheduledDate
//         )} | ` +
//         `expiry=${getDateKey(
//           expiryDate
//         )}`
//       );

//       return;
//     }

//     /**
//      * ========================================================
//      * SEND EMAIL
//      * ========================================================
//      */

//     try {
//       /**
//        * ====================================================
//        * UPDATE ATTEMPT
//        * ====================================================
//        */

//       notification.email.attempts +=
//         1;

//       notification.email
//         .lastAttemptAt =
//         new Date();

//       notification.email.status =
//         "PROCESSING";

//       notification.email
//         .errorMessage =
//         undefined;

//       await notification.save();

//       /**
//        * ====================================================
//        * BUILD HTML
//        * ====================================================
//        */

//       const html =
//         buildEmailHtml(
//           config,
//           policy
//         );

//       /**
//        * ====================================================
//        * SEND EMAIL
//        * ====================================================
//        */

//       console.log(
//         "📨 Sending email..."
//       );

//       console.log(
//         `   To: ${recipientEmail}`
//       );

//       console.log(
//         `   Subject: ${subject}`
//       );

//       console.log(
//         `   Type: ${config.type}`
//       );

//       console.log(
//         `   Cycle: ${notificationCycleId.toString()}`
//       );

//       console.log(
//         `   Scheduled: ${getDateKey(
//           scheduledDate
//         )}`
//       );

//       const mailInfo =
//         await sendMail(
//           recipientEmail,

//           subject,

//           `Policy notification for ${policy.customerName}`,

//           html
//         );

//       /**
//        * ====================================================
//        * SUCCESS
//        * ====================================================
//        */

//       notification.email.status =
//         "SENT";

//       notification.email.sentAt =
//         new Date();

//       notification.email.messageId =
//         mailInfo?.messageId;

//       notification.email
//         .errorMessage =
//         undefined;

//       await notification.save();

//       /**
//        * ====================================================
//        * SUCCESS LOG
//        * ====================================================
//        */

//       console.log(
//         "========================================"
//       );

//       console.log(
//         "✅ EMAIL SENT SUCCESSFULLY"
//       );

//       console.log(
//         `📧 To: ${notification.email.recipient}`
//       );

//       console.log(
//         `🆔 Message ID: ${
//           mailInfo?.messageId ||
//           "N/A"
//         }`
//       );

//       console.log(
//         `🔄 Notification Cycle: ${notificationCycleId.toString()}`
//       );

//       console.log(
//         `📌 Type: ${config.type}`
//       );

//       console.log(
//         `📅 Scheduled: ${getDateKey(
//           scheduledDate
//         )}`
//       );

//       console.log(
//         `📅 Expiry: ${getDateKey(
//           expiryDate
//         )}`
//       );

//       console.log(
//         `📬 Response: ${
//           mailInfo?.response ||
//           "N/A"
//         }`
//       );

//       console.log(
//         "========================================"
//       );
//     } catch (
//       error: any
//     ) {
//       /**
//        * ====================================================
//        * EMAIL FAILED
//        * ====================================================
//        */

//       notification.email.status =
//         "FAILED";

//       notification.email
//         .errorMessage =
//         error?.message ||
//         "Unknown email sending error";

//       notification.email
//         .lastAttemptAt =
//         new Date();

//       await notification.save();

//       console.error(
//         "========================================"
//       );

//       console.error(
//         "❌ EMAIL SEND FAILED"
//       );

//       console.error(
//         `📧 To: ${notification.email.recipient}`
//       );

//       console.error(
//         `🔄 Cycle: ${notificationCycleId.toString()}`
//       );

//       console.error(
//         `📌 Type: ${config.type}`
//       );

//       console.error(
//         `📅 Scheduled: ${getDateKey(
//           scheduledDate
//         )}`
//       );

//       console.error(
//         `❌ Error: ${
//           error?.message ||
//           "Unknown error"
//         }`
//       );

//       console.error(
//         "========================================"
//       );

//       /**
//        * Continue processing other notifications.
//        */
//     }

//     /**
//      * ========================================================
//      * FINAL STATUS
//      * ========================================================
//      */

//     console.log(
//       `📊 ${config.name} completed for ${policy.policyNumber} | ` +
//       `Type: ${config.type} | ` +
//       `Cycle: ${notificationCycleId.toString()} | ` +
//       `Email: ${
//         notification.email
//           ?.status ||
//         "N/A"
//       }`
//     );
//   };

// /**
//  * ============================================================
//  * PROCESS POLICY EXPIRY EMAILS
//  * ============================================================
//  */

// export const processPolicyExpiryEmails =
//   async (): Promise<void> => {
//     console.log(
//       "========================================"
//     );

//     console.log(
//       "📧 Dynamic policy expiry email job started"
//     );

//     console.log(
//       "========================================"
//     );

//     try {
//       /**
//        * ======================================================
//        * CURRENT SERVER TIME
//        * ======================================================
//        */

//       const now =
//         new Date();

//       console.log(
//         "🕐 SERVER NOW:",
//         now.toISOString()
//       );

//       /**
//        * ======================================================
//        * INDIA DATE
//        * ======================================================
//        */

//       const indiaDateString =
//         getIndiaDateString(
//           now
//         );

//       console.log(
//         "🇮🇳 INDIA DATE:",
//         indiaDateString
//       );

//       /**
//        * ======================================================
//        * TODAY
//        * ======================================================
//        */

//       const today =
//         createIndiaDate(
//           indiaDateString
//         );

//       console.log(
//         "📅 TODAY:",
//         today.toISOString()
//       );

//       /**
//        * ======================================================
//        * LOAD ACTIVE CONFIGURATIONS
//        * ======================================================
//        */

//       const configs =
//         await PolicyNotificationConfig.find(
//           {
//             enabled: true,
//           }
//         )
//           .sort({
//             createdAt: 1,
//           })
//           .lean();

//       console.log(
//         `⚙️ Active reminder configurations: ${configs.length}`
//       );

//       /**
//        * ======================================================
//        * NO CONFIGURATION
//        * ======================================================
//        */

//       if (
//         configs.length === 0
//       ) {
//         console.log(
//           "ℹ️ No active reminder configurations found."
//         );

//         return;
//       }

//       /**
//        * ======================================================
//        * LOAD ACTIVE POLICIES
//        * ======================================================
//        */

//       const policies =
//         await Policy.find(
//           {
//             isActive: true,

//             email: {
//               $exists: true,

//               $ne: "",
//             },
//           }
//         ).lean();

//       console.log(
//         `📋 Active policies with email: ${policies.length}`
//       );

//       /**
//        * ======================================================
//        * PROCESS EACH POLICY
//        * ======================================================
//        */

//       for (
//         const policy of policies
//       ) {
//         console.log(
//           "========================================"
//         );

//         console.log(
//           `📋 Processing policy: ${policy.policyNumber}`
//         );

//         console.log(
//           `👤 Customer: ${policy.customerName}`
//         );

//         console.log(
//           `📅 Policy end date: ${formatExpiryDate(
//             policy.endDate
//           )}`
//         );

//         /**
//          * ====================================================
//          * GET NOTIFICATION CYCLE
//          * ====================================================
//          *
//          * This remains available for expiry-based
//          * notifications.
//          *
//          * Recurring notifications do not use the cycle
//          * as part of their unique identity.
//          */

//         const notificationCycleId =
//           await getNotificationCycleId(
//             policy
//           );

//         console.log(
//           `🔄 Notification Cycle ID: ${notificationCycleId.toString()}`
//         );

//         /**
//          * ====================================================
//          * EXPIRY SNAPSHOT
//          * ====================================================
//          */

//         const expiryDate =
//           getPolicyExpiryDate(
//             policy.endDate
//           );

//         console.log(
//           `📅 Policy expiry snapshot: ${getDateKey(
//             expiryDate
//           )}`
//         );

//         /**
//          * ====================================================
//          * DAYS UNTIL EXPIRY
//          * ====================================================
//          *
//          * This is useful for expiry-based reminders.
//          *
//          * RECURRING reminders ignore this value.
//          */

//         const daysUntilExpiry =
//           getDaysUntilExpiry(
//             policy,
//             today
//           );

//         console.log(
//           `📊 Days until expiry: ${daysUntilExpiry}`
//         );

//         /**
//          * ====================================================
//          * PROCESS EACH CONFIGURATION
//          * ====================================================
//          */

//         for (
//           const config of configs
//         ) {
//           console.log(
//             "----------------------------------------"
//           );

//           console.log(
//             `🔎 Checking reminder: ${config.name}`
//           );

//           console.log(
//             `🆔 Config ID: ${config._id}`
//           );

//           console.log(
//             `📌 Type: ${config.type}`
//           );

//           /**
//            * ==================================================
//            * EXPIRY CONFIG LOGGING
//            * ==================================================
//            */

//           if (
//             config.type ===
//             "BEFORE_EXPIRY"
//           ) {
//             console.log(
//               `📅 Days before expiry: ${config.daysBeforeExpiry}`
//             );
//           }

//           if (
//             config.type ===
//             "AFTER_EXPIRY"
//           ) {
//             console.log(
//               `📅 Days after expiry: ${config.daysAfterExpiry}`
//             );
//           }

//           if (
//             config.type ===
//             "LAST_N_DAYS"
//           ) {
//             console.log(
//               `📅 Last N days: ${config.lastNDays}`
//             );
//           }

//           /**
//            * ==================================================
//            * RECURRING CONFIG LOGGING
//            * ==================================================
//            */

//           if (
//             config.type ===
//             "RECURRING"
//           ) {
//             console.log(
//               `🔁 Recurring frequency: ${config.recurringFrequency}`
//             );

//             if (
//               config.recurringFrequency ===
//               "WEEKLY"
//             ) {
//               console.log(
//                 `📅 Recurring day of week: ${config.recurringDayOfWeek}`
//               );
//             }

//             if (
//               config.recurringFrequency ===
//               "MONTHLY"
//             ) {
//               console.log(
//                 `📅 Recurring day of month: ${config.recurringDayOfMonth}`
//               );
//             }

//             if (
//               config.recurringFrequency ===
//               "YEARLY"
//             ) {
//               console.log(
//                 `📅 Recurring month: ${config.recurringMonth}`
//               );

//               console.log(
//                 `📅 Recurring day of month: ${config.recurringDayOfMonth}`
//               );
//             }
//           }

//           /**
//            * ==================================================
//            * CALCULATE SCHEDULE
//            * ==================================================
//            */

//           const scheduledDate =
//             getScheduledDateForConfig(
//               policy,
//               config,
//               today
//             );

//           /**
//            * ==================================================
//            * NOT DUE TODAY
//            * ==================================================
//            */

//           if (
//             !scheduledDate
//           ) {
//             console.log(
//               "⏭️ Reminder not due today."
//             );

//             continue;
//           }

//           /**
//            * ==================================================
//            * REMINDER IS DUE
//            * ==================================================
//            */

//           console.log(
//             "📧 Reminder due"
//           );

//           console.log(
//             `   Policy: ${policy.policyNumber}`
//           );

//           console.log(
//             `   Customer: ${policy.customerName}`
//           );

//           console.log(
//             `   Config: ${config.name}`
//           );

//           console.log(
//             `   Type: ${config.type}`
//           );

//           console.log(
//             `   Frequency: ${
//               config.type ===
//               "RECURRING"
//                 ? config.recurringFrequency ||
//                   "N/A"
//                 : "N/A"
//             }`
//           );

//           console.log(
//             `   Schedule Value: ${
//               getScheduleValue(
//                 config
//               ) ?? "N/A"
//             }`
//           );

//           console.log(
//             `   Scheduled: ${getDateKey(
//               scheduledDate
//             )}`
//           );

//           console.log(
//             `   Expiry: ${getDateKey(
//               expiryDate
//             )}`
//           );

//           console.log(
//             `   Cycle: ${notificationCycleId.toString()}`
//           );

//           /**
//            * ==================================================
//            * PROCESS NOTIFICATION
//            * ==================================================
//            */

//           await processNotification(
//             policy,
//             config,
//             scheduledDate,
//             notificationCycleId
//           );
//         }
//       }

//       /**
//        * ======================================================
//        * COMPLETED
//        * ======================================================
//        */

//       console.log(
//         "========================================"
//       );

//       console.log(
//         "✅📧 Dynamic policy expiry email job completed"
//       );

//       console.log(
//         "========================================"
//       );
//     } catch (
//       error
//     ) {
//       console.error(
//         "========================================"
//       );

//       console.error(
//         "❌ Policy expiry email job failed:"
//       );

//       console.error(
//         error
//       );

//       console.error(
//         "========================================"
//       );

//       throw error;
//     }
//   };

import Policy from "../../models/policyInfo";
import PolicyNotification from "../../models/PolicyNotification";

import PolicyNotificationConfig, {
  IPolicyNotificationConfig,
  PolicyNotificationScheduleType,
} from "../../models/PolicyNotificationConfig";

import { sendMail } from "../messaging/emailService";

import { Types } from "mongoose";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

type NotificationConfig =
  IPolicyNotificationConfig;

/**
 * ============================================================
 * INDIA TIMEZONE
 * ============================================================
 */

const INDIA_TIMEZONE = "Asia/Kolkata";

/**
 * ============================================================
 * MILLISECONDS IN ONE DAY
 * ============================================================
 */

const MILLISECONDS_IN_DAY =
  1000 * 60 * 60 * 24;

/**
 * ============================================================
 * GET INDIA DATE STRING
 * ============================================================
 *
 * Returns:
 *
 * YYYY-MM-DD
 *
 * Example:
 *
 * 2026-09-07
 */

const getIndiaDateString = (
  date: Date = new Date()
): string => {
  return date.toLocaleDateString(
    "en-CA",
    {
      timeZone: INDIA_TIMEZONE,
    }
  );
};

/**
 * ============================================================
 * CREATE INDIA DATE
 * ============================================================
 *
 * Creates UTC midnight representing the Indian
 * calendar date.
 *
 * Example:
 *
 * 2026-09-07
 *
 * becomes:
 *
 * 2026-09-07T00:00:00.000Z
 */

const createIndiaDate = (
  dateString: string
): Date => {
  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      0,
      0,
      0,
      0
    )
  );
};

/**
 * ============================================================
 * GET DATE KEY
 * ============================================================
 */

const getDateKey = (
  date: Date
): string => {
  return date
    .toISOString()
    .slice(0, 10);
};

/**
 * ============================================================
 * GET INDIA DATE PARTS
 * ============================================================
 *
 * Returns:
 *
 * {
 *   year,
 *   month,
 *   day
 * }
 *
 * based on India calendar date.
 */

const getIndiaDateParts = (
  date: Date
): {
  year: number;
  month: number;
  day: number;
} => {
  const dateString =
    getIndiaDateString(date);

  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  return {
    year,
    month,
    day,
  };
};

/**
 * ============================================================
 * GET INDIA DAY OF WEEK
 * ============================================================
 *
 * Returns:
 *
 * 0 = Sunday
 * 1 = Monday
 * 2 = Tuesday
 * 3 = Wednesday
 * 4 = Thursday
 * 5 = Friday
 * 6 = Saturday
 */

const getIndiaDayOfWeek = (
  date: Date
): number => {
  const indiaDateString =
    getIndiaDateString(date);

  const indiaDate =
    createIndiaDate(
      indiaDateString
    );

  return indiaDate.getUTCDay();
};

/**
 * ============================================================
 * FORMAT EXPIRY DATE
 * ============================================================
 */

const formatExpiryDate = (
  endDate: Date | string
): string => {
  return new Date(
    endDate
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone:
        INDIA_TIMEZONE,
    }
  );
};

/**
 * ============================================================
 * GET POLICY EXPIRY DATE
 * ============================================================
 *
 * Converts policy.endDate into the Indian
 * calendar date represented as UTC midnight.
 */

const getPolicyExpiryDate = (
  endDate: Date | string
): Date => {
  const indiaDateString =
    new Date(
      endDate
    ).toLocaleDateString(
      "en-CA",
      {
        timeZone:
          INDIA_TIMEZONE,
      }
    );

  return createIndiaDate(
    indiaDateString
  );
};

/**
 * ============================================================
 * BUILD SUBJECT
 * ============================================================
 */

const buildSubject = (
  config: NotificationConfig,
  customerName: string
): string => {
  let subject =
    config.subject ||
    "Policy Expiry Notification";

  const daysBefore =
    Number(
      config.daysBeforeExpiry ??
        0
    );

  const daysAfter =
    Number(
      config.daysAfterExpiry ??
        0
    );

  const lastNDays =
    Number(
      config.lastNDays ??
        0
    );

  /**
   * Customer name
   */

  subject =
    subject.replace(
      /{{customerName}}/gi,
      customerName || ""
    );

  /**
   * Generic days placeholder
   */

  subject =
    subject.replace(
      /{{days}}/gi,
      String(
        config.type ===
          "BEFORE_EXPIRY"
          ? daysBefore
          : config.type ===
            "AFTER_EXPIRY"
          ? daysAfter
          : config.type ===
            "LAST_N_DAYS"
          ? lastNDays
          : 0
      )
    );

  /**
   * Specific placeholders
   */

  subject =
    subject.replace(
      /{{daysBeforeExpiry}}/gi,
      String(daysBefore)
    );

  subject =
    subject.replace(
      /{{daysAfterExpiry}}/gi,
      String(daysAfter)
    );

  subject =
    subject.replace(
      /{{lastNDays}}/gi,
      String(lastNDays)
    );

  return subject;
};

/**
 * ============================================================
 * GET REMINDER HEADING
 * ============================================================
 */

const getHeading = (
  config: NotificationConfig
): string => {
  switch (config.type) {
    case "BEFORE_EXPIRY": {
      const days =
        config.daysBeforeExpiry;

      return `Policy Expiring in ${days} Day${
        days === 1
          ? ""
          : "s"
      }`;
    }

    case "ON_EXPIRY":
      return "Policy Expires Today";

    case "AFTER_EXPIRY": {
      const days =
        config.daysAfterExpiry;

      return `Policy Expired ${days} Day${
        days === 1
          ? ""
          : "s"
      } Ago`;
    }

    case "LAST_N_DAYS":
      return "Policy Expiry Reminder";

    case "RECURRING":
      return "Insurance Policy Reminder";

    default:
      return "Policy Expiry Notification";
  }
};

/**
 * ============================================================
 * GET REMINDER MESSAGE
 * ============================================================
 */

const getMessage = (
  config: NotificationConfig
): string => {
  switch (config.type) {
    case "BEFORE_EXPIRY": {
      const days =
        config.daysBeforeExpiry;

      return `Your insurance policy will expire in ${days} day${
        days === 1
          ? ""
          : "s"
      }.`;
    }

    case "ON_EXPIRY":
      return "Your insurance policy expires today. Please renew it as soon as possible.";

    case "AFTER_EXPIRY": {
      const days =
        config.daysAfterExpiry;

      return `Your insurance policy expired ${days} day${
        days === 1
          ? ""
          : "s"
      } ago. Please renew it as soon as possible.`;
    }

    case "LAST_N_DAYS":
      return "Your insurance policy is approaching its expiry date. Please renew it as soon as possible.";

    case "RECURRING":
      return "This is your scheduled insurance policy reminder. Please review your policy details and contact us if any action is required.";

    default:
      return "Please check your insurance policy expiry details.";
  }
};

/**
 * ============================================================
 * HTML ESCAPE
 * ============================================================
 *
 * Keeps dynamic customer/policy values safe when inserted
 * into the email HTML.
 */
const escapeHtml = (value: unknown): string => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * ============================================================
 * FORMAT PREMIUM
 * ============================================================
 */
const formatPremium = (
  value: unknown
): string => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * ============================================================
 * BUILD EMAIL HTML
 * ============================================================
 *
 * Professional, responsive insurance renewal reminder email.
 * Scheduling/business logic remains unchanged.
 */
const buildEmailHtml = (
  config: NotificationConfig,
  policy: any
): string => {
  const customerName =
    escapeHtml(policy.customerName || "Customer");

  const policyNumber =
    escapeHtml(policy.policyNumber || "—");

  const vehicleNumber =
    escapeHtml(policy.vehicleNo || "—");

  const insurer =
    escapeHtml(policy.insurerCompany || "—");

  const expiryDate =
    escapeHtml(
      formatExpiryDate(policy.endDate)
    );

  const premium =
    formatPremium(policy.renewalPremium);

  const heading =
    escapeHtml(getHeading(config));

  const message =
    escapeHtml(getMessage(config));

  const policyType =
    escapeHtml(
      policy.policyType ||
      policy.policyName ||
      policy.vehicleType ||
      "Insurance Policy"
    );

  const daysUntilExpiry =
    getDaysUntilExpiry(
      policy,
      new Date()
    );

  let statusLabel =
    "Renewal Reminder";

  let statusColor =
    "#1d4ed8";

  let statusBackground =
    "#eff6ff";

  if (config.type === "ON_EXPIRY") {
    statusLabel = "Expires Today";
    statusColor = "#b45309";
    statusBackground = "#fffbeb";
  } else if (config.type === "AFTER_EXPIRY") {
    statusLabel = "Action Required";
    statusColor = "#b91c1c";
    statusBackground = "#fef2f2";
  } else if (
    config.type === "BEFORE_EXPIRY" ||
    config.type === "LAST_N_DAYS" ||
    config.type === "RECURRING"
  ) {
    statusLabel = "Renewal Due Soon";
    statusColor = "#047857";
    statusBackground = "#ecfdf5";
  }

  const urgencyText =
    daysUntilExpiry > 0
      ? `${daysUntilExpiry} day${
          daysUntilExpiry === 1 ? "" : "s"
        } remaining`
      : daysUntilExpiry === 0
        ? "Expires today"
        : `${Math.abs(daysUntilExpiry)} day${
            Math.abs(daysUntilExpiry) === 1 ? "" : "s"
          } past expiry`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <meta
    name="color-scheme"
    content="light"
  />
  <title>Insurance Policy Renewal Reminder</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f3f6fa;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Arial,
        sans-serif;
      color: #172033;
      -webkit-font-smoothing: antialiased;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    img {
      border: 0;
      display: block;
      max-width: 100%;
    }

    .email-wrapper {
      width: 100%;
      padding: 32px 12px;
      background-color: #f3f6fa;
    }

    .email-container {
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e4e9f0;
      border-radius: 18px;
      overflow: hidden;
      box-shadow:
        0 10px 30px rgba(15, 23, 42, 0.07);
    }

    .header {
      background:
        linear-gradient(
          135deg,
          #123b70 0%,
          #1d5fa7 100%
        );
      padding: 28px 34px;
    }

    .brand {
      color: #ffffff;
      font-size: 18px;
      line-height: 1.3;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .brand-subtitle {
      margin-top: 5px;
      color: #dbeafe;
      font-size: 12px;
      line-height: 1.5;
    }

    .content {
      padding: 34px;
    }

    .eyebrow {
      margin: 0 0 10px;
      color: #1d5fa7;
      font-size: 12px;
      line-height: 1.4;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .heading {
      margin: 0;
      color: #111827;
      font-size: 28px;
      line-height: 1.25;
      font-weight: 750;
    }

    .greeting {
      margin: 22px 0 8px;
      color: #111827;
      font-size: 16px;
      line-height: 1.6;
    }

    .message {
      margin: 0;
      color: #526071;
      font-size: 15px;
      line-height: 1.75;
    }

    .status {
      margin-top: 24px;
      padding: 14px 16px;
      border-radius: 12px;
      background: ${statusBackground};
      border: 1px solid ${statusColor}22;
    }

    .status-label {
      color: ${statusColor};
      font-size: 13px;
      line-height: 1.4;
      font-weight: 750;
    }

    .status-detail {
      margin-top: 3px;
      color: #4b5563;
      font-size: 12px;
      line-height: 1.5;
    }

    .section-title {
      margin: 30px 0 12px;
      color: #111827;
      font-size: 15px;
      line-height: 1.5;
      font-weight: 700;
    }

    .details {
      width: 100%;
      border: 1px solid #e5eaf0;
      border-radius: 14px;
      overflow: hidden;
    }

    .detail-row {
      border-bottom: 1px solid #edf0f4;
    }

    .detail-row:last-child {
      border-bottom: 0;
    }

    .detail-label {
      width: 42%;
      padding: 14px 16px;
      background: #f8fafc;
      color: #667085;
      font-size: 13px;
      line-height: 1.5;
      vertical-align: top;
    }

    .detail-value {
      padding: 14px 16px;
      color: #1f2937;
      font-size: 13px;
      line-height: 1.5;
      font-weight: 650;
      vertical-align: top;
    }

    .expiry-card {
      margin-top: 18px;
      padding: 18px;
      border: 1px solid #dbeafe;
      border-radius: 14px;
      background: #f8fbff;
    }

    .expiry-label {
      color: #64748b;
      font-size: 12px;
      line-height: 1.4;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      font-weight: 700;
    }

    .expiry-date {
      margin-top: 5px;
      color: #123b70;
      font-size: 20px;
      line-height: 1.35;
      font-weight: 750;
    }

    .cta-wrap {
      margin-top: 28px;
      padding: 22px;
      border-radius: 14px;
      background: #f8fafc;
      border: 1px solid #e8edf3;
    }

    .cta-title {
      margin: 0;
      color: #172033;
      font-size: 15px;
      line-height: 1.5;
      font-weight: 700;
    }

    .cta-text {
      margin: 7px 0 0;
      color: #667085;
      font-size: 13px;
      line-height: 1.65;
    }

    .footer {
      padding: 24px 34px 30px;
      background: #f8fafc;
      border-top: 1px solid #edf0f4;
    }

    .footer-text {
      margin: 0;
      color: #667085;
      font-size: 12px;
      line-height: 1.7;
    }

    .footer-brand {
      margin-top: 12px;
      color: #123b70;
      font-size: 13px;
      line-height: 1.5;
      font-weight: 750;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 12px 8px;
      }

      .header {
        padding: 24px 22px;
      }

      .content {
        padding: 26px 20px;
      }

      .footer {
        padding: 22px 20px 26px;
      }

      .heading {
        font-size: 23px;
      }

      .detail-label,
      .detail-value {
        display: block;
        width: auto;
        padding: 10px 14px;
      }

      .detail-label {
        padding-bottom: 3px;
        border-bottom: 0;
      }

      .detail-value {
        padding-top: 3px;
      }
    }
  </style>
</head>

<body>
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <tr>
      <td class="email-wrapper">
        <table
          role="presentation"
          class="email-container"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
        >
          <!-- HEADER -->
          <tr>
            <td class="header">
              <div class="brand">
                Insurance Services
              </div>
              <div class="brand-subtitle">
                Policy protection &amp; renewal support
              </div>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td class="content">
              <p class="eyebrow">
                ${statusLabel}
              </p>

              <h1 class="heading">
                ${heading}
              </h1>

              <p class="greeting">
                Dear <strong>${customerName}</strong>,
              </p>

              <p class="message">
                ${message}
              </p>

              <div class="status">
                <div class="status-label">
                  ${statusLabel}
                </div>
                <div class="status-detail">
                  ${urgencyText}
                </div>
              </div>

              <div class="section-title">
                Policy Information
              </div>

              <table
                role="presentation"
                class="details"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr class="detail-row">
                  <td class="detail-label">
                    Policy Number
                  </td>
                  <td class="detail-value">
                    ${policyNumber}
                  </td>
                </tr>

                <tr class="detail-row">
                  <td class="detail-label">
                    Policy Type
                  </td>
                  <td class="detail-value">
                    ${policyType}
                  </td>
                </tr>

                <tr class="detail-row">
                  <td class="detail-label">
                    Vehicle Number
                  </td>
                  <td class="detail-value">
                    ${vehicleNumber}
                  </td>
                </tr>

                <tr class="detail-row">
                  <td class="detail-label">
                    Insurer
                  </td>
                  <td class="detail-value">
                    ${insurer}
                  </td>
                </tr>

                <tr class="detail-row">
                  <td class="detail-label">
                    Renewal Premium
                  </td>
                  <td class="detail-value">
                    ${premium}
                  </td>
                </tr>
              </table>

              <div class="expiry-card">
                <div class="expiry-label">
                  Policy Expiry Date
                </div>
                <div class="expiry-date">
                  ${expiryDate}
                </div>
              </div>

              <div class="cta-wrap">
                <p class="cta-title">
                  Keep your coverage active
                </p>

                <p class="cta-text">
                  Please review your policy details and
                  contact our insurance team if you would
                  like to proceed with renewal or need
                  assistance with your policy.
                </p>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer">
              <p class="footer-text">
                This is an automated policy reminder
                sent for your insurance records. Please
                do not reply to this email if your insurer
                requires communication through a specific
                support channel.
              </p>

              <div class="footer-brand">
                Insurance Team
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * ============================================================
 * GET DAYS UNTIL EXPIRY
 * ============================================================
 */

// const getDaysUntilExpiry = (
//   policy: any,
//   today: Date
// ): number => {
//   const expiryDate =
//     getPolicyExpiryDate(
//       policy.endDate
//     );

//   const difference =
//     expiryDate.getTime() -
//     today.getTime();

//   return Math.round(
//     difference /
//       MILLISECONDS_IN_DAY
//   );
// };


const getDaysUntilExpiry = (
  policy: any,
  today: Date
): number => {
  const expiryDate = getPolicyExpiryDate(policy.endDate);

  const todayKey = getIndiaDateString(today);
  const expiryKey = getIndiaDateString(expiryDate);

  const todayDate = createIndiaDate(todayKey);
  const expiryDateOnly = createIndiaDate(expiryKey);

  return Math.round(
    (expiryDateOnly.getTime() - todayDate.getTime()) /
      MILLISECONDS_IN_DAY
  );
};

/**
 * ============================================================
 * GET SCHEDULED DATE
 * ============================================================
 *
 * Returns today's date if reminder is due.
 *
 * EXPIRY BASED:
 *
 * BEFORE_EXPIRY
 * ON_EXPIRY
 * AFTER_EXPIRY
 * LAST_N_DAYS
 *
 * CALENDAR BASED:
 *
 * RECURRING
 *
 *   WEEKLY
 *   MONTHLY
 *   YEARLY
 */

// const getScheduledDateForConfig = (
//   policy: any,
//   config: NotificationConfig,
//   today: Date
// ): Date | null => {
//   /**
//    * ========================================================
//    * RECURRING
//    * ========================================================
//    *
//    * Recurring reminders are completely independent
//    * of policy expiry.
//    */

//   // if (
//   //   config.type ===
//   //   "RECURRING"
//   // ) {
//   //   const {
//   //     month,
//   //     day,
//   //   } = getIndiaDateParts(
//   //     today
//   //   );

//   //   /**
//   //    * ======================================================
//   //    * WEEKLY
//   //    * ======================================================
//   //    *
//   //    * Example:
//   //    *
//   //    * frequency = WEEKLY
//   //    * dayOfWeek = 1
//   //    *
//   //    * Every Monday.
//   //    */

//   //   if (
//   //     config.recurringFrequency ===
//   //     "WEEKLY"
//   //   ) {
//   //     const recurringDayOfWeek =
//   //       config.recurringDayOfWeek;

//   //     if (
//   //       recurringDayOfWeek ===
//   //         undefined ||
//   //       recurringDayOfWeek ===
//   //         null ||
//   //       recurringDayOfWeek < 0 ||
//   //       recurringDayOfWeek > 6
//   //     ) {
//   //       console.error(
//   //         `❌ Invalid WEEKLY recurring configuration: ${config.name}`
//   //       );

//   //       return null;
//   //     }

//   //     const todayDayOfWeek =
//   //       getIndiaDayOfWeek(
//   //         today
//   //       );

//   //     if (
//   //       todayDayOfWeek ===
//   //       recurringDayOfWeek
//   //     ) {
//   //       return today;
//   //     }

//   //     return null;
//   //   }

//   //   /**
//   //    * ======================================================
//   //    * MONTHLY
//   //    * ======================================================
//   //    *
//   //    * Example:
//   //    *
//   //    * frequency = MONTHLY
//   //    * dayOfMonth = 1
//   //    *
//   //    * Every 1st of the month.
//   //    */

//   //   if (
//   //     config.recurringFrequency ===
//   //     "MONTHLY"
//   //   ) {
//   //     const recurringDayOfMonth =
//   //       config.recurringDayOfMonth;

//   //     if (
//   //       recurringDayOfMonth ===
//   //         undefined ||
//   //       recurringDayOfMonth ===
//   //         null ||
//   //       recurringDayOfMonth < 1 ||
//   //       recurringDayOfMonth > 31
//   //     ) {
//   //       console.error(
//   //         `❌ Invalid MONTHLY recurring configuration: ${config.name}`
//   //       );

//   //       return null;
//   //     }

//   //     if (
//   //       day ===
//   //       recurringDayOfMonth
//   //     ) {
//   //       return today;
//   //     }

//   //     return null;
//   //   }

//   //   /**
//   //    * ======================================================
//   //    * YEARLY
//   //    * ======================================================
//   //    *
//   //    * Example:
//   //    *
//   //    * frequency = YEARLY
//   //    * month = 1
//   //    * dayOfMonth = 1
//   //    *
//   //    * Every January 1st.
//   //    */

//   //   if (
//   //     config.recurringFrequency ===
//   //     "YEARLY"
//   //   ) {
//   //     const recurringMonth =
//   //       config.recurringMonth;

//   //     const recurringDayOfMonth =
//   //       config.recurringDayOfMonth;

//   //     if (
//   //       recurringMonth ===
//   //         undefined ||
//   //       recurringMonth ===
//   //         null ||
//   //       recurringMonth < 1 ||
//   //       recurringMonth > 12
//   //     ) {
//   //       console.error(
//   //         `❌ Invalid YEARLY recurring month: ${config.name}`
//   //       );

//   //       return null;
//   //     }

//   //     if (
//   //       recurringDayOfMonth ===
//   //         undefined ||
//   //       recurringDayOfMonth ===
//   //         null ||
//   //       recurringDayOfMonth < 1 ||
//   //       recurringDayOfMonth > 31
//   //     ) {
//   //       console.error(
//   //         `❌ Invalid YEARLY recurring day: ${config.name}`
//   //       );

//   //       return null;
//   //     }

//   //     if (
//   //       month ===
//   //         recurringMonth &&
//   //       day ===
//   //         recurringDayOfMonth
//   //     ) {
//   //       return today;
//   //     }

//   //     return null;
//   //   }

//   //   console.error(
//   //     `❌ Invalid recurring frequency for config ${config.name}`
//   //   );

//   //   return null;
//   // }


  
// /**
//  * ========================================================
//  * RECURRING
//  * ========================================================
//  *
//  * Recurring notifications are sent only during the
//  * LAST CALENDAR MONTH before the policy expiry month.
//  *
//  * Example:
//  *
//  * Policy expiry:
//  * 30 September 2026
//  *
//  * Last month:
//  * September 2026
//  *
//  * If configured:
//  *
//  * Frequency = WEEKLY
//  * Day = SATURDAY
//  *
//  * Notifications:
//  *
//  * Saturday 05 Sep 2026  -> SEND
//  * Saturday 12 Sep 2026  -> SEND
//  * Saturday 19 Sep 2026  -> SEND
//  * Saturday 26 Sep 2026  -> SEND
//  *
//  * Outside the expiry month:
//  *
//  * Saturday 29 Aug 2026  -> NO
//  * Saturday 03 Oct 2026  -> NO
//  */
// if (
//   config.type ===
//   "RECURRING"
// ) {
//   const {
//     year: todayYear,
//     month: todayMonth,
//   } = getIndiaDateParts(
//     today
//   );

//   /**
//    * ======================================================
//    * GET POLICY EXPIRY DATE
//    * ======================================================
//    */

//   const expiryDate =
//     getPolicyExpiryDate(
//       policy.endDate
//     );

//   const {
//     year: expiryYear,
//     month: expiryMonth,
//   } = getIndiaDateParts(
//     expiryDate
//   );

//   console.log(
//     `🔁 Recurring check for policy ${policy.policyNumber}`
//   );

//   console.log(
//     `   Today: ${todayYear}-${String(
//       todayMonth
//     ).padStart(2, "0")}`
//   );

//   console.log(
//     `   Expiry: ${expiryYear}-${String(
//       expiryMonth
//     ).padStart(2, "0")}`
//   );

//   /**
//    * ======================================================
//    * CHECK LAST MONTH
//    * ======================================================
//    *
//    * Here "last month" means the calendar month in which
//    * the policy expires.
//    *
//    * Example:
//    *
//    * Expiry = September 2026
//    *
//    * Recurring reminders run during:
//    *
//    * September 2026
//    *
//    * NOT August 2026.
//    */

//   const isExpiryMonth =
//     todayYear === expiryYear &&
//     todayMonth === expiryMonth;

//   if (!isExpiryMonth) {
//     console.log(
//       "⏭️ Not in policy expiry month. Recurring reminder skipped."
//     );

//     return null;
//   }

//   /**
//    * ======================================================
//    * WEEKLY
//    * ======================================================
//    */

//   if (
//     config.recurringFrequency ===
//     "WEEKLY"
//   ) {
//     const recurringDayOfWeek =
//       config.recurringDayOfWeek;

//     if (
//       recurringDayOfWeek ===
//         undefined ||
//       recurringDayOfWeek ===
//         null ||
//       recurringDayOfWeek < 0 ||
//       recurringDayOfWeek > 6
//     ) {
//       console.error(
//         `❌ Invalid WEEKLY recurring configuration: ${config.name}`
//       );

//       return null;
//     }

//     const todayDayOfWeek =
//       getIndiaDayOfWeek(
//         today
//       );

//     console.log(
//       `   Today day of week: ${todayDayOfWeek}`
//     );

//     console.log(
//       `   Configured day of week: ${recurringDayOfWeek}`
//     );

//     /**
//      * Only send on configured weekday.
//      */

//     if (
//       todayDayOfWeek !==
//       recurringDayOfWeek
//     ) {
//       console.log(
//         "⏭️ Today is not the configured recurring day."
//       );

//       return null;
//     }

//     /**
//      * ====================================================
//      * DO NOT SEND AFTER POLICY EXPIRY
//      * ====================================================
//      *
//      * If expiry is before today, don't send.
//      */

//     const expiryDateKey =
//       getDateKey(
//         expiryDate
//       );

//     const todayDateKey =
//       getDateKey(
//         today
//       );

//     if (
//       todayDateKey >
//       expiryDateKey
//     ) {
//       console.log(
//         "⏭️ Policy has already expired. Recurring reminder skipped."
//       );

//       return null;
//     }

//     /**
//      * ====================================================
//      * SEND
//      * ====================================================
//      */

//     console.log(
//       "🔔 RECURRING WEEKLY REMINDER IS DUE"
//     );

//     console.log(
//       `   Policy: ${policy.policyNumber}`
//     );

//     console.log(
//       `   Expiry: ${expiryDateKey}`
//     );

//     console.log(
//       `   Today: ${todayDateKey}`
//     );

//     console.log(
//       `   Day: ${todayDayOfWeek}`
//     );

//     return today;
//   }

//   /**
//    * ======================================================
//    * MONTHLY
//    * ======================================================
//    *
//    * Monthly recurring reminders are also restricted to
//    * the policy expiry month.
//    */

//   if (
//     config.recurringFrequency ===
//     "MONTHLY"
//   ) {
//     const recurringDayOfMonth =
//       config.recurringDayOfMonth;

//     if (
//       recurringDayOfMonth ===
//         undefined ||
//       recurringDayOfMonth ===
//         null ||
//       recurringDayOfMonth < 1 ||
//       recurringDayOfMonth > 31
//     ) {
//       console.error(
//         `❌ Invalid MONTHLY recurring configuration: ${config.name}`
//       );

//       return null;
//     }

//     if (
//       today.getUTCDate() !==
//       recurringDayOfMonth
//     ) {
//       return null;
//     }

//     /**
//      * Never schedule after expiry.
//      */

//     if (
//       getDateKey(today) >
//       getDateKey(expiryDate)
//     ) {
//       return null;
//     }

//     return today;
//   }

//   /**
//    * ======================================================
//    * YEARLY
//    * ======================================================
//    *
//    * Yearly reminders are also restricted to the
//    * expiry month.
//    */

//   if (
//     config.recurringFrequency ===
//     "YEARLY"
//   ) {
//     const recurringMonth =
//       config.recurringMonth;

//     const recurringDayOfMonth =
//       config.recurringDayOfMonth;

//     if (
//       recurringMonth ===
//         undefined ||
//       recurringMonth ===
//         null ||
//       recurringMonth < 1 ||
//       recurringMonth > 12
//     ) {
//       console.error(
//         `❌ Invalid YEARLY recurring month: ${config.name}`
//       );

//       return null;
//     }

//     if (
//       recurringDayOfMonth ===
//         undefined ||
//       recurringDayOfMonth ===
//         null ||
//       recurringDayOfMonth < 1 ||
//       recurringDayOfMonth > 31
//     ) {
//       console.error(
//         `❌ Invalid YEARLY recurring day: ${config.name}`
//       );

//       return null;
//     }

//     if (
//       todayMonth !==
//         recurringMonth ||
//       todayYear !==
//         expiryYear ||
//       today.getUTCDate() !==
//         recurringDayOfMonth
//     ) {
//       return null;
//     }

//     if (
//       getDateKey(today) >
//       getDateKey(expiryDate)
//     ) {
//       return null;
//     }

//     return today;
//   }

//   console.error(
//     `❌ Invalid recurring frequency for config ${config.name}`
//   );

//   return null;
// }



//   /**
//    * ========================================================
//    * EXPIRY BASED REMINDERS
//    * ========================================================
//    */

//   const daysUntilExpiry =
//     getDaysUntilExpiry(
//       policy,
//       today
//     );

//   /**
//    * ========================================================
//    * BEFORE EXPIRY
//    * ========================================================
//    */

//   if (
//     config.type ===
//     "BEFORE_EXPIRY"
//   ) {
//     const daysBefore =
//       config.daysBeforeExpiry;

//     if (
//       daysBefore ===
//         undefined ||
//       daysBefore ===
//         null ||
//       daysBefore < 1
//     ) {
//       return null;
//     }

//     if (
//       daysUntilExpiry ===
//       daysBefore
//     ) {
//       return today;
//     }

//     return null;
//   }

//   /**
//    * ========================================================
//    * ON EXPIRY
//    * ========================================================
//    */

//   if (
//     config.type ===
//     "ON_EXPIRY"
//   ) {
//     if (
//       daysUntilExpiry === 0
//     ) {
//       return today;
//     }

//     return null;
//   }

//   /**
//    * ========================================================
//    * AFTER EXPIRY
//    * ========================================================
//    */

//   if (
//     config.type ===
//     "AFTER_EXPIRY"
//   ) {
//     const daysAfter =
//       config.daysAfterExpiry;

//     if (
//       daysAfter ===
//         undefined ||
//       daysAfter ===
//         null ||
//       daysAfter < 1
//     ) {
//       return null;
//     }

//     if (
//       daysUntilExpiry ===
//       -daysAfter
//     ) {
//       return today;
//     }

//     return null;
//   }

//   /**
//    * ========================================================
//    * LAST N DAYS
//    * ========================================================
//    *
//    * Example:
//    *
//    * lastNDays = 3
//    * expiry = 30 Aug
//    *
//    * Sends:
//    *
//    * 28 Aug
//    * 29 Aug
//    * 30 Aug
//    */

//   if (
//     config.type ===
//     "LAST_N_DAYS"
//   ) {
//     const lastNDays =
//       config.lastNDays;

//     if (
//       lastNDays ===
//         undefined ||
//       lastNDays ===
//         null ||
//       lastNDays < 1
//     ) {
//       return null;
//     }

//     if (
//       daysUntilExpiry >= 0 &&
//       daysUntilExpiry <
//         lastNDays
//     ) {
//       return today;
//     }

//     return null;
//   }

//   return null;
// };


const getScheduledDateForConfig = (
  policy: any,
  config: NotificationConfig,
  today: Date
): Date | null => {
  /**
   * ========================================================
   * RECURRING
   * ========================================================
   *
   * Recurring notifications are sent only during the
   * LAST 30 DAYS before policy expiry.
   *
   * Example:
   *
   * Policy expiry = 11 March 2027
   *
   * WEEKLY / SATURDAY:
   *
   * 20 Feb 2027 -> 19 days remaining -> SEND
   * 27 Feb 2027 -> 12 days remaining -> SEND
   * 06 Mar 2027 ->  5 days remaining -> SEND
   *
   * Outside last 30 days:
   *
   * 08 Feb 2027 -> 31 days remaining -> NO
   *
   * After expiry:
   *
   * 12 Mar 2027 -> -1 day -> NO
   */

  if (config.type === "RECURRING") {
    /**
     * ======================================================
     * GET POLICY EXPIRY DATE
     * ======================================================
     */

    const expiryDate = getPolicyExpiryDate(
      policy.endDate
    );

    const expiryDateKey = getDateKey(
      expiryDate
    );

    const todayDateKey = getDateKey(
      today
    );

    /**
     * ======================================================
     * GET DAYS UNTIL EXPIRY
     * ======================================================
     */

    const daysUntilExpiry =
      getDaysUntilExpiry(
        policy,
        today
      );

    console.log(
      `🔁 Recurring check for policy ${policy.policyNumber}`
    );

    console.log(
      `   Today: ${todayDateKey}`
    );

    console.log(
      `   Expiry: ${expiryDateKey}`
    );

    console.log(
      `   Days until expiry: ${daysUntilExpiry}`
    );

    /**
     * ======================================================
     * LAST 30 DAYS CHECK
     * ======================================================
     *
     * Eligible:
     *
     *   30 days before expiry
     *   through expiry day
     *
     * Not eligible:
     *
     *   More than 30 days before expiry
     *   OR
     *   after expiry
     */

    if (
      daysUntilExpiry < 0 ||
      daysUntilExpiry > 30
    ) {
      console.log(
        "⏭️ Outside last 30 days before policy expiry. Recurring reminder skipped."
      );

      return null;
    }

    /**
     * ======================================================
     * WEEKLY
     * ======================================================
     */

    if (
      config.recurringFrequency ===
      "WEEKLY"
    ) {
      const recurringDayOfWeek =
        config.recurringDayOfWeek;

      /**
       * Validate configured weekday.
       *
       * 0 = Sunday
       * 1 = Monday
       * 2 = Tuesday
       * 3 = Wednesday
       * 4 = Thursday
       * 5 = Friday
       * 6 = Saturday
       */

      if (
        recurringDayOfWeek ===
          undefined ||
        recurringDayOfWeek ===
          null ||
        recurringDayOfWeek < 0 ||
        recurringDayOfWeek > 6
      ) {
        console.error(
          `❌ Invalid WEEKLY recurring configuration: ${config.name}`
        );

        return null;
      }

      /**
       * Get today's weekday using India timezone.
       */

      const todayDayOfWeek =
        getIndiaDayOfWeek(
          today
        );

      console.log(
        `   Today day of week: ${todayDayOfWeek}`
      );

      console.log(
        `   Configured day of week: ${recurringDayOfWeek}`
      );

      /**
       * Only send on configured weekday.
       */

      if (
        todayDayOfWeek !==
        recurringDayOfWeek
      ) {
        console.log(
          "⏭️ Today is not the configured recurring day."
        );

        return null;
      }

      /**
       * ====================================================
       * RECURRING WEEKLY REMINDER IS DUE
       * ====================================================
       */

      console.log(
        "🔔 RECURRING WEEKLY REMINDER IS DUE"
      );

      console.log(
        `   Policy: ${policy.policyNumber}`
      );

      console.log(
        `   Expiry: ${expiryDateKey}`
      );

      console.log(
        `   Today: ${todayDateKey}`
      );

      console.log(
        `   Days remaining: ${daysUntilExpiry}`
      );

      console.log(
        `   Day of week: ${todayDayOfWeek}`
      );

      return today;
    }

    /**
     * ======================================================
     * MONTHLY
     * ======================================================
     *
     * Monthly recurring notifications are also restricted
     * to the last 30 days before expiry.
     *
     * Example:
     *
     * recurringDayOfMonth = 20
     * expiry = 11 March
     *
     * If 20 Feb is within the last 30 days:
     * -> SEND
     */

    if (
      config.recurringFrequency ===
      "MONTHLY"
    ) {
      const recurringDayOfMonth =
        config.recurringDayOfMonth;

      /**
       * Validate configured day.
       */

      if (
        recurringDayOfMonth ===
          undefined ||
        recurringDayOfMonth ===
          null ||
        recurringDayOfMonth < 1 ||
        recurringDayOfMonth > 31
      ) {
        console.error(
          `❌ Invalid MONTHLY recurring configuration: ${config.name}`
        );

        return null;
      }

      /**
       * Get today's India calendar day.
       */

      const {
        day: todayDay,
      } = getIndiaDateParts(
        today
      );

      /**
       * Only send on configured day of month.
       */

      if (
        todayDay !==
        recurringDayOfMonth
      ) {
        console.log(
          "⏭️ Today is not the configured recurring day of month."
        );

        return null;
      }

      console.log(
        "🔔 RECURRING MONTHLY REMINDER IS DUE"
      );

      console.log(
        `   Policy: ${policy.policyNumber}`
      );

      console.log(
        `   Expiry: ${expiryDateKey}`
      );

      console.log(
        `   Today: ${todayDateKey}`
      );

      console.log(
        `   Days remaining: ${daysUntilExpiry}`
      );

      return today;
    }

    /**
     * ======================================================
     * YEARLY
     * ======================================================
     *
     * Yearly recurring notifications are restricted to
     * the last 30 days before expiry.
     */

    if (
      config.recurringFrequency ===
      "YEARLY"
    ) {
      const recurringMonth =
        config.recurringMonth;

      const recurringDayOfMonth =
        config.recurringDayOfMonth;

      /**
       * Validate month.
       */

      if (
        recurringMonth ===
          undefined ||
        recurringMonth ===
          null ||
        recurringMonth < 1 ||
        recurringMonth > 12
      ) {
        console.error(
          `❌ Invalid YEARLY recurring month: ${config.name}`
        );

        return null;
      }

      /**
       * Validate day.
       */

      if (
        recurringDayOfMonth ===
          undefined ||
        recurringDayOfMonth ===
          null ||
        recurringDayOfMonth < 1 ||
        recurringDayOfMonth > 31
      ) {
        console.error(
          `❌ Invalid YEARLY recurring day: ${config.name}`
        );

        return null;
      }

      /**
       * Get India date parts.
       */

      const {
        year: todayYear,
        month: todayMonth,
        day: todayDay,
      } = getIndiaDateParts(
        today
      );

      const {
        year: expiryYear,
      } = getIndiaDateParts(
        expiryDate
      );

      /**
       * Match configured month/day and expiry year.
       */

      if (
        todayMonth !==
          recurringMonth ||
        todayYear !==
          expiryYear ||
        todayDay !==
          recurringDayOfMonth
      ) {
        console.log(
          "⏭️ Today does not match yearly recurring configuration."
        );

        return null;
      }

      console.log(
        "🔔 RECURRING YEARLY REMINDER IS DUE"
      );

      console.log(
        `   Policy: ${policy.policyNumber}`
      );

      console.log(
        `   Expiry: ${expiryDateKey}`
      );

      console.log(
        `   Today: ${todayDateKey}`
      );

      console.log(
        `   Days remaining: ${daysUntilExpiry}`
      );

      return today;
    }

    /**
     * ======================================================
     * INVALID FREQUENCY
     * ======================================================
     */

    console.error(
      `❌ Invalid recurring frequency for config ${config.name}`
    );

    return null;
  }

  /**
   * ========================================================
   * EXPIRY BASED REMINDERS
   * ========================================================
   */

  const daysUntilExpiry =
    getDaysUntilExpiry(
      policy,
      today
    );

  /**
   * ========================================================
   * BEFORE EXPIRY
   * ========================================================
   */

  if (
    config.type ===
    "BEFORE_EXPIRY"
  ) {
    const daysBefore =
      config.daysBeforeExpiry;

    if (
      daysBefore ===
        undefined ||
      daysBefore ===
        null ||
      daysBefore < 1
    ) {
      return null;
    }

    if (
      daysUntilExpiry ===
      daysBefore
    ) {
      return today;
    }

    return null;
  }

  /**
   * ========================================================
   * ON EXPIRY
   * ========================================================
   */

  if (
    config.type ===
    "ON_EXPIRY"
  ) {
    if (
      daysUntilExpiry ===
      0
    ) {
      return today;
    }

    return null;
  }

  /**
   * ========================================================
   * AFTER EXPIRY
   * ========================================================
   */

  if (
    config.type ===
    "AFTER_EXPIRY"
  ) {
    const daysAfter =
      config.daysAfterExpiry;

    if (
      daysAfter ===
        undefined ||
      daysAfter ===
        null ||
      daysAfter < 1
    ) {
      return null;
    }

    if (
      daysUntilExpiry ===
      -daysAfter
    ) {
      return today;
    }

    return null;
  }

  /**
   * ========================================================
   * LAST N DAYS
   * ========================================================
   *
   * Example:
   *
   * lastNDays = 3
   * expiry = 30 Aug
   *
   * Sends:
   *
   * 28 Aug
   * 29 Aug
   * 30 Aug
   */

  if (
    config.type ===
    "LAST_N_DAYS"
  ) {
    const lastNDays =
      config.lastNDays;

    if (
      lastNDays ===
        undefined ||
      lastNDays ===
        null ||
      lastNDays < 1
    ) {
      return null;
    }

    // if (
    //   daysUntilExpiry >= 0 &&
    //   daysUntilExpiry <
    //     lastNDays
    // ) {
    //   return today;
    // }


    if (
  daysUntilExpiry >= 0 &&
  daysUntilExpiry <= lastNDays - 1
) {
  return today;
    }
    
    return null;
  }

  return null;
};

/**
 * ============================================================
 * GET CONFIGURATION VALUE
 * ============================================================
 *
 * Used by expiry-based notifications.
 *
 * RECURRING schedules do not use scheduleValue.
 */

const getScheduleValue = (
  config: NotificationConfig
): number | undefined => {
  switch (config.type) {
    case "BEFORE_EXPIRY":
      return config.daysBeforeExpiry;

    case "AFTER_EXPIRY":
      return config.daysAfterExpiry;

    case "LAST_N_DAYS":
      return config.lastNDays;

    case "ON_EXPIRY":
      return undefined;

    case "RECURRING":
      return undefined;

    default:
      return undefined;
  }
};

/**
 * ============================================================
 * GET / CREATE NOTIFICATION CYCLE ID
 * ============================================================
 *
 * Used by expiry-based notifications.
 *
 * Recurring notifications do NOT depend on the cycle
 * for their unique identity, but we still maintain the
 * cycle ID in the notification document for historical
 * consistency.
 */

const getNotificationCycleId =
  async (
    policy: any
  ): Promise<Types.ObjectId> => {
    /**
     * Existing cycle
     */

    if (
      policy.notificationCycleId
    ) {
      return new Types.ObjectId(
        policy.notificationCycleId
      );
    }

    /**
     * Legacy policy without cycle ID.
     */

    const newCycleId =
      new Types.ObjectId();

    console.log(
      `🆕 Creating notification cycle for legacy policy ${policy.policyNumber}`
    );

    console.log(
      `   Cycle ID: ${newCycleId.toString()}`
    );

    await Policy.updateOne(
      {
        _id: policy._id,
      },
      {
        $set: {
          notificationCycleId:
            newCycleId,
        },
      }
    );

    /**
     * Update local policy object.
     */

    policy.notificationCycleId =
      newCycleId;

    return newCycleId;
  };

/**
 * ============================================================
 * BUILD NOTIFICATION QUERY
 * ============================================================
 *
 * EXPIRY BASED:
 *
 * policyId
 * +
 * notificationCycleId
 * +
 * reminderConfigId
 * +
 * expiryDate
 * +
 * scheduleType
 * +
 * scheduledDate
 *
 *
 * RECURRING:
 *
 * policyId
 * +
 * reminderConfigId
 * +
 * scheduleType
 * +
 * scheduledDate
 *
 *
 * This means:
 *
 * Every Monday:
 *
 * 2026-09-07 -> one notification
 * 2026-09-14 -> another notification
 * 2026-09-21 -> another notification
 *
 * A policy renewal does not create a duplicate
 * notification for the same calendar date.
 */

const buildNotificationQuery = (
  policy: any,
  config: NotificationConfig,
  notificationCycleId: Types.ObjectId,
  expiryDate: Date,
  scheduledDate: Date,
  scheduleValue?: number
) => {
  if (config.type === "RECURRING") {
    return {
      policyId: policy._id,

      notificationCycleId,

      reminderConfigId: config._id,

      scheduleType: config.type,

      scheduledDate,
    };
  }

  const query: any = {
    policyId: policy._id,

    notificationCycleId,

    reminderConfigId: config._id,

    expiryDate,

    scheduleType: config.type,

    scheduledDate,
  };

  if (scheduleValue !== undefined) {
    query.scheduleValue = scheduleValue;
  }

  return query;
};

/**
 * ============================================================
 * PROCESS ONE NOTIFICATION
 * ============================================================
 */

const processNotification =
  async (
    policy: any,
    config: NotificationConfig,
    scheduledDate: Date,
    notificationCycleId: Types.ObjectId
  ): Promise<void> => {
    /**
     * ========================================================
     * RECIPIENT
     * ========================================================
     */

    const recipientEmail =
      typeof policy.email ===
        "string" &&
      policy.email.trim()
        ? policy.email
            .toLowerCase()
            .trim()
        : null;

    if (!recipientEmail) {
      console.log(
        `⚠️ No email for policy ${policy.policyNumber}. Skipping.`
      );

      return;
    }

    /**
     * ========================================================
     * EXPIRY DATE SNAPSHOT
     * ========================================================
     *
     * Still stored for recurring notifications as historical
     * policy information.
     */

    const expiryDate =
      getPolicyExpiryDate(
        policy.endDate
      );

    /**
     * ========================================================
     * SUBJECT
     * ========================================================
     */

    const subject =
      buildSubject(
        config,
        policy.customerName
      );

    /**
     * ========================================================
     * SCHEDULE VALUE
     * ========================================================
     */

    const scheduleValue =
      getScheduleValue(
        config
      );

    /**
     * ========================================================
     * NOTIFICATION QUERY
     * ========================================================
     */

    const notificationQuery =
      buildNotificationQuery(
        policy,
        config,
        notificationCycleId,
        expiryDate,
        scheduledDate,
        scheduleValue
      );

    /**
     * ========================================================
     * LOG LOOKUP
     * ========================================================
     */

    console.log(
      "🔎 Notification lookup:"
    );

    console.log(
      JSON.stringify(
        {
          policyId:
            policy._id?.toString(),

          notificationCycleId:
            notificationCycleId.toString(),

          reminderConfigId:
            config._id?.toString(),

          expiryDate:
            expiryDate.toISOString(),

          scheduleType:
            config.type,

          scheduleValue,

          scheduledDate:
            scheduledDate.toISOString(),

          identity:
            config.type ===
            "RECURRING"
              ? "policyId + reminderConfigId + scheduleType + scheduledDate"
              : "policyId + notificationCycleId + reminderConfigId + expiryDate + scheduleType + scheduledDate",
        },
        null,
        2
      )
    );

    /**
     * ========================================================
     * FIND EXISTING NOTIFICATION
     * ========================================================
     */

    let notification =
      await PolicyNotification.findOne(
        notificationQuery
      );

    /**
     * ========================================================
     * CREATE NOTIFICATION
     * ========================================================
     */

    if (!notification) {
      console.log(
        "🆕 Notification does not exist. Creating..."
      );

      try {
        notification =
          await PolicyNotification.create(
            {
              policyId:
                policy._id,

              /**
               * For recurring notifications this cycle
               * is retained as historical information.
               *
               * It is NOT part of the recurring identity.
               */
              notificationCycleId,

              reminderConfigId:
                config._id,

              expiryDate,

              scheduleType:
                config.type as PolicyNotificationScheduleType,

              scheduleValue,

              scheduledDate,

              subject,

              email: {
                recipient:
                  recipientEmail,

                status:
                  "PENDING",

                attempts: 0,
              },
            }
          );

        console.log(
          "✅ Notification document created:"
        );

        console.log(
          `   Notification ID: ${notification._id}`
        );

        console.log(
          `   Cycle ID: ${notificationCycleId.toString()}`
        );

        console.log(
          `   Type: ${config.type}`
        );

        console.log(
          `   Scheduled: ${getDateKey(
            scheduledDate
          )}`
        );

        console.log(
          `   Expiry: ${getDateKey(
            expiryDate
          )}`
        );
      } catch (
        error: any
      ) {
        /**
         * ====================================================
         * DUPLICATE KEY
         * ====================================================
         */

        if (
          error?.code === 11000
        ) {
          console.log(
            "ℹ️ Notification already exists due to duplicate index. Loading existing document..."
          );

          notification =
            await PolicyNotification.findOne(
              notificationQuery
            );

          if (
            !notification
          ) {
            console.error(
              "❌ Duplicate key was reported, but notification could not be found."
            );

            console.error(
              "Duplicate error:",
              error
            );

            return;
          }
        } else {
          /**
           * ==================================================
           * DO NOT HIDE DATABASE ERRORS
           * ==================================================
           */

          console.error(
            "❌ PolicyNotification.create() failed"
          );

          console.error(
            "❌ Error name:",
            error?.name
          );

          console.error(
            "❌ Error message:",
            error?.message
          );

          console.error(
            "❌ Error code:",
            error?.code
          );

          console.error(
            "❌ Full Mongo/Mongoose error:",
            error
          );

          throw error;
        }
      }
    }

    /**
     * ========================================================
     * SAFETY CHECK
     * ========================================================
     */

    if (!notification) {
      console.error(
        `❌ Could not create/find notification for ${policy.policyNumber}`
      );

      return;
    }

    /**
     * ========================================================
     * EMAIL OBJECT
     * ========================================================
     */

    if (!notification.email) {
      notification.email = {
        recipient:
          recipientEmail,

        status:
          "PENDING",

        attempts: 0,
      };
    }

    /**
     * ========================================================
     * UPDATE RECIPIENT
     * ========================================================
     */

    if (
      notification.email
        .recipient !==
      recipientEmail
    ) {
      notification.email
        .recipient =
        recipientEmail;

      /**
       * Do not reset SENT.
       */

      if (
        notification.email
          .status !==
        "SENT"
      ) {
        notification.email
          .status =
          "PENDING";
      }
    }

    /**
     * ========================================================
     * UPDATE SUBJECT
     * ========================================================
     */

    notification.subject =
      subject;

    /**
     * ========================================================
     * SAVE BEFORE SEND
     * ========================================================
     */

    await notification.save();

    /**
     * ========================================================
     * ALREADY SENT
     * ========================================================
     */

    if (
      notification.email
        .status ===
      "SENT"
    ) {
      console.log(
        `⏭️ Already sent: ${config.name} | ` +
        `${config.type} | ` +
        `value=${scheduleValue} | ` +
        `policy=${policy.policyNumber} | ` +
        `cycle=${notificationCycleId.toString()} | ` +
        `date=${getDateKey(
          scheduledDate
        )} | ` +
        `expiry=${getDateKey(
          expiryDate
        )}`
      );

      return;
    }

    /**
     * ========================================================
     * SEND EMAIL
     * ========================================================
     */

    try {
      /**
       * ====================================================
       * UPDATE ATTEMPT
       * ====================================================
       */

      notification.email.attempts +=
        1;

      notification.email
        .lastAttemptAt =
        new Date();

      notification.email.status =
        "PROCESSING";

      notification.email
        .errorMessage =
        undefined;

      await notification.save();

      /**
       * ====================================================
       * BUILD HTML
       * ====================================================
       */

      const html =
        buildEmailHtml(
          config,
          policy
        );

      /**
       * ====================================================
       * SEND EMAIL
       * ====================================================
       */

      console.log(
        "📨 Sending email..."
      );

      console.log(
        `   To: ${recipientEmail}`
      );

      console.log(
        `   Subject: ${subject}`
      );

      console.log(
        `   Type: ${config.type}`
      );

      console.log(
        `   Cycle: ${notificationCycleId.toString()}`
      );

      console.log(
        `   Scheduled: ${getDateKey(
          scheduledDate
        )}`
      );

      const mailInfo =
        await sendMail(
          recipientEmail,

          subject,

          `Policy notification for ${policy.customerName}`,

          html
        );

      /**
       * ====================================================
       * SUCCESS
       * ====================================================
       */

      notification.email.status =
        "SENT";

      notification.email.sentAt =
        new Date();

      notification.email.messageId =
        mailInfo?.messageId;

      notification.email
        .errorMessage =
        undefined;

      await notification.save();

      /**
       * ====================================================
       * SUCCESS LOG
       * ====================================================
       */

      console.log(
        "========================================"
      );

      console.log(
        "✅ EMAIL SENT SUCCESSFULLY"
      );

      console.log(
        `📧 To: ${notification.email.recipient}`
      );

      console.log(
        `🆔 Message ID: ${
          mailInfo?.messageId ||
          "N/A"
        }`
      );

      console.log(
        `🔄 Notification Cycle: ${notificationCycleId.toString()}`
      );

      console.log(
        `📌 Type: ${config.type}`
      );

      console.log(
        `📅 Scheduled: ${getDateKey(
          scheduledDate
        )}`
      );

      console.log(
        `📅 Expiry: ${getDateKey(
          expiryDate
        )}`
      );

      console.log(
        `📬 Response: ${
          mailInfo?.response ||
          "N/A"
        }`
      );

      console.log(
        "========================================"
      );
    } catch (
      error: any
    ) {
      /**
       * ====================================================
       * EMAIL FAILED
       * ====================================================
       */

      notification.email.status =
        "FAILED";

      notification.email
        .errorMessage =
        error?.message ||
        "Unknown email sending error";

      notification.email
        .lastAttemptAt =
        new Date();

      await notification.save();

      console.error(
        "========================================"
      );

      console.error(
        "❌ EMAIL SEND FAILED"
      );

      console.error(
        `📧 To: ${notification.email.recipient}`
      );

      console.error(
        `🔄 Cycle: ${notificationCycleId.toString()}`
      );

      console.error(
        `📌 Type: ${config.type}`
      );

      console.error(
        `📅 Scheduled: ${getDateKey(
          scheduledDate
        )}`
      );

      console.error(
        `❌ Error: ${
          error?.message ||
          "Unknown error"
        }`
      );

      console.error(
        "========================================"
      );

      /**
       * Continue processing other notifications.
       */
    }

    /**
     * ========================================================
     * FINAL STATUS
     * ========================================================
     */

    console.log(
      `📊 ${config.name} completed for ${policy.policyNumber} | ` +
      `Type: ${config.type} | ` +
      `Cycle: ${notificationCycleId.toString()} | ` +
      `Email: ${
        notification.email
          ?.status ||
        "N/A"
      }`
    );
  };

/**
 * ============================================================
 * PROCESS POLICY EXPIRY EMAILS
 * ============================================================
 */

export const processPolicyExpiryEmails =
  async (): Promise<void> => {
    console.log(
      "========================================"
    );

    console.log(
      "📧 Dynamic policy expiry email job started"
    );

    console.log(
      "========================================"
    );

    try {
      /**
       * ======================================================
       * CURRENT SERVER TIME
       * ======================================================
       */

      const now =
        new Date();

      console.log(
        "🕐 SERVER NOW:",
        now.toISOString()
      );

      /**
       * ======================================================
       * INDIA DATE
       * ======================================================
       */

      const indiaDateString =
        getIndiaDateString(
          now
        );

      console.log(
        "🇮🇳 INDIA DATE:",
        indiaDateString
      );

      /**
       * ======================================================
       * TODAY
       * ======================================================
       */

      const today =
        createIndiaDate(
          indiaDateString
        );

      console.log(
        "📅 TODAY:",
        today.toISOString()
      );

      /**
       * ======================================================
       * LOAD ACTIVE CONFIGURATIONS
       * ======================================================
       */

      const configs =
        await PolicyNotificationConfig.find(
          {
            enabled: true,
          }
        )
          .sort({
            createdAt: 1,
          })
          .lean();

      console.log(
        `⚙️ Active reminder configurations: ${configs.length}`
      );

      /**
       * ======================================================
       * NO CONFIGURATION
       * ======================================================
       */

      if (
        configs.length === 0
      ) {
        console.log(
          "ℹ️ No active reminder configurations found."
        );

        return;
      }

      /**
       * ======================================================
       * LOAD ACTIVE POLICIES
       * ======================================================
       */

      const policies =
        await Policy.find(
          {
            isActive: true,

            email: {
              $exists: true,

              $ne: "",
            },
          }
        ).lean();

      console.log(
        `📋 Active policies with email: ${policies.length}`
      );

      /**
       * ======================================================
       * PROCESS EACH POLICY
       * ======================================================
       */

      for (
        const policy of policies
      ) {
        console.log(
          "========================================"
        );

        console.log(
          `📋 Processing policy: ${policy.policyNumber}`
        );

        console.log(
          `👤 Customer: ${policy.customerName}`
        );

        console.log(
          `📅 Policy end date: ${formatExpiryDate(
            policy.endDate
          )}`
        );

        /**
         * ====================================================
         * GET NOTIFICATION CYCLE
         * ====================================================
         *
         * This remains available for expiry-based
         * notifications.
         *
         * Recurring notifications do not use the cycle
         * as part of their unique identity.
         */

        const notificationCycleId =
          await getNotificationCycleId(
            policy
          );

        console.log(
          `🔄 Notification Cycle ID: ${notificationCycleId.toString()}`
        );

        /**
         * ====================================================
         * EXPIRY SNAPSHOT
         * ====================================================
         */

        const expiryDate =
          getPolicyExpiryDate(
            policy.endDate
          );

        console.log(
          `📅 Policy expiry snapshot: ${getDateKey(
            expiryDate
          )}`
        );

        /**
         * ====================================================
         * DAYS UNTIL EXPIRY
         * ====================================================
         *
         * This is useful for expiry-based reminders.
         *
         * RECURRING reminders ignore this value.
         */

        const daysUntilExpiry =
          getDaysUntilExpiry(
            policy,
            today
          );

        console.log(
          `📊 Days until expiry: ${daysUntilExpiry}`
        );

        /**
         * ====================================================
         * PROCESS EACH CONFIGURATION
         * ====================================================
         */

        for (
          const config of configs
        ) {
          console.log(
            "----------------------------------------"
          );

          console.log(
            `🔎 Checking reminder: ${config.name}`
          );

          console.log(
            `🆔 Config ID: ${config._id}`
          );

          console.log(
            `📌 Type: ${config.type}`
          );

          /**
           * ==================================================
           * EXPIRY CONFIG LOGGING
           * ==================================================
           */

          if (
            config.type ===
            "BEFORE_EXPIRY"
          ) {
            console.log(
              `📅 Days before expiry: ${config.daysBeforeExpiry}`
            );
          }

          if (
            config.type ===
            "AFTER_EXPIRY"
          ) {
            console.log(
              `📅 Days after expiry: ${config.daysAfterExpiry}`
            );
          }

          if (
            config.type ===
            "LAST_N_DAYS"
          ) {
            console.log(
              `📅 Last N days: ${config.lastNDays}`
            );
          }

          /**
           * ==================================================
           * RECURRING CONFIG LOGGING
           * ==================================================
           */

          if (
            config.type ===
            "RECURRING"
          ) {
            console.log(
              `🔁 Recurring frequency: ${config.recurringFrequency}`
            );

            if (
              config.recurringFrequency ===
              "WEEKLY"
            ) {
              console.log(
                `📅 Recurring day of week: ${config.recurringDayOfWeek}`
              );
            }

            if (
              config.recurringFrequency ===
              "MONTHLY"
            ) {
              console.log(
                `📅 Recurring day of month: ${config.recurringDayOfMonth}`
              );
            }

            if (
              config.recurringFrequency ===
              "YEARLY"
            ) {
              console.log(
                `📅 Recurring month: ${config.recurringMonth}`
              );

              console.log(
                `📅 Recurring day of month: ${config.recurringDayOfMonth}`
              );
            }
          }

          /**
           * ==================================================
           * CALCULATE SCHEDULE
           * ==================================================
           */

          const scheduledDate =
            getScheduledDateForConfig(
              policy,
              config,
              today
            );

          /**
           * ==================================================
           * NOT DUE TODAY
           * ==================================================
           */

          if (
            !scheduledDate
          ) {
            console.log(
              "⏭️ Reminder not due today."
            );

            continue;
          }

          /**
           * ==================================================
           * REMINDER IS DUE
           * ==================================================
           */

          console.log(
            "📧 Reminder due"
          );

          console.log(
            `   Policy: ${policy.policyNumber}`
          );

          console.log(
            `   Customer: ${policy.customerName}`
          );

          console.log(
            `   Config: ${config.name}`
          );

          console.log(
            `   Type: ${config.type}`
          );

          console.log(
            `   Frequency: ${
              config.type ===
              "RECURRING"
                ? config.recurringFrequency ||
                  "N/A"
                : "N/A"
            }`
          );

          console.log(
            `   Schedule Value: ${
              getScheduleValue(
                config
              ) ?? "N/A"
            }`
          );

          console.log(
            `   Scheduled: ${getDateKey(
              scheduledDate
            )}`
          );

          console.log(
            `   Expiry: ${getDateKey(
              expiryDate
            )}`
          );

          console.log(
            `   Cycle: ${notificationCycleId.toString()}`
          );

          /**
           * ==================================================
           * PROCESS NOTIFICATION
           * ==================================================
           */

          await processNotification(
            policy,
            config,
            scheduledDate,
            notificationCycleId
          );
        }
      }

      /**
       * ======================================================
       * COMPLETED
       * ======================================================
       */

      console.log(
        "========================================"
      );

      console.log(
        "✅📧 Dynamic policy expiry email job completed"
      );

      console.log(
        "========================================"
      );
    } catch (
      error
    ) {
      console.error(
        "========================================"
      );

      console.error(
        "❌ Policy expiry email job failed:"
      );

      console.error(
        error
      );

      console.error(
        "========================================"
      );

      throw error;
    }
  };