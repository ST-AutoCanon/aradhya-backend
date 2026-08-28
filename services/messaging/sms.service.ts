// src/services/sms.service.ts

interface SendOtpResponse {
  type?: string;
  message?: string;
  request_id?: string;
}

interface SendSmsResponse {
  type?: string;
  message?: string;
  request_id?: string;
}

/*
 * ================================
 * MSG91 CONFIG
 * ================================
 */

const MSG91_AUTH_KEY =
  process.env.MSG91_AUTH_KEY;

const MSG91_OTP_TEMPLATE_ID =
  process.env.MSG91_TEMPLATE_ID;

const MSG91_SMS_TEMPLATE_ID =
  process.env.MSG91_SMS_TEMPLATE_ID;

const MSG91_OTP_EXPIRY =
  Number(
    process.env.MSG91_OTP_EXPIRY
  ) || 5;

const MSG91_OTP_LENGTH =
  Number(
    process.env.MSG91_OTP_LENGTH
  ) || 6;

const MSG91_OTP_URL =
  "https://control.msg91.com/api/v5/otp";

const MSG91_FLOW_URL =
  "https://control.msg91.com/api/v5/flow";


/*
 * ================================
 * VALIDATE AUTH CONFIG
 * ================================
 */

const validateAuthConfig = (): {
  authKey: string;
} => {
  if (!MSG91_AUTH_KEY) {
    throw new Error(
      "MSG91_AUTH_KEY is not configured"
    );
  }

  return {
    authKey: MSG91_AUTH_KEY,
  };
};


/*
 * ================================
 * VALIDATE OTP CONFIG
 * ================================
 */

const validateOtpConfig = (): {
  authKey: string;
  templateId: string;
} => {
  const { authKey } =
    validateAuthConfig();

  if (!MSG91_OTP_TEMPLATE_ID) {
    throw new Error(
      "MSG91_TEMPLATE_ID is not configured"
    );
  }

  return {
    authKey,
    templateId:
      MSG91_OTP_TEMPLATE_ID,
  };
};


/*
 * ================================
 * VALIDATE SMS CONFIG
 * ================================
 */

const validateSmsConfig = (): {
  authKey: string;
  templateId: string;
} => {
  const { authKey } =
    validateAuthConfig();

  if (!MSG91_SMS_TEMPLATE_ID) {
    throw new Error(
      "MSG91_SMS_TEMPLATE_ID is not configured"
    );
  }

  return {
    authKey,
    templateId:
      MSG91_SMS_TEMPLATE_ID,
  };
};


/*
 * ================================
 * NORMALIZE PHONE NUMBER
 * ================================
 */

const normalizePhone = (
  mobile: string
): string => {
  const phone =
    mobile.replace(/\D/g, "");

  if (!phone) {
    throw new Error(
      "Invalid mobile number"
    );
  }

  /*
   * If Indian number is provided
   * without country code:
   *
   * 9876543210
   * becomes
   * 919876543210
   */

  if (
    phone.length === 10 &&
    /^[6-9]/.test(phone)
  ) {
    return `91${phone}`;
  }

  return phone;
};


/*
 * ================================
 * SEND OTP
 * ================================
 */

export const sendOtp = async (
  mobile: string
): Promise<SendOtpResponse> => {
  const {
    authKey,
    templateId,
  } = validateOtpConfig();

  const phone =
    normalizePhone(mobile);

  try {
    const url =
      new URL(MSG91_OTP_URL);

    url.searchParams.set(
      "template_id",
      templateId
    );

    url.searchParams.set(
      "mobile",
      phone
    );

    url.searchParams.set(
      "authkey",
      authKey
    );

    url.searchParams.set(
      "otp_expiry",
      String(MSG91_OTP_EXPIRY)
    );

    url.searchParams.set(
      "otp_length",
      String(MSG91_OTP_LENGTH)
    );

    const response =
      await fetch(
        url.toString(),
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },
        }
      );

    const data =
      (await response.json()) as SendOtpResponse;

    if (!response.ok) {
      console.error(
        "❌ MSG91 OTP error:",
        data
      );

      throw new Error(
        data.message ||
          "Failed to send OTP"
      );
    }

    if (
      data.type !== "success"
    ) {
      console.error(
        "❌ MSG91 rejected OTP:",
        data
      );

      throw new Error(
        data.message ||
          "MSG91 failed to send OTP"
      );
    }

    console.log(
      "✅ OTP sent successfully:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Error sending OTP:",
      error
    );

    throw error;
  }
};


/*
 * ================================
 * SEND NORMAL SMS
 * ================================
 *
 * Used for:
 *
 * - 7-day policy reminder
 * - 1-day policy reminder
 * - Expired policy notification
 *
 * This is NOT an OTP API.
 */

export const sendSms = async (
  mobile: string,
  message: string
): Promise<SendSmsResponse> => {
  const {
    authKey,
    templateId,
  } = validateSmsConfig();

  const phone =
    normalizePhone(mobile);

  if (!message?.trim()) {
    throw new Error(
      "SMS message is required"
    );
  }

  try {
    const response =
      await fetch(
        MSG91_FLOW_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            authkey: authKey,
          },

          body: JSON.stringify({
            template_id:
              templateId,

            short_url:
              "0",

            recipients: [
              {
                mobiles: phone,

                VAR1: message,
              },
            ],
          }),
        }
      );

    const data =
      (await response.json()) as SendSmsResponse;

    if (!response.ok) {
      console.error(
        "❌ MSG91 SMS error:",
        data
      );

      throw new Error(
        data.message ||
          "Failed to send SMS"
      );
    }

    if (
      data.type &&
      data.type !== "success"
    ) {
      console.error(
        "❌ MSG91 rejected SMS:",
        data
      );

      throw new Error(
        data.message ||
          "MSG91 failed to send SMS"
      );
    }

    console.log(
      "✅ SMS sent successfully:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Error sending SMS:",
      error
    );

    throw error;
  }
};