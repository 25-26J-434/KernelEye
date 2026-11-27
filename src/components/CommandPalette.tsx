"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex } from "@/lib/site";
import { useCases } from "@/lib/use-cases";
import { Icon } from "./Icon";

const groupOrder = ["Pages", "Product", "Use cases", "Resources"];

const entries = [
  ...searchIndex,
  ...useCases.map((u) => ({
    label: u.title,
    href: `/use-cases/#${u.id}`,
    icon: u.icon,
    group: "Use cases",
    keywords: `${u.industry} ${u.problem}`,
  })),
].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => `${e.label} ${e.group} ${e.keywords ?? ""}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].href);
    }
  };

  let lastGroup = "";

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="palette-input">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features, use cases, docs…"
            aria-label="Search"
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="palette-list" role="listbox">
          {results.length === 0 && <li className="palette-empty">No results for “{query}”</li>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <li key={r.href + r.label} role="presentation">
                {header && <div className="palette-group">{header}</div>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`palette-item${i === active ? " active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.href)}
                >
                  <Icon name={r.icon} size={17} />
                  <span>{r.label}</span>
                  {i === active && <Icon name="enter" size={15} className="palette-enter" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
