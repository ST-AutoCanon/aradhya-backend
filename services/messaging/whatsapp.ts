// src/services/whatsapp.service.ts

interface SendWhatsAppResponse {
  type?: string;
  message?: string;
  request_id?: string;
  status?: string;
  [key: string]: any;
}

/*
 * ================================
 * AUTHKEY WHATSAPP CONFIG
 * ================================
 */

const AUTHKEY =
  process.env.AUTHKEY_WHATSAPP_AUTHKEY;

const WHATSAPP_7_DAY_TEMPLATE_ID =
  process.env.AUTHKEY_WHATSAPP_7_DAY_TEMPLATE_ID;

const WHATSAPP_1_DAY_TEMPLATE_ID =
  process.env.AUTHKEY_WHATSAPP_1_DAY_TEMPLATE_ID;

const WHATSAPP_EXPIRED_TEMPLATE_ID =
  process.env.AUTHKEY_WHATSAPP_EXPIRED_TEMPLATE_ID;

/*
 * Authkey WhatsApp JSON API
 */

const AUTHKEY_WHATSAPP_URL =
  "https://console.authkey.io/restapi/requestjson.php";

/*
 * ================================
 * WHATSAPP NOTIFICATION TYPES
 * ================================
 */

export type WhatsAppNotificationType =
  | "7_DAY_REMINDER"
  | "1_DAY_REMINDER"
  | "EXPIRED";

/*
 * ================================
 * VALIDATE AUTHKEY
 * ================================
 */

const validateAuthConfig = (): {
  authKey: string;
} => {
  if (!AUTHKEY) {
    throw new Error(
      "AUTHKEY_WHATSAPP_AUTHKEY is not configured"
    );
  }

  return {
    authKey: AUTHKEY,
  };
};

/*
 * ================================
 * NORMALIZE CONTACT NUMBER
 * ================================
 *
 * Accepts:
 *
 * 9876543210
 * +91 9876543210
 * +91-9876543210
 * 919876543210
 *
 * Returns:
 *
 * 9876543210
 *
 * Authkey request will then use:
 *
 * country_code = 91
 * mobile       = 9876543210
 */

const normalizeContact = (
  contact: string
): string => {
  if (
    typeof contact !== "string" ||
    !contact.trim()
  ) {
    throw new Error(
      "WhatsApp contact number is required"
    );
  }

  let phone =
    contact.replace(/\D/g, "");

  /*
   * Remove India country code.
   *
   * 919876543210
   * -> 9876543210
   */

  if (
    phone.length === 12 &&
    phone.startsWith("91")
  ) {
    phone = phone.substring(2);
  }

  /*
   * Indian mobile number validation.
   */

  if (
    phone.length !== 10 ||
    !/^[6-9]\d{9}$/.test(phone)
  ) {
    throw new Error(
      `Invalid Indian WhatsApp contact number: ${contact}`
    );
  }

  return phone;
};

/*
 * ================================
 * VALIDATE TEMPLATE ID
 * ================================
 */

const validateTemplateId = (
  templateId: string | undefined,
  envName: string
): string => {
  if (
    !templateId ||
    !templateId.trim()
  ) {
    throw new Error(
      `${envName} is not configured`
    );
  }

  return templateId.trim();
};

/*
 * ================================
 * GET AUTHKEY WID
 * ================================
 */

const getTemplateId = (
  notificationType: WhatsAppNotificationType
): string => {
  switch (notificationType) {
    case "7_DAY_REMINDER":
      return validateTemplateId(
        WHATSAPP_7_DAY_TEMPLATE_ID,
        "AUTHKEY_WHATSAPP_7_DAY_TEMPLATE_ID"
      );

    case "1_DAY_REMINDER":
      return validateTemplateId(
        WHATSAPP_1_DAY_TEMPLATE_ID,
        "AUTHKEY_WHATSAPP_1_DAY_TEMPLATE_ID"
      );

    case "EXPIRED":
      return validateTemplateId(
        WHATSAPP_EXPIRED_TEMPLATE_ID,
        "AUTHKEY_WHATSAPP_EXPIRED_TEMPLATE_ID"
      );

    default:
      throw new Error(
        `Unsupported WhatsApp notification type: ${notificationType}`
      );
  }
};

/*
 * ================================
 * SEND WHATSAPP
 * ================================
 *
 * contact:
 *
 * Customer contact number.
 *
 * notificationType:
 *
 * 7_DAY_REMINDER
 * 1_DAY_REMINDER
 * EXPIRED
 *
 * bodyValues:
 *
 * {
 *   "1": "Customer Name",
 *   "2": "Policy Number",
 *   "3": "Expiry Date"
 * }
 *
 * Authkey template:
 *
 * Dear {{1}},
 * your policy {{2}} expires on {{3}}.
 */

// export const sendWhatsApp = async (

