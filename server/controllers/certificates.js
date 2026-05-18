import { sendCertificateEmail } from "../utils/emailService.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendCertificates = async (req, res) => {
  try {
    const {
      recipients,
      subject,
      message,
      certificateVariant = "participation",
    } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: "recipients array is required" });
    }

    if (recipients.length > 200) {
      return res.status(400).json({ message: "Maximum 200 certificates per batch" });
    }

    const variant =
      certificateVariant === "top_team" ? "top_team" : "participation";

    const results = [];

    for (const item of recipients) {
      const { name, email, category, position, pdfBase64 } = item;

      if (!name?.trim() || !email?.trim() || !category?.trim() || !pdfBase64) {
        results.push({
          email: email || "unknown",
          success: false,
          error: "Missing name, email, category, or pdfBase64",
        });
        continue;
      }

      if (variant === "top_team" && !position?.trim()) {
        results.push({
          email: email || "unknown",
          success: false,
          error: "Missing position for top team certificate",
        });
        continue;
      }

      try {
        const pdfBuffer = Buffer.from(pdfBase64, "base64");
        if (pdfBuffer.length < 100) {
          throw new Error("Invalid PDF data");
        }

        await sendCertificateEmail({
          name: name.trim(),
          email: email.trim(),
          category: category.trim(),
          position: position?.trim(),
          certificateVariant: variant,
          pdfBuffer,
          subject,
          message,
        });

        results.push({ email, success: true });
        await delay(600);
      } catch (err) {
        console.error(`Certificate email failed for ${email}:`, err);
        results.push({
          email,
          success: false,
          error: err.message || "Failed to send email",
        });
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.length - sent;

    res.status(200).json({
      message: `Sent ${sent} of ${results.length} certificate(s)`,
      sent,
      failed,
      results,
    });
  } catch (error) {
    console.error("sendCertificates error:", error);
    res.status(500).json({ message: error.message });
  }
};
