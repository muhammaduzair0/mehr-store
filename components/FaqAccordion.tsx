"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: React.ReactNode };

export default function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div className="faq-item" key={item.q}>
          <button
            type="button"
            className="faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <span className={"faq-plus" + (open === i ? " open" : "")} aria-hidden="true" />
          </button>
          {open === i && <div className="faq-a">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}