//   contact: string,
//   notificationType: WhatsAppNotificationType,
//   bodyValues: Record<string, string>
// ): Promise<SendWhatsAppResponse> => {
//   /*
//    * Validate Authkey.
//    */

//   const { authKey } =
//     validateAuthConfig();

//   /*
//    * Normalize customer's contact.
//    */

//   const phone =
//     normalizeContact(contact);

//   /*
//    * Get WID from notification type.
//    */

//   const templateId =
//     getTemplateId(
//       notificationType
//     );

//   /*
//    * Validate body values.
//    */

//   if (
//     !bodyValues ||
//     typeof bodyValues !== "object"
//   ) {
//     throw new Error(
//       "WhatsApp bodyValues are required"
//     );
//   }

//   try {
//     /*
//      * ================================
//      * AUTHKEY REQUEST BODY
//      * ================================
//      */

//     const requestBody = {
//       country_code: "91",

//       mobile: phone,

//       wid: templateId,

//       type: "text",

//       bodyValues,
//     };

//     console.log(
//       "📤 Sending WhatsApp via Authkey:",
//       {
//         contact: phone,
//         notificationType,
//         wid: templateId,
//         type: "text",
//         bodyValues,
//       }
//     );

//     /*
//      * ================================
//      * SEND REQUEST
//      * ================================
//      */

//     const response =
//       await fetch(
//         AUTHKEY_WHATSAPP_URL,
//         {
//           method: "POST",

//           headers: {
//             Authorization:
//               `Basic ${authKey}`,

//             "Content-Type":
//               "application/json",

//             Accept:
//               "application/json",
//           },

//           body:
//             JSON.stringify(
//               requestBody
//             ),
//         }
//       );

//     /*
//      * ================================
//      * READ RESPONSE
//      * ================================
//      */

//     const responseText =
//       await response.text();

//     let data:
//       SendWhatsAppResponse;

//     try {
//       data =
//         JSON.parse(
//           responseText
//         ) as SendWhatsAppResponse;
//     } catch {
//       data = {
//         message:
//           responseText,
//       };
//     }

//     /*
//      * ================================
//      * HTTP ERROR
//      * ================================
//      */

//     if (!response.ok) {
//       console.error(
//         "❌ Authkey WhatsApp HTTP error:",
//         {
//           status: response.status,
//           data,
//         }
//       );

//       throw new Error(
//         data.message ||
//           `Authkey WhatsApp request failed with status ${response.status}`
//       );
//     }

//     /*
//      * ================================
//      * AUTHKEY API ERROR
//      * ================================
//      *
//      * Authkey may return different
//      * response structures.
//      *
//      * If "type" exists and isn't success,
//      * consider the request failed.
//      */

//     if (
//       data.type &&
//       data.type.toLowerCase() !==
//         "success"
//     ) {
//       console.error(
//         "❌ Authkey rejected WhatsApp:",
//         data
//       );

//       throw new Error(
//         data.message ||
//           "Authkey failed to send WhatsApp message"
//       );
//     }

//     /*
//      * ================================
//      * SUCCESS
//      * ================================
//      */

//     console.log(
//       "✅ WhatsApp sent successfully:",
//       {
//         contact: phone,
//         notificationType,
//         wid: templateId,
//         response: data,
//       }
//     );

//     return data;

//   } catch (error: any) {

//     console.error(
//       "❌ Error sending WhatsApp:",
//       {
//         contact,
//         notificationType,
//         error:
//           error?.message ||
//           error,
//       }
//     );

//     throw error;
//   }
// };


