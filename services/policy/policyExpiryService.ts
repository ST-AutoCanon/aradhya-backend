
import Policy from "../../models/policyInfo";
import PolicyNotification, {
  PolicyNotificationType,
} from "../../models/PolicyNotification";

import { sendMail } from "../messaging/emailService";

interface NotificationConfig {
  type: PolicyNotificationType;
  daysUntilExpiry: number;
  subject: (customerName: string) => string;
}

/**
 * Policy expiry notification configurations.
 *
 * Notifications:
 *
 * - 7 days before expiry
 * - 1 day before expiry
 * - On/after expiry
 */
const notificationConfigs: NotificationConfig[] = [
  {
    type: "7_DAY_REMINDER",
    daysUntilExpiry: 7,
    subject: (customerName) =>
      `Policy Expiry Reminder - 7 Days - ${customerName}`,
  },

  {
    type: "1_DAY_REMINDER",
    daysUntilExpiry: 1,
    subject: (customerName) =>
      `Policy Expiry Reminder - Tomorrow - ${customerName}`,
  },

  {
    type: "EXPIRED",
    daysUntilExpiry: 0,
    subject: (customerName) =>
      `Policy Expired - ${customerName}`,
  },
];

/**
 * Get start of day.
 */
const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

/**
 * Get end of day.
 */
const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
};

/**
 * Add days to a date.
 */
const addDays = (
  date: Date,
  days: number
): Date => {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
};

/**
 * Format policy expiry date in Indian format.
 */
const formatExpiryDate = (
  endDate: Date | string
): string => {
  return new Date(endDate).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }
  );
};

/**
 * Build email HTML.
 */
const buildEmailHtml = (
  notificationType: PolicyNotificationType,
  policy: any
): string => {
  const expiryDate = formatExpiryDate(
    policy.endDate
  );

  let heading = "";
  let message = "";

  switch (notificationType) {
    case "7_DAY_REMINDER":
      heading = "Policy Expiring in 7 Days";
      message =
        "Your insurance policy will expire in 7 days.";
      break;

    case "1_DAY_REMINDER":
      heading = "Policy Expiring Tomorrow";
      message =
        "Your insurance policy will expire tomorrow.";
      break;

    case "EXPIRED":
      heading = "Policy Has Expired";
      message =
        "Your insurance policy has already expired. Please renew it as soon as possible.";
      break;

    default:
      heading = "Policy Expiry Notification";
      message =
        "Please check your insurance policy expiry details.";
      break;
  }

  return `
    <div style="
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
    ">

      <h2>${heading}</h2>

      <p>
        Dear <strong>${policy.customerName}</strong>,
      </p>

      <p>
        ${message}
      </p>

      <table
        cellpadding="8"
        cellspacing="0"
        border="1"
        style="
          border-collapse: collapse;
          width: 100%;
          max-width: 600px;
        "
      >
        <tr>
          <td>
            <strong>Customer Name</strong>
          </td>
          <td>
            ${policy.customerName}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Policy Number</strong>
          </td>
          <td>
            ${policy.policyNumber}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Vehicle Number</strong>
          </td>
          <td>
            ${policy.vehicleNo}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Insurer</strong>
          </td>
          <td>
            ${policy.insurerCompany}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Policy Expiry Date</strong>
          </td>
          <td>
            ${expiryDate}
          </td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        Please contact us if you would like to renew your policy.
      </p>

      <p>
        Regards,<br />
        <strong>Insurance Team</strong>
      </p>

    </div>
  `;
};

/**
 * Process EMAIL notification for one policy.
 *
 * Only email is supported.
 *
 * Email status is tracked independently using
 * PolicyNotification.email.
 *
 * This prevents duplicate emails and allows
 * failed emails to be retried.
 */
