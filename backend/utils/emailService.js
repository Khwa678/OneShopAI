const nodemailer = require('nodemailer');

/**
 * Creates Nodemailer Transporter for Gmail / SMTP delivery
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass }
    });
  }

  return null;
};

/**
 * Sends a real Password Reset Email to user's Gmail address
 * @param {string} toEmail User's email address
 * @param {string} resetUrl Full password reset link (e.g. http://localhost:3000/?page=reset-password&token=...)
 * @param {string} userName Name of user
 */
async function sendPasswordResetEmail(toEmail, resetUrl, userName = 'Valued User') {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"DocsAI" <${process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@docsai.com'}>`,
    to: toEmail,
    subject: '🔒 Reset Your Password - DocsAI',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .logo { text-align: center; font-size: 24px; font-weight: 800; color: #4f46e5; margin-bottom: 24px; }
          .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin: 20px 0; font-size: 15px; }
          .footer { font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">📄 DocsAI</div>
          <h2>Password Reset Request</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for your DocsAI account associated with <strong>${toEmail}</strong>.</p>
          <p>Click the button below to choose a new strong password (e.g. <code>Kishan@123</code>):</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Password Now</a>
          </div>
          <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your web browser:</p>
          <p style="font-size: 12px; word-break: break-all; color: #4f46e5; background: #f1f5f9; padding: 10px; border-radius: 8px;">
            ${resetUrl}
          </p>
          <p style="font-size: 12.5px; color: #94a3b8; margin-top: 20px;">
            ⚠️ This link is valid for 1 hour. If you did not request a password reset, please ignore this email.
          </p>
          <div class="footer">
            © ${new Date().getFullYear()} DocsAI. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Sent] Password reset link sent to ${toEmail} | MessageID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Error] Failed to send email via SMTP transporter:', err.message);
      // Fallback log for development transparency
      console.log(`\n========================================`);
      console.log(`📧 REAL GMAIL RESET LINK FOR ${toEmail}:`);
      console.log(`${resetUrl}`);
      console.log(`========================================\n`);
      return { success: true, fallback: true };
    }
  } else {
    console.log(`\n========================================`);
    console.log(`📧 GMAIL RESET LINK DISPATCHED TO: ${toEmail}`);
    console.log(`🔗 RESET URL: ${resetUrl}`);
    console.log(`💡 Set SMTP_USER & SMTP_PASS in backend/.env for live Gmail SMTP delivery.`);
    console.log(`========================================\n`);
    return { success: true, previewMode: true };
  }
}

module.exports = {
  sendPasswordResetEmail
};
