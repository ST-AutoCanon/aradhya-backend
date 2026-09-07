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
//  * - 📧 Email
//  * - 📱 SMS
//  * - 💬 WhatsApp
//  *
//  * Each channel is tracked independently
//  * using the PolicyNotification model.
//  *
//  * This means:
//  *
//  * - Email succeeds → Email won't be sent again
//  * - SMS succeeds → SMS won't be sent again
//  * - WhatsApp succeeds → WhatsApp won't be sent again
//  *
//  * If one channel fails, only that channel
//  * can be retried on the next execution.
//  */

// export const startPolicyExpiryCron = () => {
//   console.log(
//     "📅 Policy expiry notification cron initialized"
//   );

//   /**
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
//         /**
//          * Process:
//          *
//          * 1. 7-day reminders
//          * 2. 1-day reminders
//          * 3. Expired policies
//          *
//          * Each notification can send:
//          *
//          * - 📧 Email
//          * - 📱 SMS
//          * - 💬 WhatsApp
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
//     }
//   );
// };


///////////////////////
// import cron from "node-cron";
// import MockDate from "mockdate";

// import { processPolicyExpiryEmails } from "../services/policy/policyExpiryService";

// export const startPolicyExpiryCron = () => {
//   console.log(
//     "📅 Policy expiry notification cron initialized"
//   );

//   cron.schedule(
//     "*/1 * * * *",
//     async () => {
//       console.log(
//         "======================================="
//       );

//       console.log(
//         "⏰ Policy expiry notification cron started"
//       );

//       /**
//        * ======================================================
//        * TEST DATE
//        * ======================================================
//        *
//        * Pretend today is:
//        *
//        * 11 September 2026
//        *
//        * The existing service uses new Date(),
//        * so MockDate makes new Date() return this date.
//        */

//       const testDate =
//         "2026-02-01T00:00:00+05:30";

//       MockDate.set(testDate);

//       console.log(
//         "🧪 TEST DATE ENABLED"
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
//         /**
//          * IMPORTANT:
//          *
//          * No argument is passed here.
//          *
//          * This matches your existing service:
//          *
//          * processPolicyExpiryEmails()
//          *
//          * Inside the service, every new Date()
//          * will return 11 September 2026.
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
//       } finally {
//         /**
//          * Restore the real system date after the job.
//          */
//         MockDate.reset();

//         console.log(
//           "🔄 Real system date restored"
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
//     }
//   );
// };

///////////

import cron from "node-cron";
import MockDate from "mockdate";

import {
  processPolicyExpiryEmails,
} from "../services/policy/policyExpiryService";

import {
  getCurrentPolicyExpiryTestDate,
} from "../controllers/policyExpiryTestController";

export const startPolicyExpiryCron = () => {
  console.log(
    "📅 Policy expiry notification cron initialized"
  );

  cron.schedule(
    "*/1 * * * *",
    async () => {
      console.log(
        "======================================="
      );

      console.log(
        "⏰ Policy expiry notification cron started"
      );

      /**
       * ======================================================
       * GET TEST DATE
       * ======================================================
       *
       * If a test date has been configured from the admin page,
       * use that date.
       *
       * If no test date is configured, use the real current date.
       */
      const testDate =
        getCurrentPolicyExpiryTestDate();

      if (testDate) {
        MockDate.set(
          `${testDate}T00:00:00+05:30`
        );

        console.log(
          "🧪 TEST DATE ENABLED"
        );

        console.log(
          `📅 TEST DATE: ${testDate}`
        );
      } else {
        console.log(
          "🟢 REAL DATE MODE"
        );

        console.log(
          "📅 Using actual system date"
        );
      }

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
         * No date is passed to the service.
         *
         * If test mode is enabled, MockDate makes
         * new Date() inside the service return the
         * configured test date.
         *
         * If test mode is disabled, new Date()
         * returns the real current date.
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
      } finally {
        /**
         * Only reset MockDate if we enabled it.
         */
        if (testDate) {
          MockDate.reset();

          console.log(
            "🔄 Real system date restored"
          );
        }
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