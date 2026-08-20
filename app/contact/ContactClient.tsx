"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("c-name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("c-email") as HTMLInputElement)?.value || "";
    const message = (form.elements.namedItem("c-message") as HTMLTextAreaElement)?.value || "";

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Couldn't send your message. Please try again.");
      setStatus("sent");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Couldn't send your message. Please try again.");
    }
  }

  return (
    <form className="acct-form contact-form" onSubmit={submit}>
      <div className="field">
        <input id="c-name" name="c-name" placeholder=" " required />
        <label htmlFor="c-name">Your name</label>
      </div>
      <div className="field">
        <input id="c-email" name="c-email" type="email" placeholder=" " required />
        <label htmlFor="c-email">Email address</label>
      </div>
      <div className="field">
        <textarea id="c-message" name="c-message" placeholder=" " required rows={5} />
        <label htmlFor="c-message">Message</label>
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "sent" && (
        <p className="save-ok" style={{ display: "block", marginTop: 12 }}>
          Message sent — we'll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="checkout-error" style={{ marginTop: 12 }} role="alert">
          {error} You can also email us directly at {CONTACT_EMAIL}.
        </p>
      )}
    </form>
  );
}
