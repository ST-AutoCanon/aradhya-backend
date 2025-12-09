import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
}

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: EmailAttachment[]
) => {
  // Folder where both images exist
  const baseDir = path.resolve(process.cwd(), "Signature_files");

  // Paths for both possible images
  const primarySignature = path.join(baseDir, "signature.png");
  const fallbackSignature = path.join(baseDir, "claim_icon.png");

  // ✅ Check which file actually exists
  const signatureImagePath = fs.existsSync(primarySignature)
    ? primarySignature
    : fallbackSignature;

  // Optional: log which image is being used
  console.log("🖼️ Using signature image:", signatureImagePath);

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html: html
      ? `
        ${html}
        <div style="margin-top:20px; display:flex; align-items:flex-end; justify-content:flex-start;">
          <img src="cid:signatureImage" alt="Signature" style="width:150px; height:auto;" />
        </div>
      `
      : undefined,
    attachments: [
      ...(attachments || []),
      {
        filename: path.basename(signatureImagePath),
        path: signatureImagePath,
        cid: "signatureImage",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};
