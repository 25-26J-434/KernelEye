import Link from "next/link";
import { FeatureTabs } from "@/components/FeatureTabs";
import { HeroVisual } from "@/components/HeroVisual";
import { Icon } from "@/components/Icon";
import { features } from "@/lib/features";
import { site } from "@/lib/site";
import { useCases } from "@/lib/use-cases";
import { milestones, statusLabel } from "@/lib/roadmap";

const stats = [
  { value: "0", label: "Sidecars per pod", note: "One DaemonSet per node instead" },
  { value: "9", label: "eBPF programs", note: "DNS, TCP, RTT, sched, disk, DNAT…" },
  { value: "ns", label: "Timestamp precision", note: "Measured in-kernel with bpf_ktime" },
  { value: "5 s", label: "Scaling loop", note: "Rules re-evaluated on live telemetry" },
];

const sidecar = [
  "A proxy container injected into every pod",
  "CPU and memory reserved for every replica",
  "An extra user-space hop on every request",
  "Pod restarts to inject or upgrade the proxy",
  "Only sees what passes through the proxy",
];

const kerneleye = [
  "One DaemonSet per node. Workloads are untouched",
  "No per-pod resource reservation",
  "Traffic redirected at connect(), with no proxy in the path",
  "Upgrade the agent without restarting applications",
  "Sees DNS, TCP, scheduler and disk events in the kernel",
];

const pipeline = [
  {
    title: "Instrument",
    body: "Verified eBPF programs attach to kprobes, tracepoints and cgroup hooks on every node.",
    tag: "kprobe/udp_sendmsg",
  },
  {
    title: "Collect",
    body: "Events stream through ring buffers to the Go daemon, which maps IPs and PIDs to pods and containers.",
    tag: "ringbuf.NewReader()",
  },
  {
    title: "Decide",
    body: "Scaling rules are checked every five seconds. Routing policies run on demand or from your alerting pipeline.",
    tag: "POST /evaluate",
  },
  {
    title: "Act",
    body: "Redirect traffic, resize deployments, place pods and alert your team. Every action is recorded.",
    tag: "cgroup/connect4 DNAT",
  },
];

const tech = [
  { name: "eBPF / libbpf", c: "#f59e0b" },
  { name: "Go", c: "#00add8" },
  { name: "Kubernetes", c: "#326ce5" },
  { name: "MongoDB", c: "#47a248" },
  { name: "Prometheus", c: "#e6522c" },
  { name: "Next.js console", c: "#111827" },
];

const aiTeaser = [
  { kind: "Scaling", icon: "scale", title: "Scale checkout from 4 to 6 replicas", why: "DNS latency 4× baseline while CPU is 41%", confidence: 92 },
  { kind: "Routing", icon: "route", title: "Shift search traffic off worker-3", why: "Disk I/O latency 8× normal on that node", confidence: 87 },
  { kind: "Investigate", icon: "search", title: "Check payments network on worker-1", why: "Retransmits rising on one node only", confidence: 64 },
] as const;

const upcoming = milestones.filter((m) => m.status !== "shipped").slice(0, 6);
const shippedCount = milestones.filter((m) => m.status === "shipped").length;

