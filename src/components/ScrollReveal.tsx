"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = [
  ".section-head",
  ".grid-3 > *",
  ".grid-2 > *",
  ".pipeline",
  ".metric-grid",
  ".compare > *",
  ".split > *",
  ".cta",
  ".tabs",
  ".timeline-item",
  ".plan",
].join(",");

/**
 * Fades sections in as they scroll into view. Purely progressive: elements are only
 * hidden after this runs, so content is fully visible without JavaScript, and
 * reduced-motion users get no animation (see .reveal in globals.css).
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only animate what starts below the fold; anything already on screen is never hidden.
    const fold = window.innerHeight;
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (el) => !el.classList.contains("reveal") && el.getBoundingClientRect().top > fold,
    );
    // Safety net: never leave content hidden, e.g. if the observer is throttled.
    const fallback = setTimeout(() => els.forEach((el) => el.classList.add("in")), 2500);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => {
      const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
      el.classList.add("reveal");
      io.observe(el);
    });
    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
