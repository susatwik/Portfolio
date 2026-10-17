/**
 * Serverless Contact API Handler
 * Handles portfolio inquiries, validates inputs, prevents bot spam and header injection,
 * and delivers emails directly to Susatwik Manuri (sathwvikmanuri@gmail.com) via direct SMTP.
 *
 * Direct SMTP Connection: Contact Form -> /api/contact -> Direct SMTP -> sathwvikmanuri@gmail.com
 * No third-party form services.
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Auto-load .env file if present in the workspace
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val.trim();
        }
      }
    }
  }
} catch (e) {
  // Silent ignore
}

// In-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old entries periodically
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}

// Basic HTML sanitization for email body rendering
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  // CORS & Allowed Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      error: 'Method Not Allowed. Only POST requests are accepted.'
    });
  }

  try {
    // 1. IP Rate Limiting Check
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';

    cleanupRateLimit();
    const now = Date.now();
    const clientRequests = rateLimitMap.get(clientIp) || [];
    const recentRequests = clientRequests.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        ok: false,
        error: 'Too many messages sent from this connection. Please wait a few minutes before trying again or email directly at sathwvikmanuri@gmail.com.'
      });
    }

    // 2. Parse & Validate Payload Size
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ ok: false, error: 'Malformed JSON payload.' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid request body.' });
    }

    // 3. Honeypot Bot Trap Check
    if (body._gotcha && String(body._gotcha).trim().length > 0) {
      // Silently accept without sending email to prevent spammer learning
      return res.status(200).json({
        ok: true,
        message: 'Message received successfully.'
      });
    }

    // 4. Server-Side Field Validation
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const url = typeof body.url === 'string' ? body.url.trim() : '';

    if (!name || name.length < 2 || name.length > 100) {
      return res.status(400).json({ ok: false, error: 'Please provide a valid full name (2–100 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 100) {
      return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
    }

    // Prevent Header Injection (CRLF in name, email, or subject)
    if (/[\r\n]/.test(email) || /[\r\n]/.test(subject) || /[\r\n]/.test(name)) {
      return res.status(400).json({ ok: false, error: 'Invalid characters in form submission.' });
    }

    if (!reason || reason.length > 100) {
      return res.status(400).json({ ok: false, error: 'Please select a reason for contacting.' });
    }

    if (!subject || subject.length < 3 || subject.length > 150) {
      return res.status(400).json({ ok: false, error: 'Please provide a subject (3–150 characters).' });
    }

    if (!message || message.length < 20 || message.length > 2000) {
      return res.status(400).json({ ok: false, error: 'Please provide a message between 20 and 2,000 characters.' });
    }

    if (url) {
      if (url.length > 200 || !/^https?:\/\//i.test(url)) {
        return res.status(400).json({ ok: false, error: 'Portfolio/Company URL must start with http:// or https:// (max 200 chars).' });
      }
    }

    // 5. Environment & SMTP Email Configuration
    const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const smtpPort = parseInt((process.env.SMTP_PORT || '465').trim(), 10);
    const smtpSecure = String(process.env.SMTP_SECURE).trim() === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';
    const toEmail = (process.env.CONTACT_TO_EMAIL || 'sathwvikmanuri@gmail.com').trim();
    const fromEmail = (process.env.CONTACT_FROM_EMAIL || smtpUser || 'sathwvikmanuri@gmail.com').trim();

    // Fallback mailto payload constructed safely
    const fallbackPayload = {
      type: 'mailto',
      to: toEmail,
      subject: `[Portfolio Inquiry] ${subject}`,
      body: `Hi Susatwik,\n\nName: ${name}\nEmail: ${email}\nInquiry Type: ${reason}\n${url ? `Website / URL: ${url}\n` : ''}\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form`
    };

    // If SMTP is unconfigured, return actionable fallback without falsely reporting delivery
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('[CONTACT_API_NOTICE] SMTP credentials are not configured in environment variables.');
      return res.status(503).json({
        ok: false,
        error: 'Direct email delivery service is currently unconfigured with SMTP credentials on this server.',
        fallback: fallbackPayload
      });
    }

    // Sanitize Gmail App Password spaces if present
    const cleanPass = (smtpPass && smtpHost.includes('gmail.com'))
      ? smtpPass.replace(/\s+/g, '')
      : smtpPass;

    // Record rate limit hit for valid attempt
    recentRequests.push(now);
    rateLimitMap.set(clientIp, recentRequests);

    // 6. Format HTML & Plaintext Email Templates
    const timestamp = new Date().toUTCString();
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeReason = escapeHtml(reason);
    const safeSubject = escapeHtml(subject);
    const safeUrl = escapeHtml(url);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    const emailSubject = `[Portfolio Contact] ${subject}`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${emailSubject}</title>
</head>
<body style="margin:0;padding:24px;background-color:#050608;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F4F7FC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background-color:#0B0E13;border:1px solid #1E2838;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="padding:28px 32px;background:linear-gradient(135deg, #101A2B 0%, #0B0E13 100%);border-bottom:1px solid #1E2838;">
        <span style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#4F8CFF;font-weight:700;">NEW PORTFOLIO INQUIRY</span>
        <h1 style="margin:8px 0 0;font-size:20px;line-height:1.3;color:#F4F7FC;font-weight:700;">${safeSubject}</h1>
        <p style="margin:6px 0 0;font-size:12px;color:#A8D2FF;">Category: ${safeReason}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;width:120px;font-size:12px;color:#7A96BA;text-transform:uppercase;letter-spacing:0.06em;">Sender:</td>
            <td style="padding:8px 0;font-size:14px;color:#F4F7FC;font-weight:600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#7A96BA;text-transform:uppercase;letter-spacing:0.06em;">Reply Email:</td>
            <td style="padding:8px 0;font-size:14px;color:#4F8CFF;"><a href="mailto:${safeEmail}" style="color:#4F8CFF;text-decoration:none;">${safeEmail}</a></td>
          </tr>
          ${safeUrl ? `
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#7A96BA;text-transform:uppercase;letter-spacing:0.06em;">Website / URL:</td>
            <td style="padding:8px 0;font-size:14px;color:#A8D2FF;"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color:#A8D2FF;text-decoration:underline;">${safeUrl}</a></td>
          </tr>` : ''}
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#7A96BA;text-transform:uppercase;letter-spacing:0.06em;">Received:</td>
            <td style="padding:8px 0;font-size:12px;color:#C4CBD6;">${timestamp}</td>
          </tr>
        </table>

        <div style="margin-top:16px;">
          <span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#7A96BA;display:block;margin-bottom:8px;">Message Content:</span>
          <div style="background-color:#050608;border:1px solid #1E2838;border-left:3px solid #4F8CFF;border-radius:6px;padding:18px 20px;font-size:14px;line-height:1.7;color:#F4F7FC;">
            ${safeMessage}
          </div>
        </div>

        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1E2838;text-align:center;">
          <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject)}" style="display:inline-block;background-color:#4F8CFF;color:#050608;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">Reply to ${safeName} &rarr;</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;background-color:#050608;border-top:1px solid #141B26;text-align:center;font-size:11px;color:#61728B;">
        Sent via Susatwik Manuri Portfolio Contact Form (<a href="https://susatwik.dev" style="color:#7A96BA;text-decoration:none;">susatwik.dev</a>)
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

    const emailText = `
NEW PORTFOLIO INQUIRY
===================================================
From: ${name} <${email}>
Reason: ${reason}
Subject: ${subject}
${url ? `Website / Company: ${url}\n` : ''}Date: ${timestamp}

MESSAGE:
---------------------------------------------------
${message}
---------------------------------------------------

Reply directly to this email to respond to ${name}.
Sent via Portfolio Contact Form
`.trim();

    // 7. Dispatch via Direct SMTP using Nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // SSL for 465, STARTTLS for 587
      auth: {
        user: smtpUser,
        pass: cleanPass
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    const info = await transporter.sendMail({
      from: `"${name} via Portfolio" <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    });

    return res.status(200).json({
      ok: true,
      messageId: info.messageId,
      message: "Your message has been submitted successfully. Thank you for taking the time to connect with me. I appreciate your interest and will review your message and get back to you as soon as possible."
    });

  } catch (err) {
    console.error('[SMTP_DELIVERY_ERROR]', err.message || 'SMTP delivery failed');
    return res.status(502).json({
      ok: false,
      error: `Email delivery failed via mail server: ${err.message || 'Unable to connect to SMTP host'}. Please use the direct email link below or email sathwvikmanuri@gmail.com directly.`,
      fallback: {
        type: 'mailto',
        to: process.env.CONTACT_TO_EMAIL || 'sathwvikmanuri@gmail.com',
        subject: `[Portfolio Inquiry] ${req.body?.subject || 'Contact'}`,
        body: `Hi Susatwik,\n\nName: ${req.body?.name || ''}\nEmail: ${req.body?.email || ''}\nMessage:\n${req.body?.message || ''}`
      }
    });
  }
};

module.exports.default = module.exports;