const processNotification = async (
  policy: any,
  config: NotificationConfig
): Promise<void> => {
  /**
   * ================================
   * EMAIL RECIPIENT
   * ================================
   */

  const recipientEmail =
    typeof policy.email === "string" &&
    policy.email.trim()
      ? policy.email
          .toLowerCase()
          .trim()
      : null;

  /**
   * ================================
   * NO EMAIL
   * ================================
   */

  if (!recipientEmail) {
    console.log(
      `⚠️ No email for policy ${policy.policyNumber}. Skipping.`
    );

    return;
  }

  const subject = config.subject(
    policy.customerName
  );

  /**
   * ================================
   * FIND EXISTING NOTIFICATION
   * ================================
   */

  let notification =
    await PolicyNotification.findOne({
      policyId: policy._id,
      notificationType: config.type,
    });

  /**
   * ================================
   * CREATE NOTIFICATION
   * ================================
   */

  if (!notification) {
    notification =
      await PolicyNotification.create({
        policyId: policy._id,
        notificationType: config.type,
        subject,

        email: {
          recipient: recipientEmail,
          status: "PENDING",
          attempts: 0,
        },
      });
  }

  /**
   * ================================
   * ADD EMAIL IF MISSING
   * ================================
   */

  if (!notification.email) {
    notification.email = {
      recipient: recipientEmail,
      status: "PENDING",
      attempts: 0,
    };
  }

  /**
   * Update recipient if the policy email
   * has changed.
   */
  if (
    notification.email.recipient !==
    recipientEmail
  ) {
    notification.email.recipient =
      recipientEmail;
  }

  await notification.save();

  /**
   * ================================
   * SEND EMAIL
   * ================================
   */

  if (
    notification.email.status !== "SENT"
  ) {
    try {
      notification.email.attempts += 1;

      notification.email.lastAttemptAt =
        new Date();

      notification.email.status =
        "PENDING";

      notification.email.errorMessage =
        undefined;

      await notification.save();

      const html = buildEmailHtml(
        config.type,
        policy
      );

      await sendMail(
        notification.email.recipient,
        subject,
        `Policy notification for ${policy.customerName}`,
        html
      );

      /**
       * Mark email as successfully sent.
       */
      notification.email.status = "SENT";

      notification.email.sentAt =
        new Date();

      notification.email.errorMessage =
        undefined;

      await notification.save();

      console.log(
        `✅ ${config.type} EMAIL sent to ${notification.email.recipient} for policy ${policy.policyNumber}`
      );
    } catch (error: any) {
      /**
       * Mark email as failed.
       *
       * It will be retried on the next cron run.
       */
      notification.email.status =
        "FAILED";

      notification.email.errorMessage =
        error?.message ||
        "Unknown email sending error";

      await notification.save();

      console.error(
        `❌ Failed ${config.type} EMAIL for policy ${policy.policyNumber}:`,
        error
      );
    }
  } else {
    console.log(
      `⏭️ ${config.type} EMAIL already sent for policy ${policy.policyNumber}`
    );
  }

  /**
   * ================================
   * FINAL STATUS
   * ================================
   */

  console.log(
    `📊 ${config.type} completed for ${policy.policyNumber} | ` +
      `Email: ${
        notification.email?.status || "N/A"
      }`
  );
};

/**
 * Process policy expiry email notifications.
 *
 * Notifications:
 *
 * - 7 days before expiry
 * - 1 day before expiry
 * - On/after expiry
 *
 * ONLY EMAIL IS SENT.
 */
export const processPolicyExpiryEmails =
  async (): Promise<void> => {
    console.log(
      "========================================"
    );

    console.log(
      "📧 Policy expiry email job started"
    );

    console.log(
      "========================================"
    );

    try {
      const now = new Date();

      /**
       * ================================
       * SERVER TIME
       * ================================
       */

      console.log(
        "🕐 SERVER NOW:",
        now.toISOString()
      );

      /**
       * ================================
       * INDIA DATE
       * ================================
       */

      const indiaDateString =
        now.toLocaleDateString(
          "en-CA",
          {
            timeZone: "Asia/Kolkata",
          }
        );

      console.log(
        "🇮🇳 INDIA DATE:",
        indiaDateString
      );

      /**
       * ================================
       * CREATE TODAY
       * ================================
       */

      const [
        year,
        month,
        day,
      ] = indiaDateString
        .split("-")
        .map(Number);

      const today = new Date(
        year,
        month - 1,
        day
      );

      console.log(
        "🧪 TODAY:",
        today
      );

      /**
       * ================================
       * PROCESS EACH CONFIG
       * ================================
       */

      for (
        const config of notificationConfigs
      ) {
        const targetDate = addDays(
          today,
          config.daysUntilExpiry
        );

        const startDate =
          getStartOfDay(targetDate);

        const endDate =
          getEndOfDay(targetDate);

        console.log(
          "----------------------------------------"
        );

        console.log(
          `🔎 Checking ${config.type}`
        );

        console.log(
          "Target:",
          targetDate.toLocaleDateString(
            "en-IN"
          )
        );

        console.log(
          "Start:",
          startDate.toISOString()
        );

        console.log(
          "End:",
          endDate.toISOString()
        );

        let policies;

        /**
         * ================================
         * EXPIRED POLICIES
         * ================================
         */

        if (
          config.type === "EXPIRED"
        ) {
          policies =
            await Policy.find({
              isActive: true,

              /**
               * Only policies having
               * an email address.
               */
              email: {
                $exists: true,
                $ne: "",
              },

              endDate: {
                $lt: startDate,
              },
            }).lean();
        }

        /**
         * ================================
         * UPCOMING EXPIRY
         * ================================
         */

        else {
          policies =
            await Policy.find({
              isActive: true,

              /**
               * Only policies having
               * an email address.
               */
              email: {
                $exists: true,
                $ne: "",
              },

              endDate: {
                $gte: startDate,
                $lte: endDate,
              },
            }).lean();
        }

        console.log(
          `📋 ${config.type}: ${policies.length} policy(s) found`
        );

        /**
         * ================================
         * PROCESS POLICIES
         * ================================
         */

        for (
          const policy of policies
        ) {
          console.log(
            `📧 Processing ${policy.policyNumber} | ` +
              `Email: ${
                policy.email || "N/A"
              }`
          );

          await processNotification(
            policy,
            config
          );
        }
      }

      console.log(
        "========================================"
      );

      console.log(
        "✅📧 Policy expiry email job completed"
      );

      console.log(
        "========================================"
      );
    } catch (error) {
      console.error(
        "❌ Policy expiry email job failed:",
        error
      );

      throw error;
    }
  };

