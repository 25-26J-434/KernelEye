import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The research behind KernelEye and the team that built it.",
};

const team = ["Samarasinghe P. P.", "Gunawardana D. D. I.", "Aponso G. I. A.", "Sashmitha G. C. K."];

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

const references = [
  "Lentz et al., “Dissecting Overheads of Service Mesh Sidecars,” SoCC 2023",
  "Linux Foundation, “Introduction to eBPF,” 2021",
  "B. Gregg, “BPF Performance Tools,” Addison-Wesley, 2019",
  "Kubernetes Documentation, “DaemonSet”",
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / About
          </div>
          <h1>About KernelEye</h1>
          <p>
            KernelEye began as undergraduate research into a question: can Kubernetes orchestration be driven by what
            the kernel observes, without a sidecar in every pod?
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">The research</span>
            <h2>Architectural optimisation of Kubernetes with runtime-aware eBPF telemetry</h2>
            <p className="section-lead">
              Sidecar service meshes add a proxy to every pod. That proxy costs CPU and memory, adds a hop to every
              request, and takes part in every rollout. This project replaces it with kernel-level instrumentation
              and a single agent per node. The same telemetry then feeds routing, autoscaling, scheduling and
              inter-node coordination.
            </p>
            <div className="callout">
              Project <strong>{site.projectId}</strong> · Sri Lanka Institute of Information Technology (SLIIT)
            </div>
          </div>
          <div className="card">
            <h3>References</h3>
            <ol style={{ paddingLeft: 20, margin: 0, color: "var(--text-2)" }}>
              {references.map((r) => (
                <li key={r} style={{ padding: "6px 0" }}>
                  {r}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Team</span>
            <h2>The people behind KernelEye</h2>
          </div>
          <div className="grid-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {team.map((name) => (
              <div key={name} className="card team-card">
                <div className="avatar">{initials(name)}</div>
                <h3 style={{ marginBottom: 4 }}>{name}</h3>
                <p className="small">SLIIT</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Open source, MIT licensed.</h2>
              <p>Read the code, open an issue, or build an extension on the SPI.</p>
            </div>
            <div className="cta-actions">
              <a href={site.repo} className="btn btn-primary" target="_blank" rel="noreferrer">
                <Icon name="github" size={18} /> View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