export const sendWhatsApp = async (
  contact: string,
  notificationType: WhatsAppNotificationType,
  bodyValues: Record<string, string>
): Promise<SendWhatsAppResponse> => {
  /*
   * ================================
   * VALIDATE AUTHKEY
   * ================================
   */

  const { authKey } =
    validateAuthConfig();

  /*
   * ================================
   * NORMALIZE CONTACT
   * ================================
   */

  const phone =
    normalizeContact(contact);

  /*
   * ================================
   * GET TEMPLATE WID
   * ================================
   */

  const templateId =
    getTemplateId(
      notificationType
    );

  /*
   * ================================
   * VALIDATE BODY VALUES
   * ================================
   */

  if (
    !bodyValues ||
    typeof bodyValues !== "object"
  ) {
    throw new Error(
      "WhatsApp bodyValues are required"
    );
  }

  /*
   * ================================
   * REQUEST BODY
   * ================================
   */

  const requestBody = {
    country_code: "91",
    mobile: phone,
    wid: templateId,
    type: "text",
    bodyValues,
  };

  try {
    /*
     * ================================
     * REQUEST LOG
     * ================================
     */

    console.log(
      "\n========================================"
    );

    console.log(
      "📤 WHATSAPP REQUEST"
    );

    console.log(
      "========================================"
    );

    console.log(
      "📱 Original contact:",
      contact
    );

    console.log(
      "📱 Normalized mobile:",
      phone
    );

    console.log(
      "🌍 Country code:",
      "91"
    );

    console.log(
      "📌 Notification type:",
      notificationType
    );

    console.log(
      "🆔 Template WID:",
      templateId
    );

    console.log(
      "📝 Message type:",
      "text"
    );

    console.log(
      "🔢 Body values:",
      bodyValues
    );

    console.log(
      "📦 Request body:",
      JSON.stringify(
        requestBody,
        null,
        2
      )
    );

    console.log(
      "🌐 Authkey URL:",
      AUTHKEY_WHATSAPP_URL
    );

    console.log(
      "========================================"
    );

    /*
     * ================================
     * SEND REQUEST
     * ================================
     */

    const response =
      await fetch(
        AUTHKEY_WHATSAPP_URL,
        {
          method: "POST",

          headers: {
            Authorization:
              `Basic ${authKey}`,

            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              requestBody
            ),
        }
      );

    /*
     * ================================
     * HTTP RESPONSE LOG
     * ================================
     */

    console.log(
      "\n========================================"
    );

    console.log(
      "📥 WHATSAPP AUTHKEY RESPONSE"
    );

    console.log(
      "========================================"
    );

    console.log(
      "📊 HTTP status:",
      response.status
    );

    console.log(
      "📊 HTTP status text:",
      response.statusText
    );

    console.log(
      "✅ HTTP OK:",
      response.ok
    );

    /*
     * ================================
     * READ RESPONSE
     * ================================
     */

    const responseText =
      await response.text();

    console.log(
      "📄 Raw Authkey response:",
      responseText
    );

    let data:
      SendWhatsAppResponse;

    try {
      data =
        JSON.parse(
          responseText
        ) as SendWhatsAppResponse;
    } catch {
      data = {
        message:
          responseText,
      };
    }

    /*
     * ================================
     * PARSED RESPONSE
     * ================================
     */

    console.log(
      "📦 Parsed response:",
      data
    );

    console.log(
      "📌 API status:",
      data.status || "N/A"
    );

    console.log(
      "💬 API message:",
      data.message ||
        data.Message ||
        "N/A"
    );

    console.log(
      "🆔 Request ID:",
      data.request_id ||
        "N/A"
    );

    console.log(
      "🆔 Log ID:",
      data.LogID ||
        "N/A"
    );

    console.log(
      "========================================"
    );

    /*
     * ================================
     * HTTP ERROR
     * ================================
     */

    if (!response.ok) {
      console.error(
        "❌ Authkey WhatsApp HTTP error:",
        {
          status: response.status,
          statusText:
            response.statusText,
          data,
        }
      );

      throw new Error(
        data.message ||
          `Authkey WhatsApp request failed with status ${response.status}`
      );
    }

    /*
     * ================================
     * AUTHKEY API ERROR
     * ================================
     */

    if (
      data.type &&
      data.type.toLowerCase() !==
        "success"
    ) {
      console.error(
        "❌ Authkey rejected WhatsApp:",
        data
      );

      throw new Error(
        data.message ||
          "Authkey failed to send WhatsApp message"
      );
    }

    /*
     * ================================
     * AUTHKEY STATUS CHECK
     * ================================
     */

    if (
      data.status &&
      data.status.toLowerCase() !==
        "success"
    ) {
      console.error(
        "❌ Authkey returned non-success status:",
        data
      );

      throw new Error(
        data.message ||
          "Authkey did not accept WhatsApp message"
      );
    }

    /*
     * ================================
     * SUCCESS
     * ================================
     */

    console.log(
      "\n========================================"
    );

    console.log(
      "✅ WHATSAPP SUBMITTED SUCCESSFULLY"
    );

    console.log(
      "========================================"
    );

    console.log(
      "📱 Mobile:",
      phone
    );

    console.log(
      "📌 Notification:",
      notificationType
    );

    console.log(
      "🆔 WID:",
      templateId
    );

    console.log(
      "🆔 LogID:",
      data.LogID ||
        "N/A"
    );

    console.log(
      "💬 Message:",
      data.message ||
        data.Message ||
        "N/A"
    );

    console.log(
      "========================================\n"
    );

    return data;

  } catch (error: any) {

    /*
     * ================================
     * FINAL ERROR LOG
     * ================================
     */

    console.error(
      "\n========================================"
    );

    console.error(
      "❌ WHATSAPP SEND FAILED"
    );

    console.error(
      "========================================"
    );

    console.error(
      "📱 Contact:",
      contact
    );

    console.error(
      "📱 Normalized mobile:",
      phone
    );

    console.error(
      "📌 Notification type:",
      notificationType
    );

    console.error(
      "🆔 WID:",
      templateId
    );

    console.error(
      "🔢 Body values:",
      bodyValues
    );

    console.error(
      "❌ Error:",
      error?.message ||
        error
    );

    console.error(
      "========================================\n"
    );

    throw error;
  }
};