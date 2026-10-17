/**
 * SMTP Configuration & Connection Diagnostic Tool
 * Checks SMTP credentials in .env and verifies the connection to smtp.gmail.com:465
 * NEVER prints credentials or passwords.
 */
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Auto-load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || '465', 10);
const secure = process.env.SMTP_SECURE === 'true' || port === 465;
const user = process.env.SMTP_USER;
const rawPass = process.env.SMTP_PASS;
const pass = (rawPass && host.includes('gmail.com')) ? rawPass.replace(/\s+/g, '') : rawPass;

console.log('\n--- SMTP CONFIGURATION CHECK ---');
console.log(`Host:    ${host}`);
console.log(`Port:    ${port}`);
console.log(`Secure:  ${secure} (TLS/SSL)`);
console.log(`User:    ${user ? `${user.slice(0, 3)}***@${user.split('@')[1] || 'domain'}` : 'NOT SET'}`);
console.log(`Pass:    ${pass ? '[CONFIGURED - ' + pass.length + ' chars]' : 'NOT SET'}`);

if (!user || !pass) {
  console.error('\n❌ ERROR: SMTP_USER or SMTP_PASS is missing in .env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  tls: { rejectUnauthorized: true }
});

console.log('\nConnecting to SMTP server...');
transporter.verify((err) => {
  if (err) {
    console.error('\n❌ SMTP CONNECTION FAILED:');
    console.error(`Message: ${err.message}`);
    if (err.code === 'EAUTH') {
      console.error('Hint: Google rejected authentication. Verify that 2-Step Verification is ON and you are using a 16-character App Password (not your normal Google account password).');
    }
    process.exit(1);
  } else {
    console.log('\n✅ SUCCESS: SMTP server is ready and credentials are verified.');
    console.log('You can now send real messages from the portfolio contact form.');
    process.exit(0);
  }
});
