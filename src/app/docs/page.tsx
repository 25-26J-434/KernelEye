import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { repoFile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Guides, references and runbooks for KernelEye.",
};

const groups: { title: string; icon: IconName; docs: { label: string; path: string; note: string }[] }[] = [
  {
    title: "Getting started",
    icon: "terminal",
    docs: [
      { label: "Build and run", path: "docs/BUILD_AND_RUN.md", note: "Compile eBPF, build the daemon, deploy" },
      { label: "Local development (WSL2)", path: "docs/WSL-RUN-GUIDE.md", note: "Run a dev cluster on a laptop" },
      { label: "Stable cluster notes", path: "README_FOR_STABLE_CLUSTER.md", note: "Keeping a long-running cluster healthy" },
    ],
  },
  {
    title: "Concepts",
    icon: "layers",
    docs: [
      { label: "Architecture", path: "docs/ARCHITECTURE.md", note: "System design and data flow" },
      { label: "Codebase guide", path: "docs/CODEBASE_GUIDE.md", note: "Where everything lives" },
      { label: "Component 1 analysis", path: "docs/COMPONENT_1_ANALYSIS.md", note: "The eBPF daemon layer in depth" },
      { label: "Topology", path: "docs/TOPOLOGY_FEATURE.md", note: "Connection graph and visualisation" },
    ],
  },
  {
    title: "Features",
    icon: "bolt",
    docs: [
      { label: "Traffic routing", path: "docs/COMPONENT2-README.md", note: "Policies, best-pod selection, eBPF DNAT" },
      { label: "Autoscaling", path: "docs/COMPONENT3-SCALING.md", note: "Telemetry-driven scaling rules" },
      { label: "Node-to-node communication", path: "docs/COMPONENT4_QUICK_GUIDE.md", note: "Broadcast, unicast, multicast" },
      { label: "eBPF actions", path: "docs/EBPF_ACTIONS_GUIDE.md", note: "Acting on pods from the kernel" },
      { label: "Extensions: SPI and UI", path: "docs/EXTENSIONS_SPI_AND_UI.md", note: "Write your own extension" },
      { label: "Container-level metrics", path: "docs/CONTAINER_METRICS_STATUS.md", note: "Per-container attribution" },
    ],
  },
  {
    title: "Reference & operations",
    icon: "code",
    docs: [
      { label: "API documentation", path: "docs/API_DOCUMENTATION.md", note: "Every REST and WebSocket endpoint" },
      { label: "Postman collection", path: "docs/Backend API.postman_collection.json", note: "Import and try the API" },
      { label: "Viewing daemon logs", path: "docs/HOW_TO_VIEW_DAEMON_LOGS.md", note: "Debugging the DaemonSet" },
      { label: "kubectl cheatsheet", path: "docs/KUBECTL_CHEATSHEET.md", note: "Commands you'll use daily" },
      { label: "MongoDB queries", path: "docs/MONGODB_QUERIES_VIEW_DATA.md", note: "Inspect stored rules and policies" },
    ],
  },
];

export default function Docs() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Docs
          </div>
          <h1>Documentation</h1>
          <p>
            Guides, references and runbooks for installing, operating and extending KernelEye. Everything is
            versioned alongside the code on GitHub.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {groups.map((g) => (
            <div key={g.title} className="doc-group">
              <h2>{g.title}</h2>
              <div className="grid-2">
                {g.docs.map((d) => (
                  <a key={d.path} href={repoFile(d.path)} className="doc-link" target="_blank" rel="noreferrer">
                    <span className="card-icon">
                      <Icon name={g.icon} size={18} />
                    </span>
                    <span>
                      <strong>{d.label}</strong>
                      <small>{d.note}</small>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
