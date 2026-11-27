import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { Icon, type IconName } from "@/components/Icon";
import { contactLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enterprise",
  description: "KernelEye for regulated, multi-cluster and air-gapped environments.",
};

type Availability = "shipped" | "planned";

const capabilities: { icon: IconName; title: string; body: string; status: Availability }[] = [
  {
    icon: "key",
    title: "SSO / SAML & RBAC",
    body: "Sign in with your identity provider. Scope who can view telemetry, edit policies or approve automated actions.",
    status: "planned",
  },
  {
    icon: "audit",
    title: "Audit log",
    body: "A tamper-evident record of every redirect, scale event and AI suggestion, including who approved it and why.",
    status: "planned",
  },
  {
    icon: "globe",
    title: "Multi-cluster console",
    body: "One console for every cluster and region, built on KernelEye's node-to-node federation.",
    status: "planned",
  },
  {
    icon: "lock",
    title: "Air-gapped & on-prem",
    body: "Offline installation bundles and self-hosted AI models for environments without internet access.",
    status: "planned",
  },
  {
    icon: "wand",
    title: "AI autopilot with guardrails",
    body: "Let KernelEye apply its own suggestions within limits you set, with approval workflows and dry runs.",
    status: "planned",
  },
  {
    icon: "support",
    title: "Support with an SLA",
    body: "Guaranteed response times, a named engineer, upgrade planning and architecture reviews.",
    status: "planned",
  },
];

const foundations: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "shield",
    title: "Kernel-verified safety",
    body: "Every eBPF program passes the Linux verifier before it loads. It cannot crash the kernel or read memory it should not.",
  },
  {
    icon: "server",
    title: "Your data, your cluster",
    body: "The agent, API and storage all run in your infrastructure. Telemetry is never sent anywhere by default.",
  },
  {
    icon: "code",
    title: "Open source core",
    body: "The agent is MIT licensed and auditable line by line, with no black-box binaries on your nodes.",
  },
  {
    icon: "layers",
    title: "No workload changes",
    body: "No sidecars, SDKs or restarts. Adoption is a platform-team decision, not a request to every service owner.",
  },
];

const steps = [
  { title: "Discovery call", body: "We map your clusters, compliance needs and the problems you want solved." },
  { title: "Guided pilot", body: "We deploy to a staging cluster together and set success criteria for latency, cost and toil." },
  { title: "Production rollout", body: "We roll out node pool by node pool, with alerts first and automation second." },
  { title: "Ongoing partnership", body: "Quarterly reviews, early access to new features and a direct line to engineering." },
];

const faq = [
  {
    q: "Is the Enterprise edition available today?",
    a: "Not yet. Enterprise capabilities are on the roadmap. Teams that get in touch now can join the design-partner programme and help shape them.",
  },
  {
    q: "Can we run KernelEye with no internet access?",
    a: "The Community agent already runs fully inside your cluster. Enterprise will add offline install bundles and self-hosted AI models for air-gapped sites.",
  },
  {
    q: "What does the agent need on our nodes?",
    a: "Linux 5.8 or later with BTF, and a privileged DaemonSet in its own namespace. The deploy guide lists the exact capabilities and mounts.",
  },
  {
    q: "Do you support managed Kubernetes?",
    a: "Yes. KernelEye runs as an ordinary DaemonSet, so it works on managed and self-managed clusters whose node images meet the kernel requirements.",
  },
];

export default function Enterprise() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="kicker">Enterprise</span>
          <h1>Kernel-level control for teams that can&apos;t afford surprises.</h1>
          <p>
            KernelEye Enterprise is planned for regulated, multi-cluster and air-gapped environments. It adds
            identity, audit, governance and guaranteed support on top of the open-source core.
          </p>
          <div className="hero-ctas" style={{ marginTop: 28 }}>
            <a href={contactLink("Enterprise enquiry")} className="btn btn-primary" target="_blank" rel="noreferrer">
              Talk to us <Icon name="arrow" size={18} />
            </a>
            <Link href="/pricing/" className="btn btn-ghost">
              Compare plans
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Capabilities</span>
            <h2>Built for governance at scale</h2>
            <p className="section-lead">
              Planned capabilities, prioritised with our design partners. See the <Link href="/roadmap/">roadmap</Link>{" "}
              for progress.
            </p>
          </div>
          <div className="grid-3">
            {capabilities.map((c) => (
              <div key={c.title} className="card">
                <div className="card-row">
                  <span className="card-icon">
                    <Icon name={c.icon} />
                  </span>
                  <span className={`status-pill ${c.status}`}>{c.status === "shipped" ? "Available" : "Planned"}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Foundations</span>
            <h2>Secure by design, available today</h2>
          </div>
          <div className="grid-2">
            {foundations.map((f) => (
              <div key={f.title} className="card card-inline">
                <span className="card-icon">
                  <Icon name={f.icon} />
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">How we work together</span>
            <h2>From first call to production</h2>
          </div>
          <div className="pipeline">
            {steps.map((s) => (
              <div key={s.title} className="pipe-step">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container faq-layout">
          <div>
            <span className="kicker">FAQ</span>
            <h2>Enterprise questions</h2>
          </div>
          <Faq items={faq} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Become a design partner.</h2>
              <p>Help shape SSO, audit and AI autopilot, and get early access while it is built.</p>
            </div>
            <div className="cta-actions">
              <a href={contactLink("Enterprise design partner")} className="btn btn-primary" target="_blank" rel="noreferrer">
                Get in touch <Icon name="arrow" size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
