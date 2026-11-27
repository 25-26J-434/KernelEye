import type { IconName } from "@/components/Icon";

export type MilestoneStatus = "shipped" | "in-progress" | "planned";

export interface Milestone {
  /** Shipped items use the month they landed (from git history). Planned items use a horizon. */
  when: string;
  status: MilestoneStatus;
  icon: IconName;
  title: string;
  body: string;
  tags: string[];
}

export const statusLabel: Record<MilestoneStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  planned: "Planned",
};

export const milestones: Milestone[] = [
  {
    when: "Dec 2025",
    status: "shipped",
    icon: "eye",
    title: "eBPF telemetry daemon",
    body: "Kernel-level DNS latency and TCP RTT per pod, served over REST and Prometheus by a DaemonSet on every node.",
    tags: ["Observability"],
  },
  {
    when: "Dec 2025",
    status: "shipped",
    icon: "network",
    title: "Node-to-node communication",
    body: "Peer-to-peer broadcast, unicast and multicast between nodes, with typed events and message logs.",
    tags: ["Federation"],
  },
  {
    when: "Dec 2025",
    status: "shipped",
    icon: "route",
    title: "Adaptive traffic routing",
    body: "Redirect policies with best-pod selection and TTL-based self-healing.",
    tags: ["Routing"],
  },
  {
    when: "Dec 2025",
    status: "shipped",
    icon: "scale",
    title: "Runtime-aware autoscaling & scheduler",
    body: "Scaling rules on kernel metrics, backed by MongoDB, plus a scheduler that scores nodes on live telemetry.",
    tags: ["Autoscaling"],
  },
  {
    when: "Dec 2025",
    status: "shipped",
    icon: "disk",
    title: "Container-level metrics & topology",
    body: "Disk I/O and CPU run-queue latency per container, and a live service-to-service connection map.",
    tags: ["Observability"],
  },
  {
    when: "Feb 2026",
    status: "shipped",
    icon: "bolt",
    title: "In-kernel DNAT redirection",
    body: "A cgroup/connect4 eBPF program that rewrites connections at connect(), synced cluster-wide.",
    tags: ["Routing"],
  },
  {
    when: "Mar 2026",
    status: "shipped",
    icon: "plug",
    title: "SPI extensions & notifications",
    body: "A two-method extension interface with schema-driven UI. Ships with Slack, Teams, webhook and email alerts.",
    tags: ["Extensions"],
  },
  {
    when: "Oct 2026",
    status: "shipped",
    icon: "activity",
    title: "Cluster health monitoring",
    body: "Live health stream with an alert lifecycle, node-freshness tracking and one-click pod restarts.",
    tags: ["Console"],
  },
  {
    when: "Nov 2026",
    status: "in-progress",
    icon: "layers",
    title: "Next-generation console",
    body: "A rebuilt Next.js console with a secure server-side API proxy, live WebSocket views and light and dark themes.",
    tags: ["Console"],
  },
  {
    when: "Nov 2026",
    status: "in-progress",
    icon: "globe",
    title: "Product website & documentation",
    body: "Public site, deployment guide and use-case library.",
    tags: ["Docs"],
  },
  {
    when: "Next",
    status: "planned",
    icon: "sparkles",
    title: "KernelEye AI: recommendations",
    body: "Suggested routing policies and scaling rules, built from live telemetry and history and explained in plain language. Builds on the console's existing rule-based pod recommendations.",
    tags: ["AI", "Routing", "Autoscaling"],
  },
  {
    when: "Next",
    status: "planned",
    icon: "lock",
    title: "Authentication & RBAC",
    body: "Login for the console and API tokens with role-based access, so automation can be delegated safely.",
    tags: ["Security"],
  },
  {
    when: "Next",
    status: "planned",
    icon: "package",
    title: "Helm chart & one-command install",
    body: "Versioned Helm chart with values for registry, MongoDB, scheduler and console.",
    tags: ["Install"],
  },
  {
    when: "Next",
    status: "planned",
    icon: "database",
    title: "Historical telemetry",
    body: "Retained metric history for trends, baselines and training the recommendation models.",
    tags: ["Observability", "AI"],
  },
  {
    when: "Later",
    status: "planned",
    icon: "rocket",
    title: "AI autopilot with approvals",
    body: "Let KernelEye apply its own suggestions within guardrails you set, with human approval, dry runs and full audit.",
    tags: ["AI"],
  },
  {
    when: "Later",
    status: "planned",
    icon: "cloud",
    title: "KernelEye Cloud & billing",
    body: "Hosted console and AI service with self-serve plans and usage-based billing.",
    tags: ["Cloud", "Billing"],
  },
  {
    when: "Later",
    status: "planned",
    icon: "building",
    title: "Enterprise edition",
    body: "SSO/SAML, audit logs, a multi-cluster console, air-gapped installs and support with an SLA.",
    tags: ["Enterprise"],
  },
];
