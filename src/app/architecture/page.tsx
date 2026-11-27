import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Icon, type IconName } from "@/components/Icon";
import { repoFile } from "@/lib/site";
import highLevel from "@/assets/high-level-architecture.png";
import nodeView from "@/assets/cluster-node-logical-view.png";
import spi from "@/assets/unified-spi-interface.png";

export const metadata: Metadata = {
  title: "Architecture",
  description: "How KernelEye moves data from kernel hooks to cluster-wide decisions.",
};

const principles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "layers",
    title: "Sidecar-less",
    body: "One DaemonSet per node replaces a proxy in every pod, so there is no per-replica overhead and no injected containers.",
  },
  {
    icon: "eye",
    title: "Zero application impact",
    body: "Telemetry is collected in the kernel. Applications run unmodified and need no SDK, agent or restart.",
  },
  {
    icon: "bolt",
    title: "Real-time",
    body: "Ring buffers deliver events to user space with sub-second latency, fast enough to make decisions in a control loop.",
  },
  {
    icon: "route",
    title: "Bi-directional",
    body: "KernelEye writes as well as reads. eBPF maps and DNAT programs let it act in the kernel, not only observe it.",
  },
  {
    icon: "plug",
    title: "Pluggable SPI",
    body: "Collectors, policies and integrations implement one common interface and are discovered through a registry.",
  },
  {
    icon: "shield",
    title: "Safe by construction",
    body: "Every program passes the kernel verifier before it loads, so it cannot crash the kernel or read unauthorised memory.",
  },
];

const hooks = [
  { group: "Tracing", items: ["kprobe", "kretprobe", "tracepoint", "fentry"], used: "DNS, RTT, TCP, scheduler, disk I/O, sockets" },
  { group: "Networking", items: ["cgroup/connect4"], used: "Socket-level DNAT redirection for adaptive routing" },
  { group: "Maps", items: ["ring buffer", "hash", "array"], used: "Kernel → user-space events, and user-space → kernel actions" },
];

const flow = `┌──────────────┐   ringbuf    ┌──────────────────┐   REST / WS   ┌──────────────┐
│ eBPF program │ ───────────► │  Go daemon       │ ────────────► │  Console     │
│ (kernel)     │   hash maps  │  · K8s enrich    │   Prometheus  │  Routing     │
│ kprobe/tp    │              │  · aggregate     │               │  Scaling     │
└──────────────┘              │  · SPI plugins   │ ◄──── P2P ──► │  Federation  │
        ▲                     └──────────────────┘   other nodes └──────────────┘
        │         eBPF map writes (DNAT, actions)          │
        └──────────────────────────────────────────────────┘`;

export default function Architecture() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Architecture
          </div>
          <h1>Architecture</h1>
          <p>
            KernelEye is a closed loop. eBPF programs observe the kernel, a per-node daemon turns raw events into
            pod-aware metrics, and pluggable engines act on them across the cluster.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Design principles</span>
            <h2>Built around the kernel, not around a proxy</h2>
          </div>
          <div className="grid-3">
            {principles.map((p) => (
              <div key={p.title} className="card">
                <span className="card-icon">
                  <Icon name={p.icon} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="kicker">System view</span>
            <h2>High-level architecture</h2>
            <p className="section-lead">
              The management console, adaptive routing, adaptive scheduling and multi-cluster coordination all sit on
              a sidecar-less base feature provider and integrate through the Unified SPI.
            </p>
          </div>
          <figure className="diagram">
            <Image src={highLevel} alt="KernelEye high-level architecture" placeholder="blur" />
            <figcaption>Components plug into a shared SPI on top of the eBPF base layer.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="kicker">Node view</span>
            <h2>Inside a cluster node</h2>
            <p className="section-lead">
              Pods run in user space with no changes. The KernelEye DaemonSet talks to eBPF programs in kernel space
              through maps, and to other nodes through the peer-to-peer channel.
            </p>
            <ul className="checklist">
              <li>
                <Icon name="check" size={18} /> Pods are observed transparently, with no sidecar or SDK
              </li>
              <li>
                <Icon name="check" size={18} /> The DaemonSet enriches events with Kubernetes metadata
              </li>
              <li>
                <Icon name="check" size={18} /> Inter-node telemetry and action messages are exchanged peer to peer
              </li>
            </ul>
          </div>
          <figure className="diagram">
            <Image src={nodeView} alt="Cluster node logical view" placeholder="blur" />
          </figure>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Data path</span>
            <h2>From kernel to console</h2>
            <p className="section-lead">
              Events flow up through maps. Decisions flow back down as map writes.
            </p>
          </div>
          <CodeBlock title="data-flow.txt" lang="text" code={flow} />
          <div className="grid-3" style={{ marginTop: 32 }}>
            {hooks.map((h) => (
              <div key={h.group} className="compare-col">
                <h3>{h.group}</h3>
                <p style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--teal)" }}>
                  {h.items.join(" · ")}
                </p>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>{h.used}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Extensibility</span>
            <h2>Unified SPI interface</h2>
            <p className="section-lead">
              Three layers: plugins and the core engine in user space; the verifier, runtime and maps in the eBPF
              layer; and the kernel hook points for networking, tracing, security, storage and scheduling.
            </p>
          </div>
          <figure className="diagram">
            <Image src={spi} alt="Unified SPI interface architecture" placeholder="blur" />
            <figcaption>
              Execution engine, base plugins and plugin registry over the eBPF verifier, runtime and maps.
            </figcaption>
          </figure>
          <p style={{ marginTop: 28 }}>
            <a href={repoFile("docs/ARCHITECTURE.md")} className="btn btn-ghost" target="_blank" rel="noreferrer">
              <Icon name="book" size={18} /> Full architecture document
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
