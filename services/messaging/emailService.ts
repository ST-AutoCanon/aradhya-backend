
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

/**
 * ============================================================
 * GMAIL SMTP TRANSPORTER
 * ============================================================
 */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  /**
   * Optional SMTP timeout settings.
   * Helps prevent the request from hanging indefinitely.
   */
  connectionTimeout: 30_000,
  greetingTimeout: 30_000,
  socketTimeout: 30_000,
});

/**
 * ============================================================
 * EMAIL ATTACHMENT TYPE
 * ============================================================
 */

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
}

/**
 * ============================================================
 * VERIFY SMTP CONNECTION
 * ============================================================
 *
 * Call this once when your server starts.
 *
 * Example:
 *
 * await verifyEmailTransporter();
 */

export const verifyEmailTransporter =
  async (): Promise<void> => {
    try {
      await transporter.verify();

      console.log(
        "✅ Gmail SMTP connection verified successfully"
      );

      console.log(
        "📧 SMTP User:",
        process.env.EMAIL_USER
      );
    } catch (error) {
      console.error(
        "❌ Gmail SMTP verification failed:"
      );

      console.error(error);

      throw error;
    }
  };

/**
 * ============================================================
 * SEND MAIL
 * ============================================================
 */

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: EmailAttachment[]
) => {
  /**
   * ==========================================================
   * VALIDATE ENVIRONMENT VARIABLES
   * ==========================================================
   */

  if (!process.env.EMAIL_USER) {
    throw new Error(
      "EMAIL_USER is not configured"
    );
  }

  if (!process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_PASS is not configured"
    );
  }

  /**
   * ==========================================================
   * SIGNATURE DIRECTORY
   * ==========================================================
   */

  const baseDir =
    path.resolve(
      process.cwd(),
      "Signature_files"
    );

  /**
   * ==========================================================
   * SIGNATURE FILES
   * ==========================================================
   */

  const primarySignature =
    path.join(
      baseDir,
      "signature.png"
    );

  const fallbackSignature =
    path.join(
      baseDir,
      "claim_icon.png"
    );

  /**
   * ==========================================================
   * SELECT SIGNATURE
   * ==========================================================
   */

  let signatureImagePath: string | null =
    null;

  if (
    fs.existsSync(
      primarySignature
    )
  ) {
    signatureImagePath =
      primarySignature;
  } else if (
    fs.existsSync(
      fallbackSignature
    )
  ) {
    signatureImagePath =
      fallbackSignature;
  }

  /**
   * ==========================================================
   * LOG SIGNATURE
   * ==========================================================
   */

  if (signatureImagePath) {
    console.log(
      "🖼️ Using signature image:",
      signatureImagePath
    );
  } else {
    console.log(
      "⚠️ No signature image found. Email will be sent without signature."
    );
  }

  /**
   * ==========================================================
   * HTML
   * ==========================================================
   */

  const finalHtml =
    html
      ? `
        ${html}

        ${
          signatureImagePath
            ? `
              <div style="
                margin-top:20px;
                display:flex;
                align-items:flex-end;
                justify-content:flex-start;
              ">
                <img
                  src="cid:signatureImage"
                  alt="Signature"
                  style="
                    width:150px;
                    height:auto;
                  "
                />
              </div>
            `
            : ""
        }
      `
      : undefined;

  /**
   * ==========================================================
   * MAIL OPTIONS
   * ==========================================================
   */

  const mailOptions:
    nodemailer.SendMailOptions = {
    from: `"Aradhya Insurance Team" <${process.env.EMAIL_USER}>`,

    to,

    subject,

    text,

    html: finalHtml,

    attachments: [
      ...(attachments || []),

      ...(signatureImagePath
        ? [
            {
              filename:
                path.basename(
                  signatureImagePath
                ),

              path:
                signatureImagePath,

              cid:
                "signatureImage",
            },
          ]
        : []),
    ],
  };

  /**
   * ==========================================================
   * LOG BEFORE SENDING
   * ==========================================================
   */

  console.log(
    "========================================"
  );

  console.log(
    "📧 SENDING EMAIL"
  );

  console.log(
    "To:",
    to
  );

  console.log(
    "From:",
    mailOptions.from
  );

  console.log(
    "Subject:",
    subject
  );

  console.log(
    "Has HTML:",
    !!finalHtml
  );

  console.log(
    "Attachments:",
    mailOptions.attachments?.length || 0
  );

  console.log(
    "========================================"
  );

  /**
   * ==========================================================
   * SEND EMAIL
   * ==========================================================
   */

  try {
    const info =
      await transporter.sendMail(
        mailOptions
      );

    /**
     * ========================================================
     * GMAIL SMTP RESULT
     * ========================================================
     */

    console.log(
      "========================================"
    );

    console.log(
      "📨 GMAIL SMTP RESULT"
    );

    console.log(
      "To:",
      to
    );

    console.log(
      "From:",
      mailOptions.from
    );

    console.log(
      "Subject:",
      subject
    );

    console.log(
      "Message ID:",
      info.messageId
    );

    console.log(
      "Accepted:",
      info.accepted
    );

    console.log(
      "Rejected:",
      info.rejected
    );

    console.log(
      "Pending:",
      info.pending
    );

    console.log(
      "Response:",
      info.response
    );

    console.log(
      "Envelope:",
      info.envelope
    );

    console.log(
      "========================================"
    );

    /**
     * ========================================================
     * IMPORTANT SUCCESS CHECK
     * ========================================================
     */

    if (
      info.rejected &&
      info.rejected.length > 0
    ) {
      console.error(
        "⚠️ Gmail/Nodemailer rejected recipient:",
        info.rejected
      );
    }

    if (
      info.accepted &&
      info.accepted.length > 0
    ) {
      console.log(
        "✅ Gmail accepted recipient:",
        info.accepted
      );
    }

    return info;
  } catch (error: any) {
    /**
     * ========================================================
     * SMTP ERROR
     * ========================================================
     */

    console.error(
      "========================================"
    );

    console.error(
      "❌ ERROR SENDING EMAIL"
    );

    console.error(
      "To:",
      to
    );

    console.error(
      "Subject:",
      subject
    );

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Error code:",
      error?.code
    );

    console.error(
      "Command:",
      error?.command
    );

    console.error(
      "Response:",
      error?.response
    );

    console.error(
      "Response code:",
      error?.responseCode
    );

    console.error(
      "========================================"
    );

    throw error;
  }
};

