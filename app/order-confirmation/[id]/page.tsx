import Link from "next/link";
import { notFound } from "next/navigation";
import { wc } from "@/lib/woocommerce";
import { money } from "@/lib/format";

export const metadata = { title: "Order confirmed — Mehr" };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;

  // The numeric order id is sequential and guessable — the order_key
  // WooCommerce generates per-order (sent in the confirmation email/redirect)
  // is the actual proof of ownership here, same pattern WooCommerce's own
  // /checkout/order-received/ URLs use.
  const order = await wc.getOrder(Number(id)).catch(() => null);
  if (!order || !key || order.order_key !== key) notFound();

  return (
    <main className="wrap cart-page">
      <section className="confirm">
        <div className="confirm-mark">✓</div>
        <p className="eyebrow">Order confirmed</p>
        <h1 className="h-xl" style={{ margin: "16px auto 14px", maxWidth: "18ch" }}>
          Thank you — your scent is on its way.
        </h1>
        <p className="lead muted">
          A confirmation has been sent to <span>{order.billing?.email}</span>. Order{" "}
          <span className="tnum">#{order.number}</span>.
        </p>

        <div className="sum-lines" style={{ textAlign: "left", marginTop: 32 }}>
          {(order.line_items || []).map((li: any) => (
            <div className="sum-line" key={li.id}>
              <span className="sum-name">
                {li.name}
                <em>Qty {li.quantity}</em>
              </span>
              <span className="tnum">{money(li.total)}</span>
            </div>
          ))}
          <div className="summary-row total" style={{ marginTop: 10 }}>
            <span>Total</span>
            <span className="tnum">{money(order.total)}</span>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 20, fontSize: 13 }}>
          Placed {fmtDate(order.date_created)} · Shipping to {order.billing?.address_1}, {order.billing?.city}
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 34 }}>
          <Link className="btn btn-primary" href="/shop">
            Continue shopping
          </Link>
          <Link className="btn btn-outline" href="/">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
