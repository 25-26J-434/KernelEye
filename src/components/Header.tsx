"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav, site } from "@/lib/site";
import { CommandPalette } from "./CommandPalette";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href?: string, items?: { href: string }[]) => {
    const hrefs = href ? [href] : (items ?? []).map((i) => i.href);
    return hrefs.some((h) => h !== "/" && pathname.startsWith(h.replace(/\/$/, "")));
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container header-inner">
        <Logo />

        <nav className="nav-desktop" aria-label="Primary">
          {primaryNav.map((entry) =>
            entry.items ? (
              <div key={entry.label} className="nav-dropdown">
                <button
                  type="button"
                  className={`nav-link${isActive(undefined, entry.items) ? " active" : ""}`}
                  aria-haspopup="true"
                >
                  {entry.label}
                  <Icon name="chevron" size={14} className="nav-chevron" />
                </button>
                <div className={`dropdown-panel${entry.items.length > 5 ? " wide" : ""}`}>
                  {entry.items.map((item) => (
                    <Link key={item.href} href={item.href} className="dropdown-item">
                      <span className="dropdown-icon">
                        <Icon name={item.icon} size={17} />
                      </span>
                      <span>
                        <strong>
                          {item.label}
                          {item.badge && <em className="badge">{item.badge}</em>}
                        </strong>
                        <small>{item.description}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={entry.label}
                href={entry.href!}
                className={`nav-link${isActive(entry.href) ? " active" : ""}`}
              >
                {entry.label}
              </Link>
            ),
          )}
        </nav>

        <div className="header-actions">
          <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Icon name="search" size={15} />
            <span className="hide-sm">Search</span>
            <kbd className="hide-sm">Ctrl K</kbd>
          </button>
          <a href={site.repo} className="icon-btn" target="_blank" rel="noreferrer" aria-label="GitHub repository">
            <Icon name="github" size={18} />
          </a>
          <ThemeToggle />
          <Link href="/get-started/" className="btn btn-primary btn-sm hide-sm">
            Get Started
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="nav-mobile" aria-label="Mobile">
          {primaryNav.map((entry) =>
            entry.items ? (
              <div key={entry.label}>
                <p className="nav-mobile-label">{entry.label}</p>
                {entry.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Icon name={item.icon} size={18} /> {item.label}
                    {item.badge && <em className="badge">{item.badge}</em>}
                  </Link>
                ))}
              </div>
            ) : null,
          )}
          <p className="nav-mobile-label">Company</p>
          {primaryNav
            .filter((e) => e.href)
            .map((e) => (
              <Link key={e.label} href={e.href!}>
                {e.label}
              </Link>
            ))}
          <Link href="/get-started/" className="btn btn-primary" style={{ marginTop: 16, justifyContent: "center" }}>
            Get Started
          </Link>
        </nav>
      )}

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
