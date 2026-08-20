import nodemailer from "nodemailer";

// Generic SMTP sender — works with Gmail (host smtp.gmail.com + an app
// password) today and with any real business SMTP later by only changing
// env vars, no code changes.
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || (SMTP_USER ? `Mehr <${SMTP_USER}>` : undefined);

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const t = getTransporter();
  if (!t) {
    // SMTP isn't configured yet — log instead of throwing, so email being
    // unset never blocks an order or a contact submission from completing.
    console.warn(`[mailer] SMTP not configured — skipped email to ${opts.to}: ${opts.subject}`);
    return { skipped: true };
  }
  return t.sendMail({
    from: SMTP_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}