export default function Home() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              <span className="pill">eBPF</span> Sidecar-less orchestration for Kubernetes
            </span>
            <h1>
              See your cluster <span className="grad">from the kernel up.</span>
            </h1>
            <p className="hero-lead">
              KernelEye measures DNS, TCP, scheduling and disk latency inside the Linux kernel. It then uses that
              telemetry to route traffic, scale workloads and coordinate nodes, with no sidecars and no code
              changes.
            </p>
            <div className="hero-ctas">
              <Link href="/get-started/" className="btn btn-primary">
                Get Started <Icon name="arrow" size={18} />
              </Link>
              <Link href="/architecture/" className="btn btn-ghost">
                How it works
              </Link>
            </div>
            <div className="hero-install">
              <span className="prompt">$</span> kubectl apply -f k8s/daemonset.yaml
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Platform</span>
            <h2>One kernel data plane. Five capabilities.</h2>
            <p className="section-lead">
              Every component reads from the same kernel telemetry. Observability, routing, scaling and federation
              all work from the same numbers.
            </p>
          </div>
          <FeatureTabs items={features} />
        </div>
      </section>

      {/* ---------------- USE CASES ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Use cases</span>
            <h2>What teams use it for</h2>
            <p className="section-lead">
              Real problems, solved with the signals your kernel already produces.
            </p>
          </div>
          <div className="grid-3">
            {useCases.map((u) => (
              <Link key={u.id} href={`/use-cases/#${u.id}`} className="card usecase-card">
                <span className="card-icon">
                  <Icon name={u.icon} />
                </span>
                <div className="industry">{u.industry}</div>
                <h3>{u.title}</h3>
                <p>{u.outcomes[0]}.</p>
                <span className="card-link">
                  See how <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY SIDECAR-LESS ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Why sidecar-less</span>
            <h2>Stop paying the sidecar tax on every pod.</h2>
            <p className="section-lead">
              Traditional service meshes add a proxy to every replica. KernelEye puts one agent on each node and
              observes and steers traffic where it already flows: in the Linux kernel.
            </p>
          </div>
          <div className="compare">
            <div className="compare-col">
              <h3>Sidecar service mesh</h3>
              <ul>
                {sidecar.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="compare-col good">
              <h3>
                <Icon name="eye" /> KernelEye
              </h3>
              <ul>
                {kerneleye.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">How it works</span>
            <h2>From kernel event to cluster action</h2>
            <p className="section-lead">A single closed loop, running on every node.</p>
          </div>
          <div className="pipeline">
            {pipeline.map((p) => (
              <div key={p.title} className="pipe-step">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="tag">{p.tag}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/architecture/" className="btn btn-ghost">
              Explore the architecture <Icon name="arrow" size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------- AI TEASER ---------------- */}
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">
              <span className="pill">Coming soon</span> KernelEye AI
            </span>
            <h2>
              Suggestions you can <span className="grad-text">review, trust and apply.</span>
            </h2>
            <p className="section-lead">
              KernelEye AI will turn kernel telemetry into concrete routing and scaling changes, each with its
              evidence, a confidence score and an approve button.
            </p>
            <div className="hero-ctas" style={{ marginTop: 28 }}>
              <Link href="/ai/" className="btn btn-primary">
                Try the interactive preview <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
          <div className="ai-teaser">
            {aiTeaser.map((s) => (
              <div key={s.title} className="ai-teaser-item">
                <span className={`kind ${s.kind.toLowerCase()}`}>
                  <Icon name={s.icon} size={14} /> {s.kind}
                </span>
                <strong>{s.title}</strong>
                <span className="muted small">{s.why}</span>
                <span className="confidence">
                  <span className="meter">
                    <span style={{ width: `${s.confidence}%` }} />
                  </span>
                  {s.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ROADMAP TEASER ---------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Roadmap</span>
            <h2>Where KernelEye is going</h2>
            <p className="section-lead">
              {shippedCount} milestones shipped since December 2025. This is what comes next.
            </p>
          </div>
          <div className="grid-3">
            {upcoming.map((m) => (
              <div key={m.title} className="card">
                <div className="card-row">
                  <span className="card-icon">
                    <Icon name={m.icon} />
                  </span>
                  <span className={`status-pill ${m.status}`}>{statusLabel[m.status]}</span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 32 }}>
            <Link href="/roadmap/" className="btn btn-ghost">
              View the full roadmap <Icon name="arrow" size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------- TECH ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Built on open standards</span>
            <h2>Fits the stack you already run</h2>
          </div>
          <div className="tech-strip">
            {tech.map((t) => (
              <span key={t.name} className="tech" style={{ "--c": t.c } as React.CSSProperties}>
                <i /> {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Put kernel telemetry to work on your cluster.</h2>
              <p>
                Push one image, apply one DaemonSet and connect MongoDB. Then add alerts, scaling rules and
                routing policies at your own pace.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/get-started/" className="btn btn-primary">
                <Icon name="rocket" size={18} /> Deploy guide
              </Link>
              <a href={site.repo} className="btn btn-ghost" target="_blank" rel="noreferrer">
                <Icon name="github" size={18} /> Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
