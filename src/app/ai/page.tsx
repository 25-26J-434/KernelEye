import type { Metadata } from "next";
import Link from "next/link";
import { AiDemo } from "@/components/AiDemo";
import { Icon, type IconName } from "@/components/Icon";
import { contactLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "KernelEye AI",
  description: "Coming soon: AI that turns kernel telemetry into explained routing and scaling suggestions you can review and apply.",
};

const how: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "database",
    title: "Learn your baseline",
    body: "Historical kernel telemetry builds a per-service picture of normal DNS, RTT, disk and run-queue latency.",
  },
  {
    icon: "activity",
    title: "Spot what matters",
    body: "Deviations are correlated across pods, nodes and services, so one slow disk isn't reported as ten separate incidents.",
  },
  {
    icon: "wand",
    title: "Suggest a change",
    body: "Each suggestion is a concrete scaling rule or routing policy, using the same API you can call yourself.",
  },
  {
    icon: "users",
    title: "Explain and ask",
    body: "Every suggestion comes with evidence and a confidence score. Nothing is applied without approval unless you enable autopilot.",
  },
];

const principles = [
  "Suggestions are real KernelEye API calls you can inspect, edit or reject",
  "Guardrails such as max replicas, TTLs and protected namespaces always apply",
  "Low-confidence findings become investigations, not automatic changes",
  "Every suggestion and approval is recorded for audit",
];

export default function Ai() {
  return (
    <>
      <section className="page-hero ai-hero">
        <div className="container">
          <span className="eyebrow">
            <span className="pill">Coming soon</span> KernelEye AI
          </span>
          <h1>
            Your cluster, <span className="grad-text">explained and tuned.</span>
          </h1>
          <p>
            KernelEye AI will read the telemetry your kernel already produces and suggest the routing and scaling
            changes that would help, each with its reasoning attached. You review and approve, and it applies them.
          </p>
          <div className="hero-ctas" style={{ marginTop: 28 }}>
            <a href={contactLink("KernelEye AI early access")} className="btn btn-primary" target="_blank" rel="noreferrer">
              Request early access <Icon name="arrow" size={18} />
            </a>
            <a href="#demo" className="btn btn-ghost">
              Try the preview
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="demo">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Interactive preview</span>
            <h2>See how a suggestion is made</h2>
            <p className="section-lead">
              This preview runs on simulated data, but the suggested changes use the real KernelEye API format.
            </p>
          </div>
          <AiDemo />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="kicker">How it will work</span>
            <h2>From signal to suggestion</h2>
          </div>
          <div className="pipeline">
            {how.map((h) => (
              <div key={h.title} className="pipe-step">
                <span className="card-icon">
                  <Icon name={h.icon} />
                </span>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="kicker">Trust by design</span>
            <h2>An assistant, not a black box.</h2>
            <p className="section-lead">
              Infrastructure automation fails when you can&apos;t see why it acted. KernelEye AI is designed to show
              its work and stay inside the limits you set.
            </p>
            <ul className="checklist">
              {principles.map((p) => (
                <li key={p}>
                  <Icon name="check" size={18} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <span className="status-pill shipped">Available today</span>
            <h3 style={{ marginTop: 16 }}>Rule-based recommendations</h3>
            <p>
              The KernelEye console already flags pods with high DNS latency, TCP retransmissions, packet loss or CPU
              scheduling delay against configurable thresholds. KernelEye AI builds on these signals.
            </p>
            <Link href="/roadmap/" className="card-link">
              See the AI roadmap <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
