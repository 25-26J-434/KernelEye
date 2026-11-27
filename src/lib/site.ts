import type { IconName } from "@/components/Icon";
import { features } from "./features";

export const site = {
  name: "KernelEye",
  tagline: "Sidecar-less, runtime-aware orchestration for Kubernetes",
  description:
    "KernelEye measures DNS, TCP, scheduling and disk latency inside the Linux kernel with eBPF, then uses that telemetry to route traffic, scale workloads and coordinate nodes. No sidecars, no application changes.",
  repo: "https://github.com/25-26J-434/k8s-runtime-aware-ebpf-orchestration",
  projectId: "25-26J-434",
};

export const repoFile = (path: string) => `${site.repo}/blob/main/${path}`;
export const repoTree = (path: string) => `${site.repo}/tree/main/${path}`;
/** Pre-filled GitHub issue, used as the contact channel until a sales inbox exists. */
export const contactLink = (subject: string) =>
  `${site.repo}/issues/new?title=${encodeURIComponent(subject)}&labels=${encodeURIComponent("contact")}`;

export interface MenuLink {
  label: string;
  href: string;
  icon: IconName;
  description: string;
  badge?: string;
}

export interface NavEntry {
  label: string;
  href?: string;
  items?: MenuLink[];
}

export const productMenu: MenuLink[] = [
  ...features.map((f) => ({
    label: f.name,
    href: `/features/${f.slug}/`,
    icon: f.icon,
    description: f.summary,
  })),
  {
    label: "KernelEye AI",
    href: "/ai/",
    icon: "sparkles",
    description: "Suggested routing and scaling changes, explained in plain language.",
    badge: "Soon",
  },
];

export const resourcesMenu: MenuLink[] = [
  { label: "Deploy guide", href: "/get-started/", icon: "rocket", description: "Install KernelEye on your cluster." },
  { label: "Architecture", href: "/architecture/", icon: "layers", description: "How data flows from kernel to cluster." },
  { label: "Documentation", href: "/docs/", icon: "book", description: "Guides, references and runbooks." },
  { label: "Roadmap", href: "/roadmap/", icon: "map", description: "What has shipped and what's next." },
  { label: "About", href: "/about/", icon: "users", description: "The research and the team." },
];

export const primaryNav: NavEntry[] = [
  { label: "Product", items: productMenu },
  { label: "Use Cases", href: "/use-cases/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Enterprise", href: "/enterprise/" },
  { label: "Resources", items: resourcesMenu },
];

/** Everything the Ctrl+K search can jump to. */
export const searchIndex: { label: string; href: string; icon: IconName; group: string; keywords?: string }[] = [
  { label: "Home", href: "/", icon: "eye", group: "Pages" },
  ...productMenu.map((m) => ({ label: m.label, href: m.href, icon: m.icon, group: "Product", keywords: m.description })),
  { label: "Use cases", href: "/use-cases/", icon: "boxes", group: "Pages", keywords: "scenarios examples industries" },
  { label: "Pricing", href: "/pricing/", icon: "card", group: "Pages", keywords: "plans billing cost free" },
  { label: "Enterprise", href: "/enterprise/", icon: "building", group: "Pages", keywords: "sso saml audit support sla" },
  ...resourcesMenu.map((m) => ({ label: m.label, href: m.href, icon: m.icon, group: "Resources", keywords: m.description })),
];
