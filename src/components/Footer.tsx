import Link from "next/link";
import { productMenu, repoFile, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>{site.tagline}. Kernel-level telemetry that drives routing, scaling and coordination.</p>
          <p className="muted small">Research project {site.projectId} · Sri Lanka Institute of Information Technology</p>
        </div>
        <div>
          <h4>Product</h4>
          {productMenu.map((m) => (
            <Link key={m.href} href={m.href}>
              {m.label}
            </Link>
          ))}
        </div>
        <div>
          <h4>Learn</h4>
          <Link href="/use-cases/">Use Cases</Link>
          <Link href="/get-started/">Deploy guide</Link>
          <Link href="/architecture/">Architecture</Link>
          <Link href="/docs/">Documentation</Link>
          <a href={repoFile("docs/API_DOCUMENTATION.md")} target="_blank" rel="noreferrer">
            API Reference
          </a>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/pricing/">Pricing</Link>
          <Link href="/enterprise/">Enterprise</Link>
          <Link href="/roadmap/">Roadmap</Link>
          <Link href="/about/">About & Team</Link>
          <a href={site.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} The KernelEye authors. Released under the MIT License.</span>
        <span>Built with eBPF, Go and Kubernetes.</span>
      </div>
    </footer>
  );
}
