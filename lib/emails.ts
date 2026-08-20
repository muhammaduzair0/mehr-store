import { money } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/contact";

const wrap = (title: string, bodyHtml: string) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f2;font-family:Helvetica,Arial,sans-serif;color:#1a1d29;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;width:100%;">
            <tr>
              <td style="padding:32px 36px 8px;text-align:center;">
                <span style="font-size:22px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">Mehr</span>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 36px 36px;">
                <h1 style="font-size:20px;font-weight:500;margin:0 0 18px;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;border-top:1px solid #eaeae6;text-align:center;font-size:12px;color:#8a8d99;">
                Mehr &middot; <a href="mailto:${CONTACT_EMAIL}" style="color:#8a8d99;">${CONTACT_EMAIL}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export function orderConfirmationEmail(order: {
  number: string | number;
  id: string | number;
  order_key: string;
  billing: { first_name: string; last_name: string; email: string; address_1: string; city: string; postcode: string };
  line_items: { name: string; quantity: number; total: string }[];
  total: string;
}) {
  const confirmUrl = `${SITE_URL}/order-confirmation/${order.id}?key=${encodeURIComponent(order.order_key)}`;
  const rows = order.line_items
    .map(
      (li) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eaeae6;font-size:14px;">${li.name} &times; ${li.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eaeae6;font-size:14px;text-align:right;">${money(li.total)}</td>
        </tr>`
    )
    .join("");

  const html = wrap(
    "Thank you — your scent is on its way.",
    `
      <p style="font-size:14px;line-height:1.6;color:#4a4d59;margin:0 0 20px;">
        Hi ${order.billing.first_name || "there"}, we've received order <strong>#${order.number}</strong> and it's being prepared for delivery.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
        <tr>
          <td style="padding:14px 0 0;font-size:14px;font-weight:600;">Total</td>
          <td style="padding:14px 0 0;font-size:14px;font-weight:600;text-align:right;">${money(order.total)}</td>
        </tr>
      </table>
      <p style="font-size:14px;line-height:1.6;color:#4a4d59;margin:24px 0 0;">
        Shipping to ${order.billing.address_1}, ${order.billing.city} ${order.billing.postcode}.<br/>
        Payment: Cash on Delivery.
      </p>
      <p style="margin:28px 0 0;">
        <a href="${confirmUrl}" style="display:inline-block;background:#1a1d29;color:#ffffff;text-decoration:none;padding:12px 22px;font-size:14px;">View your order</a>
      </p>
    `
  );

  return {
    subject: `Order confirmed — #${order.number}`,
    html,
    text: `Order #${order.number} confirmed. Total ${money(order.total)}. View: ${confirmUrl}`,
  };
}

export function contactNotificationEmail(msg: { name: string; email: string; message: string }) {
  const html = wrap(
    "New message from the website",
    `
      <p style="font-size:14px;line-height:1.6;color:#4a4d59;margin:0 0 6px;"><strong>From:</strong> ${msg.name} (${msg.email})</p>
      <p style="font-size:14px;line-height:1.6;color:#1a1d29;white-space:pre-wrap;margin:18px 0 0;">${msg.message}</p>
    `
  );
  return {
    subject: `Website message from ${msg.name}`,
    html,
    text: `From: ${msg.name} (${msg.email})\n\n${msg.message}`,
  };
}
