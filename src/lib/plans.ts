import { contactLink } from "./site";

/**
 * Plans shown on /pricing. Paid tiers are not live yet: they carry an availability
 * label instead of a price. Set `price` once pricing is decided.
 */
export interface Plan {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  availability: "Available now" | "Early access" | "Planned";
  description: string;
  cta: { label: string; href: string; external?: boolean };
  highlight?: boolean;
  includesFrom?: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "community",
    name: "Community",
    price: "Free",
    priceNote: "Open source · MIT licence",
    availability: "Available now",
    description: "Everything on this site today, self-hosted in your own cluster.",
    cta: { label: "Deploy now", href: "/get-started/" },
    features: [
      "eBPF observability for every node, pod and container",
      "Adaptive routing with eBPF DNAT",
      "Runtime-aware autoscaling and scheduler",
      "Node-to-node federation",
      "SPI extensions and Slack/Teams/email alerts",
      "Web console",
      "Community support on GitHub",
    ],
  },
  {
    id: "cloud",
    name: "Cloud",
    price: "Coming soon",
    priceNote: "Usage-based billing",
    availability: "Early access",
    description: "A hosted console and KernelEye AI. You run only the agent.",
    cta: { label: "Join the waitlist", href: contactLink("Cloud early access"), external: true },
    highlight: true,
    includesFrom: "Community",
    features: [
      "Hosted, always-up-to-date console",
      "KernelEye AI routing and scaling suggestions",
      "Historical telemetry and trend baselines",
      "Team accounts with roles",
      "Self-serve billing and invoices",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceNote: "Annual agreement",
    availability: "Planned",
    description: "For regulated, multi-cluster and air-gapped environments.",
    cta: { label: "Talk to us", href: "/enterprise/" },
    includesFrom: "Cloud",
    features: [
      "SSO/SAML and fine-grained RBAC",
      "Audit log for every automated action",
      "Multi-cluster console",
      "Self-hosted AI and air-gapped installs",
      "AI autopilot with approval workflows",
      "Support with an SLA and a named engineer",
    ],
  },
];

export type Cell = boolean | string;

export const comparison: { group: string; rows: { label: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    group: "Platform",
    rows: [
      { label: "Kernel telemetry (DNS, TCP, sched, disk)", values: [true, true, true] },
      { label: "Adaptive routing", values: [true, true, true] },
      { label: "Runtime-aware autoscaling", values: [true, true, true] },
      { label: "Node-to-node federation", values: [true, true, true] },
      { label: "Extensions & alerts", values: [true, true, true] },
      { label: "Nodes", values: ["Unlimited", "Usage-based", "Unlimited"] },
    ],
  },
  {
    group: "Intelligence",
    rows: [
      { label: "Rule-based pod recommendations", values: [true, true, true] },
      { label: "AI routing & scaling suggestions", values: [false, true, true] },
      { label: "Historical baselines", values: [false, true, true] },
      { label: "AI autopilot with approvals", values: [false, false, true] },
    ],
  },
  {
    group: "Security & operations",
    rows: [
      { label: "Data stays in your cluster", values: [true, "Metrics only", true] },
      { label: "Team accounts & roles", values: [false, true, true] },
      { label: "SSO / SAML", values: [false, false, true] },
      { label: "Audit log", values: [false, false, true] },
      { label: "Air-gapped install", values: [false, false, true] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support channel", values: ["GitHub", "Email", "Dedicated"] },
      { label: "Response-time SLA", values: [false, false, true] },
    ],
  },
];

export const pricingFaq: { q: string; a: string }[] = [
  {
    q: "Is KernelEye really free?",
    a: "Yes. The Community edition is open source under the MIT licence and includes every capability available today. You can run it on as many nodes as you like.",
  },
  {
    q: "When will Cloud and Enterprise be available?",
    a: "Both are on the public roadmap. Cloud will open to early-access users first. Join the waitlist and we will contact you when a spot opens.",
  },
  {
    q: "How will billing work?",
    a: "The hosted Cloud plan is planned to use usage-based billing with monthly invoices. Exact pricing will be published before launch, and the Community edition will stay free.",
  },
  {
    q: "Does my telemetry leave the cluster?",
    a: "Not with Community or Enterprise: everything runs inside your cluster. Cloud sends aggregated metrics to the hosted console and AI service. Payloads and secrets never leave the cluster.",
  },
  {
    q: "Can I move from Community to a paid plan later?",
    a: "Yes. Paid plans use the same in-cluster agent, so upgrading means connecting it rather than reinstalling.",
  },
];
