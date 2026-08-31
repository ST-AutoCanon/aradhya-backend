
import Policy from "../../models/policyInfo";
import PolicyNotification from "../../models/PolicyNotification";

import PolicyNotificationConfig, {
  IPolicyNotificationConfig,
  PolicyNotificationScheduleType,
} from "../../models/PolicyNotificationConfig";

import { sendMail } from "../messaging/emailService";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

type NotificationConfig = IPolicyNotificationConfig;

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

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

/**
 * ============================================================
 * GET INDIA DATE STRING
 * ============================================================
 *
 * Returns:
 *
 * YYYY-MM-DD
 */

const getIndiaDateString = (
  date: Date = new Date()
): string => {
  return date.toLocaleDateString("en-CA", {
    timeZone: INDIA_TIMEZONE,
  });
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
 * 2026-08-29
 *
 * becomes:
 *
 * 2026-08-29T00:00:00.000Z
 */

const createIndiaDate = (
  dateString: string
): Date => {
  const [year, month, day] = dateString
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
 * FORMAT EXPIRY DATE
 * ============================================================
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
      timeZone: INDIA_TIMEZONE,
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
 *
 * Example:
 *
 * endDate:
 * 2026-08-28T18:30:00.000Z
 *
 * India date:
 * 2026-08-29
 *
 * Stored:
 * 2026-08-29T00:00:00.000Z
 */

const getPolicyExpiryDate = (
  endDate: Date | string
): Date => {
  const indiaDateString = new Date(
    endDate
  ).toLocaleDateString("en-CA", {
    timeZone: INDIA_TIMEZONE,
  });

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
    Number(config.daysBeforeExpiry ?? 0);

  const daysAfter =
    Number(config.daysAfterExpiry ?? 0);

  const lastNDays =
    Number(config.lastNDays ?? 0);

  // Replace customer name
  subject = subject.replace(
    /{{customerName}}/gi,
    customerName || ""
  );

  // Replace generic days placeholder
  subject = subject.replace(
    /{{days}}/gi,
    String(
      config.type === "BEFORE_EXPIRY"
        ? daysBefore
        : config.type === "AFTER_EXPIRY"
        ? daysAfter
        : config.type === "LAST_N_DAYS"
        ? lastNDays
        : 0
    )
  );

  // Optional specific placeholders
  subject = subject.replace(
    /{{daysBeforeExpiry}}/gi,
    String(daysBefore)
  );

  subject = subject.replace(
    /{{daysAfterExpiry}}/gi,
    String(daysAfter)
  );

  subject = subject.replace(
    /{{lastNDays}}/gi,
    String(lastNDays)
  );

  // Expiry date
  if (config.type) {
    // This can be replaced later if you want expiryDate
    // from the policy available here.
  }

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
        days === 1 ? "" : "s"
      }`;
    }

    case "ON_EXPIRY":
      return "Policy Expires Today";

    case "AFTER_EXPIRY": {
      const days =
        config.daysAfterExpiry;

      return `Policy Expired ${days} Day${
        days === 1 ? "" : "s"
      } Ago`;
    }

    case "LAST_N_DAYS":
      return "Policy Expiry Reminder";

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
        days === 1 ? "" : "s"
      }.`;
    }

    case "ON_EXPIRY":
      return "Your insurance policy expires today. Please renew it as soon as possible.";

    case "AFTER_EXPIRY": {
      const days =
        config.daysAfterExpiry;

      return `Your insurance policy expired ${days} day${
        days === 1 ? "" : "s"
      } ago. Please renew it as soon as possible.`;
    }

    case "LAST_N_DAYS":
      return "Your insurance policy is approaching its expiry date. Please renew it as soon as possible.";

    default:
      return "Please check your insurance policy expiry details.";
  }
};

/**
 * ============================================================
 * BUILD EMAIL HTML
 * ============================================================
 */

