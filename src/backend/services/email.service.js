import nodemailer from 'nodemailer';
import { logger } from '../logging/logger.js';

let transporter = null;

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  return transporter;
}

/**
 * Sends an email if SMTP credentials are provided in .env.
 * If SMTP is not configured, logs the payload to the console and logger.
 */
export async function sendEmail({ to, subject, html, text }) {
  const client = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || '"Willy Nilly Agro Tourism" <willynillyodisha@gmail.com>';

  if (!client) {
    logger.info('SMTP not configured in environment. Email logged to console instead.', {
      to,
      subject,
    });
    return {
      sent: false,
      deliveredVia: 'console_fallback',
      message: 'SMTP credentials not configured in .env. Output sent to server console.',
    };
  }

  try {
    const info = await client.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    logger.info('Email sent successfully via SMTP', {
      to,
      messageId: info.messageId,
    });

    return {
      sent: true,
      deliveredVia: 'smtp',
      messageId: info.messageId,
    };
  } catch (err) {
    logger.error('Failed to send email via SMTP transporter', {
      error: err.message,
      to,
    });
    // Fall back without crashing the request flow
    return {
      sent: false,
      deliveredVia: 'failed_smtp',
      error: err.message,
    };
  }
}

/**
 * Sends a password reset email to the admin with a branded HTML template.
 */
export async function sendPasswordResetEmail({ to, resetUrl, expiresMinutes = 15 }) {
  const subject = 'Password Reset Request — Willy Nilly Agro Tourism Admin';
  const text = `You requested a password reset for your Willy Nilly Administrator account.\n\nClick the link below to set a new password:\n${resetUrl}\n\nThis link is valid for ${expiresMinutes} minutes.\nIf you did not request this reset, you can safely ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9f6; margin: 0; padding: 0; color: #2d3748; }
        .container { max-width: 580px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0e3d2b 0%, #082218 100%); padding: 32px 24px; text-align: center; }
        .title { color: #f5d061; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 0; }
        .subtitle { color: #d1fae5; font-size: 13px; margin-top: 6px; }
        .body { padding: 32px 28px; line-height: 1.6; }
        .heading { font-size: 18px; font-weight: 700; color: #0e3d2b; margin-top: 0; margin-bottom: 12px; }
        .cta-container { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background-color: #0b3b28; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(11,59,40,0.25); }
        .alert-box { background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; font-size: 12px; color: #92400e; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px 28px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        .raw-link { word-break: break-all; color: #059669; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">WILLY NILLY</h1>
          <p class="subtitle">Agro Tourism & Farmhouse Estate Management</p>
        </div>
        <div class="body">
          <h2 class="heading">Administrator Password Reset</h2>
          <p>We received a request to reset the administrator password for <strong>${to}</strong>.</p>
          <p>Click the button below to choose a new password. This secure link is single-use and will expire in <strong>${expiresMinutes} minutes</strong>.</p>
          <div class="cta-container">
            <a href="${resetUrl}" target="_blank" class="cta-button">Reset Administrator Password</a>
          </div>
          <div class="alert-box">
            <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email or review your server audit logs immediately. No changes have been made to your account.
          </div>
          <p style="font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this link into your web browser:</p>
          <p class="raw-link">${resetUrl}</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Willy Nilly Agro Tourism. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html, text });
}

