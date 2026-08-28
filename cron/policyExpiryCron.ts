// // import cron from "node-cron";
// // import { processPolicyExpiryEmails } from "../services/policy/policyExpiryService";

// // /**
// //  * Policy Expiry Cron
// //  *
// //  * Runs every day at 9:00 AM IST.
// //  *
// //  * It checks:
// //  * - Policies expiring in 7 days
// //  * - Policies expiring tomorrow
// //  * - Policies that have already expired
// //  *
// //  * Make sure processPolicyExpiryEmails() handles
// //  * duplicate prevention using the Policy fields:
// //  *
// //  * - expiryReminder7Sent
// //  * - expiryReminder1Sent
// //  * - expiryEmailSent
// //  */

// // export const startPolicyExpiryCron = () => {
// //   console.log("📅 Policy expiry cron initialized");

// //   cron.schedule(
// // "*/1 * * * *",
// //     async () => {
// //       console.log("=======================================");
// //       console.log("⏰ Policy expiry cron started");
// //       console.log(`🕐 ${new Date().toISOString()}`);
// //       console.log("======================================");

// //       try {
// //         await processPolicyExpiryEmails();

// //         console.log("✅ Policy expiry cron completed");
// //       } catch (error) {
// //         console.error(
// //           "❌ Policy expiry cron failed:",
// //           error
// //         );
// //       }

// //       console.log("======================================");
// //     },
// //     {
// //       timezone: "Asia/Kolkata",
// //     }
// //   );
// // };


// // src/cron/policyExpiryCron.ts

// import cron from "node-cron";
// import { processPolicyExpiryEmails } from "../services/policy/policyExpiryService";

// /**
//  * Policy Expiry Notification Cron
//  *
//  * Runs every day at 9:00 AM IST.
//  *
//  * It checks:
//  *
//  * - Policies expiring in 7 days
//  * - Policies expiring tomorrow
//  * - Policies that have already expired
//  *
//  * For each policy it can send:
//  *
//  * - 📧 Email notification
//  * - 📱 SMS notification
//  *
//  * Email and SMS delivery status are tracked
//  * independently using the PolicyNotification model.
//  *
//  * This prevents duplicate notifications and also
//  * allows a failed channel to be retried without
//  * resending a successful channel.
//  */

// export const startPolicyExpiryCron = () => {
//   console.log(
//     "📅 Policy expiry notification cron initialized"
//   );

//   /*
//    * Runs every day at 9:00 AM IST.
//    *
//    * Cron format:
//    *
//    * ┌──────── minute (0)
//    * │ ┌────── hour (9)
//    * │ │ ┌──── day of month (*)
//    * │ │ │ ┌── month (*)
//    * │ │ │ │ ┌ day of week (*)
//    * │ │ │ │ │
//    * 0 9 * * *
//    */

//   cron.schedule(
//     "*/1 * * * *",
//     async () => {
//       console.log(
//         "======================================="
//       );

//       console.log(
//         "⏰ Policy expiry notification cron started"
//       );

//       console.log(
//         `🕐 SERVER TIME: ${new Date().toISOString()}`
//       );

//       console.log(
//         `🇮🇳 INDIA TIME: ${new Date().toLocaleString(
//           "en-IN",
//           {
//             timeZone: "Asia/Kolkata",
//           }
//         )}`
//       );

//       console.log(
//         "======================================="
//       );

//       try {
//         /*
//          * Process:
//          *
//          * 1. 7-day reminders
//          * 2. 1-day reminders
//          * 3. Expired policies
//          *
//          * Each notification can send:
//          * - Email
//          * - SMS
//          *
//          * independently.
//          */

//         await processPolicyExpiryEmails();

//         console.log(
//           "✅ Policy expiry notification cron completed successfully"
//         );
//       } catch (error) {
//         console.error(
//           "❌ Policy expiry notification cron failed:",
//           error
//         );
//       }

//       console.log(
//         "======================================="
//       );

//       console.log(
//         "🏁 Policy expiry notification cron finished"
//       );

//       console.log(
//         "======================================="
//       );
//     },
//     {
//       timezone: "Asia/Kolkata",
//   });
// };



// src/cron/policyExpiryCron.ts

import cron from "node-cron";
import { processPolicyExpiryEmails } from "../services/policy/policyExpiryService";

/**
 * Policy Expiry Notification Cron
 *
 * Runs every day at 9:00 AM IST.
 *
 * It checks:
 *
 * - Policies expiring in 7 days
 * - Policies expiring tomorrow
 * - Policies that have already expired
 *
 * For each policy it can send:
 *
 * - 📧 Email
 * - 📱 SMS
 * - 💬 WhatsApp
 *
 * Each channel is tracked independently
 * using the PolicyNotification model.
 *
 * This means:
 *
 * - Email succeeds → Email won't be sent again
 * - SMS succeeds → SMS won't be sent again
 * - WhatsApp succeeds → WhatsApp won't be sent again
 *
 * If one channel fails, only that channel
 * can be retried on the next execution.
 */

export const startPolicyExpiryCron = () => {
  console.log(
    "📅 Policy expiry notification cron initialized"
  );

  /**
   * Runs every day at 9:00 AM IST.
   *
   * Cron format:
   *
   * ┌──────── minute (0)
   * │ ┌────── hour (9)
   * │ │ ┌──── day of month (*)
   * │ │ │ ┌── month (*)
   * │ │ │ │ ┌ day of week (*)
   * │ │ │ │ │
   * 0 9 * * *
   */

  cron.schedule(
    "*/1 * * * *",
    async () => {
      console.log(
        "======================================="
      );

      console.log(
        "⏰ Policy expiry notification cron started"
      );

      console.log(
        `🕐 SERVER TIME: ${new Date().toISOString()}`
      );

      console.log(
        `🇮🇳 INDIA TIME: ${new Date().toLocaleString(
          "en-IN",
          {
            timeZone: "Asia/Kolkata",
          }
        )}`
      );

      console.log(
        "======================================="

      );

      try {
        /**
         * Process:
         *
         * 1. 7-day reminders
         * 2. 1-day reminders
         * 3. Expired policies
         *
         * Each notification can send:
         *
         * - 📧 Email
         * - 📱 SMS
         * - 💬 WhatsApp
         *
         * independently.
         */

        await processPolicyExpiryEmails();

        console.log(
          "✅ Policy expiry notification cron completed successfully"
        );
      } catch (error) {
        console.error(
          "❌ Policy expiry notification cron failed:",
          error
        );
      }

      console.log(
        "======================================="
      );

      console.log(
        "🏁 Policy expiry notification cron finished"
      );

      console.log(
        "======================================="
      );
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};
