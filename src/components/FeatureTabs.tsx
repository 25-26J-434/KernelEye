"use client";

import Link from "next/link";
import { useState } from "react";
import type { Feature } from "@/lib/features";
import { CodeBlock } from "./CodeBlock";
import { Icon } from "./Icon";

/** Tabbed tour of the features; data comes from lib/features.ts. */
export function FeatureTabs({ items }: { items: Feature[] }) {
  const [active, setActive] = useState(0);
  const f = items[active];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % items.length);
    if (e.key === "ArrowLeft") setActive((i) => (i - 1 + items.length) % items.length);
  };

  return (
    <div className="tabs">
      <div className="tab-list" role="tablist" aria-label="Product features" onKeyDown={onKey}>
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            id={`tab-${item.slug}`}
            aria-selected={i === active}
            aria-controls={`panel-${item.slug}`}
            tabIndex={i === active ? 0 : -1}
            className={`tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <div
        key={f.slug}
        className="tab-panel"
        role="tabpanel"
        id={`panel-${f.slug}`}
        aria-labelledby={`tab-${f.slug}`}
      >
        <div>
          <h3 className="tab-title">{f.headline}</h3>
          <p className="tab-intro">{f.summary}</p>
          <ul className="checklist">
            {f.highlights.slice(0, 4).map((h) => (
              <li key={h.title}>
                <Icon name="check" size={18} />
                <span>
                  <strong>{h.title}.</strong> {h.body}
                </span>
              </li>
            ))}
          </ul>
          <Link href={`/features/${f.slug}/`} className="btn btn-ghost" style={{ marginTop: 20 }}>
            Explore {f.name} <Icon name="arrow" size={16} />
          </Link>
        </div>
        <CodeBlock title={f.code.title} lang={f.code.lang} code={f.code.body} />
      </div>
    </div>
  );
}