const buildEmailHtml = (
  config: NotificationConfig,
  policy: any
): string => {
  const expiryDate =
    formatExpiryDate(
      policy.endDate
    );

  const heading =
    getHeading(config);

  const message =
    getMessage(config);

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
        Please contact us if you would like
        to renew your policy.
      </p>

      <p>
        Regards,<br />
        <strong>Insurance Team</strong>
      </p>

    </div>
  `;
};

/**
 * ============================================================
 * GET DAYS UNTIL EXPIRY
 * ============================================================
 */

const getDaysUntilExpiry = (
  policy: any,
  today: Date
): number => {
  const expiryDate =
    getPolicyExpiryDate(
      policy.endDate
    );

  const difference =
    expiryDate.getTime() -
    today.getTime();

  return Math.round(
    difference /
      MILLISECONDS_IN_DAY
  );
};

/**
 * ============================================================
 * GET SCHEDULED DATE
 * ============================================================
 *
 * Returns today's date if reminder is due.
 */

const getScheduledDateForConfig = (
  policy: any,
  config: NotificationConfig,
  today: Date
): Date | null => {
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
      daysBefore === null ||
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
      daysUntilExpiry === 0
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
      daysAfter === null ||
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
      lastNDays === null ||
      lastNDays < 1
    ) {
      return null;
    }

    if (
      daysUntilExpiry >= 0 &&
      daysUntilExpiry <
        lastNDays
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
 * Used to distinguish reminders such as:
 *
 * BEFORE_EXPIRY + 2
 * BEFORE_EXPIRY + 5
 * AFTER_EXPIRY + 1
 * AFTER_EXPIRY + 3
 * LAST_N_DAYS + 8
 */

const getScheduleValue = (
  config: NotificationConfig
): number => {
  switch (config.type) {
    case "BEFORE_EXPIRY":
      return (
        config.daysBeforeExpiry ??
        0
      );

    case "AFTER_EXPIRY":
      return (
        config.daysAfterExpiry ??
        0
      );

    case "LAST_N_DAYS":
      return (
        config.lastNDays ??
        0
      );

    case "ON_EXPIRY":
      return 0;

    default:
      return 0;
  }
};

/**
 * ============================================================
 * GET NOTIFICATION QUERY
 * ============================================================
 *
 * IMPORTANT:
 *
 * The same query is used for:
 *
 * 1. findOne()
 * 2. duplicate recovery
 *
 * This prevents mismatches.
 */

const buildNotificationQuery = (
  policy: any,
  config: NotificationConfig,
  expiryDate: Date,
  scheduledDate: Date,
  scheduleValue: number
) => {
  return {
    policyId: policy._id,

    reminderConfigId:
      config._id,

    expiryDate,

    scheduleType:
      config.type,

    scheduleValue,

    scheduledDate,
  };
};

/**
 * ============================================================
 * PROCESS ONE NOTIFICATION
 * ============================================================
 */

const processNotification = async (
  policy: any,
  config: NotificationConfig,
  scheduledDate: Date
): Promise<void> => {
  /**
   * ========================================================
   * RECIPIENT
   * ========================================================
   */

  const recipientEmail =
    typeof policy.email === "string" &&
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
   * REQUIRED BY SCHEMA.
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
    policy
  );

  /**
   * ========================================================
   * SCHEDULE VALUE
   * ========================================================
   */

  const scheduleValue =
    getScheduleValue(config);

  /**
   * ========================================================
   * NOTIFICATION QUERY
   * ========================================================
   */

  const notificationQuery =
    buildNotificationQuery(
      policy,
      config,
      expiryDate,
      scheduledDate,
      scheduleValue
    );

  console.log(
    "🔎 Notification lookup:"
  );

  console.log(
    JSON.stringify(
      {
        policyId:
          policy._id?.toString(),

        reminderConfigId:
          config._id?.toString(),

        expiryDate:
          expiryDate.toISOString(),

        scheduleType:
          config.type,

        scheduleValue,

        scheduledDate:
          scheduledDate.toISOString(),
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

            reminderConfigId:
              config._id,

            /**
             * IMPORTANT:
             * This was the original missing field.
             */
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

        /**
         * If duplicate happened but the query
         * still cannot find the document, log it.
         */

        if (!notification) {
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
         * IMPORTANT:
         *
         * DO NOT HIDE THIS ERROR.
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

    notification.email.attempts += 1;

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
      `📬 Response: ${
        mailInfo?.response ||
        "N/A"
      }`
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
      `❌ Error: ${
        error?.message ||
        "Unknown error"
      }`
    );

    console.error(
      "========================================"
    );

    /**
     * Do not throw here.
     *
     * This allows the cron to continue processing
     * other policies/reminders.
     */
  }

  /**
   * ========================================================
   * FINAL STATUS
   * ========================================================
   */

  console.log(
    `📊 ${config.name} completed for ${policy.policyNumber} | ` +
    `Email: ${
      notification.email
        ?.status || "N/A"
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
           * CONFIG VALUE LOGGING
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
            `   Schedule Value: ${getScheduleValue(
              config
            )}`
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

          /**
           * ==================================================
           * PROCESS NOTIFICATION
           * ==================================================
           */

          await processNotification(
            policy,
            config,
            scheduledDate
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
