import type { IconName } from "@/components/Icon";

export interface Feature {
  slug: string;
  icon: IconName;
  name: string;
  /** One-line card summary for the home page. */
  summary: string;
  /** Hero headline on the feature page. */
  headline: string;
  intro: string;
  highlights: { title: string; body: string }[];
  steps: string[];
  code: { title: string; lang: string; body: string };
  endpoints: { method: string; path: string; note: string }[];
  docs: { label: string; path: string }[];
}

export const features: Feature[] = [
  {
    slug: "observability",
    icon: "eye",
    name: "Kernel Observability",
    summary:
      "eBPF programs time DNS, TCP, CPU scheduling and disk I/O inside the kernel, per node, pod and container.",
    headline: "Telemetry straight from the kernel",
    intro:
      "KernelEye attaches eBPF programs to kprobes and tracepoints on every node. They timestamp kernel events in nanoseconds and stream them to a Go daemon over ring buffers. The daemon maps IPs and PIDs to pods and containers through the Kubernetes API. Your workloads run unmodified: no SDK, no sidecar, no restart.",
    highlights: [
      {
        title: "DNS latency",
        body: "Kprobes on udp_sendmsg and udp_recvmsg time every DNS query from request to response, with nanosecond timestamps.",
      },
      {
        title: "TCP RTT, retransmits and loss",
        body: "Connection set-up time from tcp_connect to tcp_finish_connect, plus smoothed RTT, retransmission rate, packet loss and state transitions.",
      },
      {
        title: "CPU scheduling latency",
        body: "Run-queue wait time from scheduler tracepoints, broken down per pod and per container through PID-namespace tracking.",
      },
      {
        title: "Disk I/O",
        body: "Read and write operations, bytes and latency per container, so you can find noisy neighbours on shared nodes.",
      },
      {
        title: "Node system & sockets",
        body: "CPU, memory and network counters per node, TCP/UDP socket counts, packet distribution and NAT conntrack metadata.",
      },
      {
        title: "Live, in any format",
        body: "Query JSON over REST, scrape the Prometheus endpoint, or subscribe to WebSocket streams for live dashboards.",
      },
    ],
    steps: [
      "eBPF programs attach to kernel hooks after the verifier accepts them.",
      "Events are pushed into BPF ring buffers and hash maps.",
      "The DaemonSet reads them, enriches them with pod and container identity, and aggregates min/avg/max.",
      "Metrics are served over REST, Prometheus and WebSocket to the console and other components.",
    ],
    code: {
      title: "ebpf/component-1-daemon/dns_latency.c",
      lang: "c",
      body: `SEC("kprobe/udp_sendmsg")
int dns_start_probe(struct pt_regs *ctx) {
    u64 ts = bpf_ktime_get_ns();          // nanosecond clock
    bpf_map_update_elem(&start, &key, &ts, BPF_ANY);
    return 0;
}

SEC("kprobe/udp_recvmsg")
int dns_end_probe(struct pt_regs *ctx) {
    e->latency_ns = bpf_ktime_get_ns() - *tsp;
    bpf_ringbuf_submit(e, 0);             // stream to user space
    return 0;
}`,
    },
    endpoints: [
      { method: "GET", path: "/api/metrics", note: "Unified node, pod and container metrics" },
      { method: "GET", path: "/api/dns/pods", note: "Per-pod DNS latency" },
      { method: "GET", path: "/api/sched/containers", note: "Scheduling latency per container" },
      { method: "GET", path: "/api/disk/all", note: "Disk I/O for nodes, pods and containers" },
      { method: "GET", path: "/metrics", note: "Prometheus exposition format" },
      { method: "WS", path: "/ws/metrics", note: "Live metric stream" },
    ],
    docs: [
      { label: "Codebase guide", path: "docs/CODEBASE_GUIDE.md" },
      { label: "Container-level metrics", path: "docs/CONTAINER_METRICS_STATUS.md" },
      { label: "API documentation", path: "docs/API_DOCUMENTATION.md" },
    ],
  },
  {
    slug: "routing",
    icon: "route",
    name: "Adaptive Traffic Routing",
    summary:
      "When a service degrades, new connections are steered to the healthiest backend pod at the socket layer, with no proxy in the path.",
    headline: "Route around slow pods and busy nodes",
    intro:
      "A routing policy names a frontend service, a pool of candidate backends and a health threshold. When it is evaluated and the threshold is breached, KernelEye ranks the candidates by kernel-measured health, labels the winner and rewrites new connections to it inside the kernel with its own cgroup/connect4 eBPF DNAT program. The redirect carries a TTL and removes itself when it expires.",
    highlights: [
      {
        title: "Health you can trust",
        body: "Pod-scoped policies judge DNS latency per pod. Cluster-scoped policies judge node disk-I/O latency, so traffic moves off overloaded nodes.",
      },
      {
        title: "Best-pod selection",
        body: "With the best_pod strategy, candidates matching a label selector are ranked by live telemetry. The winner is labelled and receives new connections.",
      },
      {
        title: "Steering at connect()",
        body: "An eBPF program rewrites the destination when the socket connects. No proxy, no extra hop and no change to the client.",
      },
      {
        title: "Cluster-wide consistency",
        body: "DNAT entries are synced to every node and EndpointSlices are updated, so every client in the cluster agrees on the target.",
      },
      {
        title: "Self-healing TTL",
        body: "Each redirect expires after ttl_seconds. A background sweeper restores the original service, so a forgotten policy cannot pin traffic forever.",
      },
      {
        title: "Automate the trigger",
        body: "Evaluate from the console, from a CronJob, or from your alerting pipeline with POST /api/policies/:name/evaluate.",
      },
    ],
    steps: [
      "Create a policy for a frontend service and a pool of candidate backends.",
      "Trigger an evaluation from the console, a CronJob or an alert webhook.",
      "If the threshold is breached, the healthiest candidate is chosen and an eBPF DNAT redirect is published to every node.",
      "When the TTL expires the redirect is removed and the service returns to normal load balancing.",
    ],
    code: {
      title: "POST /api/policies",
      lang: "json",
      body: `{
  "policy_name": "checkout-io-guard",
  "namespace": "shop",
  "scope": "cluster",
  "frontend": { "service": "checkout", "port": 80 },
  "telemetry": { "violation_threshold": 2000 },
  "action": {
    "type": "redirect",
    "strategy": "best_pod",
    "backend_candidates_selector": "app=checkout",
    "backend_port": 8080,
    "ttl_seconds": 300
  }
}`,
    },
    endpoints: [
      { method: "POST", path: "/api/policies", note: "Create a policy" },
      { method: "POST", path: "/api/policies/:name/evaluate", note: "Evaluate now and apply a redirect if needed" },
      { method: "POST", path: "/api/policies/:name/expire", note: "Remove an active redirect early" },
      { method: "GET", path: "/api/dnat/entries", note: "Active eBPF DNAT redirects on this node" },
      { method: "GET", path: "/api/connections/topology", note: "Service-to-service connection graph" },
    ],
    docs: [
      { label: "Routing guide", path: "docs/COMPONENT2-README.md" },
      { label: "Topology feature", path: "docs/TOPOLOGY_FEATURE.md" },
      { label: "eBPF actions", path: "docs/EBPF_ACTIONS_GUIDE.md" },
    ],
  },
  {
    slug: "autoscaling",
    icon: "scale",
    name: "Runtime-Aware Autoscaling",
    summary:
      "Scale deployments on DNS, RTT, retransmits and disk latency, and place new pods on the nodes that are performing best right now.",
    headline: "Scale on what users actually feel",
    intro:
      "CPU and memory tell you how busy a pod is. They don't tell you how slow it feels to users. KernelEye scales deployments on kernel-measured latency signals. Its scheduler scores nodes on live network and disk telemetry, so new replicas go to nodes that are performing well right now.",
    highlights: [
      {
        title: "Latency-native signals",
        body: "Scale on DNS latency, TCP RTT, TCP retransmissions, or disk read and write latency, all measured in the kernel.",
      },
      {
        title: "Declarative rules",
        body: "Operator, threshold, step size and min/max replicas per deployment, each with its own enable/disable switch.",
      },
      {
        title: "5-second control loop",
        body: "The controller evaluates every enabled rule against the latest metrics every five seconds.",
      },
      {
        title: "Telemetry-scored placement",
        body: "The KernelEye scheduler normalises DNS, RTT, TCP and disk metrics per node, then penalises crowded nodes and in-flight placements.",
      },
      {
        title: "Persistent & reactive",
        body: "Rules are stored in MongoDB. Change streams push edits to the controller immediately.",
      },
      {
        title: "Full audit trail",
        body: "The console shows current replicas, the triggering metric value and the last scaling action for each deployment.",
      },
    ],
    steps: [
      "Create a rule in the console or through the REST API.",
      "The rule is saved to MongoDB and picked up by the scaling controller.",
      "Every 5 s the controller compares live metrics with each rule.",
      "When a rule matches, the deployment scales within its min/max limits and new pods are placed by telemetry score.",
    ],
    code: {
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
  "minReplicas": 2,
  "maxReplicas": 12,
  "useCustomScheduler": true,
  "enabled": true
}`,
    },
    endpoints: [
      { method: "GET", path: "/api/scaling/rules", note: "List scaling rules" },
      { method: "POST", path: "/api/scaling/rules", note: "Create a rule" },
      { method: "GET", path: "/api/scaling/deployments", note: "Deployments with replicas and last action" },
      { method: "GET", path: "/api/scaling/metrics/latest", note: "Latest metric values the controller sees" },
    ],
    docs: [
      { label: "Component 3: scaling", path: "docs/COMPONENT3-SCALING.md" },
      { label: "MongoDB queries", path: "docs/MONGODB_QUERIES_VIEW_DATA.md" },
    ],
  },
  {
    slug: "federation",
    icon: "network",
    name: "Node-to-Node Federation",
    summary:
      "Peer-to-peer broadcast, unicast and multicast between nodes for shared state and distributed decisions without a central controller.",
    headline: "Nodes that talk to each other",
    intro:
      "Each KernelEye node runs a peer daemon that exchanges telemetry and coordination messages directly with the other nodes. Share metric aggregates, coordinate eBPF program updates or agree on routing decisions without sending everything through a central controller.",
    highlights: [
      {
        title: "Three primitives",
        body: "BROADCAST to all nodes, UNICAST to one, MULTICAST to a chosen group.",
      },
      {
        title: "Typed events",
        body: "HANDSHAKE, DISCOVERY, STATE_UPDATE, METRIC_UPDATE and SCHEDULING messages carry structured payloads.",
      },
      {
        title: "Discovery & health",
        body: "Peers are discovered from a ConfigMap or the discovery protocol, and their health is tracked continuously.",
      },
      {
        title: "Observable",
        body: "Message logs and per-peer statistics are available over the API and in the console's Federation view.",
      },
    ],
    steps: [
      "A DaemonSet pod starts on each node with its node IP.",
      "Peers are discovered and a handshake is exchanged.",
      "Components publish events using broadcast, unicast or multicast.",
      "Receivers act on each message and log it for audit and debugging.",
    ],
    code: {
      title: "POST /api/comm/broadcast",
      lang: "json",
      body: `{
  "event": "METRIC_UPDATE",
  "payload": {
    "node": "worker-2",
    "dns_avg_latency_us": 312.4,
    "rtt_avg_rtt_us": 1840.0
  }
}`,
    },
    endpoints: [
      { method: "POST", path: "/api/comm/broadcast", note: "Send to every peer" },
      { method: "POST", path: "/api/comm/unicast", note: "Send to one node (targets)" },
      { method: "POST", path: "/api/comm/multicast", note: "Send to a node group" },
      { method: "GET", path: "/api/comm/stats", note: "Peer statistics" },
      { method: "GET", path: "/api/comm/logs", note: "Sent and received message log" },
    ],
    docs: [
      { label: "Component 4 quick guide", path: "docs/COMPONENT4_QUICK_GUIDE.md" },
      { label: "Architecture", path: "docs/ARCHITECTURE.md" },
    ],
  },
  {
    slug: "extensions",
    icon: "plug",
    name: "SPI Extensions",
    summary:
      "Add collectors, alerting and integrations through a small Go interface. Each extension describes its own console UI.",
    headline: "Extend it without forking it",
    intro:
      "Every capability in KernelEye is a plugin behind a common Service Provider Interface. Implement two methods, register the extension, and optionally ship a ui.json. The console then renders a configuration form for it with no frontend changes. The built-in Notification extension uses this to send threshold alerts to Slack, Microsoft Teams, webhooks and email.",
    highlights: [
      {
        title: "Two-method contract",
        body: "Name() and Run(ctx, params) are all an extension needs. The registry handles discovery and lifecycle.",
      },
      {
        title: "Schema-driven UI",
        body: "Declare inputs in ui.json: booleans, numbers, selects and secrets. The console generates the form for you.",
      },
      {
        title: "Generic API surface",
        body: "/api/extensions/:name/config, /trigger, /test and /ui are dispatched by name, so there is no hard-coded routing.",
      },
      {
        title: "Batteries included",
        body: "Notification ships ready to use: Slack, Teams, generic webhooks and SMTP email, with per-metric thresholds and severity levels.",
      },
    ],
    steps: [
      "Implement spi.Extension in daemon/pkg/extensions/<name>/.",
      "Optionally add a ui.json that describes the configuration form.",
      "Append the extension to registry.All().",
      "It appears under Extensions in the console with its own settings page.",
    ],
    code: {
      title: "daemon/pkg/spi/spi.go",
      lang: "go",
      body: `type Extension interface {
    // Unique extension name, e.g. "notification".
    Name() string
    // Run blocks until ctx is cancelled. params carries
    // the config the user set in the console.
    Run(ctx context.Context, params ExtensionParams) error
}`,
    },
    endpoints: [
      { method: "GET", path: "/api/extensions", note: "Registered extensions and their UI schema" },
      { method: "POST", path: "/api/extensions/:name/config", note: "Save extension config" },
      { method: "POST", path: "/api/extensions/:name/test", note: "Send a test event" },
      { method: "GET", path: "/api/extensions/:name/ui", note: "Raw ui.json schema" },
    ],
    docs: [
      { label: "Extensions: SPI and UI", path: "docs/EXTENSIONS_SPI_AND_UI.md" },
      { label: "Extension package README", path: "daemon/pkg/extensions/README.md" },
    ],
  },
];

export const getFeature = (slug: string) => features.find((f) => f.slug === slug);
