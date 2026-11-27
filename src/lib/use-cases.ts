import type { IconName } from "@/components/Icon";

export interface UseCase {
  id: string;
  icon: IconName;
  industry: string;
  title: string;
  problem: string;
  solution: string;
  outcomes: string[];
  features: string[]; // feature slugs
  example: { title: string; lang: string; body: string };
}

export const useCases: UseCase[] = [
  {
    id: "flash-sales",
    icon: "cart",
    industry: "E-commerce & retail",
    title: "Keep checkout fast during a flash sale",
    problem:
      "Traffic spikes at 9 a.m. on launch day. Checkout feels slow well before CPU climbs: DNS lookups to the payment provider queue up and TCP retransmissions rise. A CPU-based HPA reacts minutes late.",
    solution:
      "Scale the checkout deployment on the signal customers actually feel. A rule on DNS latency adds replicas as soon as lookups slow down, and the KernelEye scheduler places them on the nodes with the best live network and disk telemetry instead of the emptiest ones.",
    outcomes: [
      "Scaling starts on latency, not after CPU saturation",
      "New replicas avoid nodes that are already struggling",
      "Every scale event records the metric value that triggered it",
    ],
    features: ["autoscaling", "observability"],
    example: {
      title: "POST /api/scaling/rules",
      lang: "json",
      body: `{
  "namespace": "shop",
  "deployment": "checkout",
  "metric": "dns_latency",
  "operator": ">",
  "threshold": 500,
  "action": "scale_up",
  "step": 2,
  "minReplicas": 3,
  "maxReplicas": 20,
  "useCustomScheduler": true,
  "enabled": true
}`,
    },
  },
  {
    id: "sidecar-cost",
    icon: "bank",
    industry: "Fintech & regulated platforms",
    title: "Get mesh-grade visibility without the sidecar bill",
    problem:
      "A platform with hundreds of services reserves CPU and memory for a proxy in every replica. Each proxy CVE means restarting every workload during a change freeze.",
    solution:
      "Run one KernelEye agent per node instead of one proxy per pod. Per-pod DNS, TCP RTT, retransmissions and connection topology come straight from the kernel. You upgrade the agent with a DaemonSet rollout, and application pods never restart.",
    outcomes: [
      "No per-replica resource reservation for proxies",
      "Agent upgrades never restart application pods",
      "Service-to-service connection map with no code changes",
    ],
    features: ["observability"],
    example: {
      title: "Upgrade the agent, not your workloads",
      lang: "bash",
      body: `kubectl -n ebpf-telemetry set image ds/ebpf-daemon \\
  daemon=registry.example.com/kerneleye/daemon:0.2.0
kubectl -n ebpf-telemetry rollout status ds/ebpf-daemon

# application pods are untouched
kubectl get pods -n payments -o wide`,
    },
  },
  {
    id: "noisy-neighbour",
    icon: "disk",
    industry: "Multi-tenant SaaS",
    title: "Find the noisy neighbour, then route around it",
    problem:
      "One tenant's nightly export saturates disk on a shared node. Latency climbs for every other tenant on that node, but node-level dashboards only show “disk busy”.",
    solution:
      "KernelEye attributes disk I/O and CPU run-queue latency to individual containers, so the culprit has a name. A cluster-scoped routing policy then moves new connections to a healthy replica on another node until the pressure passes.",
    outcomes: [
      "Disk and scheduler latency broken down per container",
      "Traffic shifted off the hot node automatically, with a TTL",
      "Evidence to right-size or isolate the heavy tenant",
    ],
    features: ["observability", "routing"],
    example: {
      title: "Who is hurting this node?",
      lang: "bash",
      body: `# per-container disk latency and ops
curl -s http://ebpf-daemon.ebpf-telemetry:8080/api/disk/containers

# per-container CPU run-queue latency
curl -s http://ebpf-daemon.ebpf-telemetry:8080/api/sched/containers

# shift traffic for 5 minutes
curl -X POST http://ebpf-daemon.ebpf-telemetry:8080/api/policies/api-io-guard/evaluate`,
    },
  },
  {
    id: "on-call",
    icon: "bell",
    industry: "SRE & platform teams",
    title: "Page on kernel signals, not just CPU and 5xx",
    problem:
      "Incidents often start as rising DNS latency or TCP retransmissions on one node. By the time error rates move, customers have already noticed.",
    solution:
      "The built-in Notification extension checks kernel metrics on every node at a fixed interval and alerts Slack, Microsoft Teams, any webhook or email when a threshold is crossed. The same signals are exported in Prometheus format for your existing dashboards and Alertmanager.",
    outcomes: [
      "Alerts on DNS, TCP and disk latency per node",
      "Slack, Teams, webhook and SMTP delivery out of the box",
      "Prometheus endpoint for Grafana and Alertmanager",
    ],
    features: ["extensions", "observability"],
    example: {
      title: "Scrape with Prometheus",
      lang: "yaml",
      body: `# The DaemonSet pods are already annotated:
#   prometheus.io/scrape: "true"
#   prometheus.io/port:   "8080"
#   prometheus.io/path:   "/metrics"
scrape_configs:
  - job_name: kerneleye
    kubernetes_sd_configs: [{ role: pod }]
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: "true"`,
    },
  },
  {
    id: "edge",
    icon: "satellite",
    industry: "Edge, telco & IoT",
    title: "Coordinate edge nodes without a central controller",
    problem:
      "Edge sites run small clusters over unreliable links. Sending every decision through a central control plane adds latency and fails when the uplink drops.",
    solution:
      "Each KernelEye node talks directly to its peers. Nodes broadcast metric summaries, unicast scheduling hints or multicast state changes to a group. Local decisions use local data, and every message is logged for audit.",
    outcomes: [
      "Peer-to-peer broadcast, unicast and multicast",
      "Typed events: METRIC_UPDATE, STATE_UPDATE, SCHEDULING…",
      "Full message log per node for debugging",
    ],
    features: ["federation"],
    example: {
      title: "POST /api/comm/multicast",
      lang: "json",
      body: `{
  "event": "STATE_UPDATE",
  "targets": ["edge-node-2", "edge-node-3"],
  "payload": { "site": "store-114", "uplink": "degraded" }
}`,
    },
  },
  {
    id: "realtime",
    icon: "activity",
    industry: "Gaming, media & real-time APIs",
    title: "Protect latency budgets for real-time services",
    problem:
      "Match-making and streaming APIs have tight latency budgets. A single slow pod behind a Service can blow the p99, and round-robin load balancing keeps sending it traffic.",
    solution:
      "KernelEye measures DNS latency and TCP connect time per pod in the kernel. A best_pod routing policy sends new connections to the healthiest replica, and the topology view shows which caller talks to which backend and how fast.",
    outcomes: [
      "Per-pod latency, not service-wide averages",
      "Slow replicas taken out of the path at connect()",
      "Live service-to-service topology",
    ],
    features: ["routing", "observability"],
    example: {
      title: "Per-pod connection latency",
      lang: "bash",
      body: `curl -s http://ebpf-daemon.ebpf-telemetry:8080/api/rtt/pods
curl -s http://ebpf-daemon.ebpf-telemetry:8080/api/dns/pods
curl -s http://ebpf-daemon.ebpf-telemetry:8080/api/connections/topology`,
    },
  },
];
