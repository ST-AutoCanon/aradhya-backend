
// import cron from "node-cron";
// import MockDate from "mockdate";

// import {
//   processPolicyExpiryEmails,
// } from "../services/policy/policyExpiryService";

// import {
//   getCurrentPolicyExpiryTestDate,
// } from "../controllers/policyExpiryTestController";

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
//        * GET TEST DATE
//        * ======================================================
//        *
//        * If a test date has been configured from the admin page,
//        * use that date.
//        *
//        * If no test date is configured, use the real current date.
//        */
//       const testDate =
//         getCurrentPolicyExpiryTestDate();

//       if (testDate) {
//         MockDate.set(
//           `${testDate}T00:00:00+05:30`
//         );

//         console.log(
//           "🧪 TEST DATE ENABLED"
//         );

//         console.log(
//           `📅 TEST DATE: ${testDate}`
//         );
//       } else {
//         console.log(
//           "🟢 REAL DATE MODE"
//         );

//         console.log(
//           "📅 Using actual system date"
//         );
//       }

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
//          * No date is passed to the service.
//          *
//          * If test mode is enabled, MockDate makes
//          * new Date() inside the service return the
//          * configured test date.
//          *
//          * If test mode is disabled, new Date()
//          * returns the real current date.
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
//          * Only reset MockDate if we enabled it.
//          */
//         if (testDate) {
//           MockDate.reset();

//           console.log(
//             "🔄 Real system date restored"
//           );
//         }
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



import cron from "node-cron";

import {
  processPolicyExpiryEmails,
} from "../services/policy/policyExpiryService";

export const startPolicyExpiryCron = () => {
  console.log(
    "📅 Policy expiry notification cron initialized"
  );

  cron.schedule(
    "0 9 * * *",
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
