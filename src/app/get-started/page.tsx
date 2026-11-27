import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Icon, type IconName } from "@/components/Icon";
import { repoFile, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Deploy",
  description: "Deploy KernelEye to a production Kubernetes cluster: images, DaemonSet, MongoDB, console and hardening.",
};

const requirements: { icon: IconName; name: string; note: string }[] = [
  {
    icon: "cloud",
    name: "A Kubernetes cluster",
    note: "Managed (EKS, GKE, AKS) or self-managed. KernelEye runs as a DaemonSet next to your existing CNI.",
  },
  {
    icon: "cpu",
    name: "Linux 5.8+ nodes with BTF",
    note: "/sys/kernel/btf/vmlinux must exist. Ubuntu 22.04+ and Amazon Linux 2023 node images ship it.",
  },
  {
    icon: "shield",
    name: "Privileged pods allowed",
    note: "The agent needs BPF, SYS_ADMIN and NET_ADMIN plus hostPID and hostNetwork in its own namespace.",
  },
  {
    icon: "database",
    name: "MongoDB replica set",
    note: "Stores routing policies and scaling rules. Use a managed service or the bundled StatefulSet.",
  },
  {
    icon: "package",
    name: "A container registry",
    note: "Any registry your nodes can pull from: ECR, GCR/Artifact Registry, ACR, GHCR or Harbor.",
  },
];

const steps = [
  {
    title: "Build and push the images",
    body: "Compile the eBPF programs once, then build a single image that contains both the agent and the telemetry-aware scheduler. Pin a version tag; never deploy :latest to production.",
    lang: "bash",
    code: `git clone ${site.repo}.git && cd k8s-runtime-aware-ebpf-orchestration
export REG=registry.example.com/kerneleye VERSION=0.1.0

./scripts/build-ebpf.sh                     # clang + libbpf on the build machine
docker build -t $REG/daemon:$VERSION -f daemon/Dockerfile daemon
docker push $REG/daemon:$VERSION`,
  },
  {
    title: "Prepare the namespace",
    body: "KernelEye gets its own namespace. It is the only namespace that needs the privileged Pod Security level.",
    lang: "bash",
    code: `kubectl apply -f k8s/namespace.yaml
kubectl label ns ebpf-telemetry \\
  pod-security.kubernetes.io/enforce=privileged --overwrite`,
  },
  {
    title: "Connect MongoDB",
    body: "Store the connection string in a Secret. A managed replica set (for example MongoDB Atlas) is simplest. Otherwise apply the bundled 3-member StatefulSet in k8s/mongo-*.yaml. Change streams require a replica set, not a standalone server.",
    lang: "bash",
    code: `kubectl -n ebpf-telemetry create secret generic kerneleye-mongo \\
  --from-literal=MONGO_URI='mongodb+srv://user:pass@cluster0.example.net/kerneleye' \\
  --from-literal=ROUTING_MONGO_URI='mongodb+srv://user:pass@cluster0.example.net/kerneleye'`,
  },
  {
    title: "Roll out the agent",
    body: "Apply the DaemonSet, RBAC and ClusterIP Service, point it at your image, and load the Mongo settings from the Secret. One pod starts on every node, including control-plane nodes.",
    lang: "bash",
    code: `kubectl apply -f k8s/daemonset.yaml
kubectl -n ebpf-telemetry set image ds/ebpf-daemon daemon=$REG/daemon:$VERSION
kubectl -n ebpf-telemetry set env ds/ebpf-daemon --from=secret/kerneleye-mongo
kubectl -n ebpf-telemetry rollout status ds/ebpf-daemon`,
  },
  {
    title: "Add the telemetry-aware scheduler (optional)",
    body: "Scaling rules with useCustomScheduler: true place new replicas through this scheduler. It scores nodes on live DNS, RTT, TCP and disk telemetry and penalises crowded nodes.",
    lang: "bash",
    code: `kubectl apply -f k8s/kerneleye-scheduler.yaml
kubectl -n ebpf-telemetry set image deploy/kerneleye-scheduler scheduler=$REG/daemon:$VERSION`,
  },
  {
    title: "Deploy the console",
    body: "The Next.js console proxies every API call server-side, so the daemon is never exposed to browsers. BACKEND_API_URL is read at build time for WebSocket routes, so set it when you build.",
    lang: "dockerfile",
    code: `# Dockerfile.console (build from the repository root)
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend-next/ .
ENV BACKEND_API_URL=http://ebpf-daemon.ebpf-telemetry.svc:8080
RUN npm ci && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV=production BACKEND_API_URL=http://ebpf-daemon.ebpf-telemetry.svc:8080
EXPOSE 3100
CMD ["npm", "start"]`,
  },
  {
    title: "Verify",
    body: "Check the agent from inside the cluster, then open the console through your Ingress.",
    lang: "bash",
    code: `kubectl -n ebpf-telemetry get pods -o wide        # one ebpf-daemon per node
kubectl -n ebpf-telemetry logs ds/ebpf-daemon --tail=20

kubectl run kcheck --rm -it --restart=Never --image=curlimages/curl -- \\
  curl -s http://ebpf-daemon.ebpf-telemetry.svc:8080/health   # OK`,
  },
];

const hardening: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "lock",
    title: "Keep the API private",
    body: "The daemon API has no built-in authentication and can scale deployments and redirect traffic. Keep the Service as ClusterIP, add a NetworkPolicy that only admits the console and Prometheus, and put the console behind SSO (for example oauth2-proxy) or a VPN.",
  },
  {
    icon: "gauge",
    title: "Size the agent",
    body: "The default requests are 100m CPU and 128Mi memory, with limits of 500m and 512Mi. Watch real usage for a week on your busiest nodes before tightening them.",
  },
  {
    icon: "rocket",
    title: "Roll out gradually",
    body: "The DaemonSet uses RollingUpdate with maxUnavailable: 1. Try a new version on one node pool first, using a nodeSelector, before rolling it out cluster-wide.",
  },
  {
    icon: "activity",
    title: "Wire up monitoring",
    body: "Agent pods carry prometheus.io/scrape annotations for /metrics. Scrape them, then graph DNS, RTT and disk latency next to your existing SLOs.",
  },
  {
    icon: "database",
    title: "Back up rules",
    body: "Policies and scaling rules live in MongoDB. Include the kerneleye database in your backup schedule and treat rule changes like configuration changes.",
  },
  {
    icon: "settings",
    title: "Automate carefully",
    body: "Start in observe-only mode. Turn on alerts first, then scaling rules with tight maxReplicas, then routing policies with short TTLs.",
  },
];

const rollout = [
  { week: "Week 1", title: "Observe", body: "Deploy the agent and learn your baseline DNS, RTT, disk and run-queue latency per service." },
  { week: "Week 2", title: "Alert", body: "Enable the Notification extension and send threshold breaches to Slack or Teams." },
  { week: "Week 3", title: "Scale", body: "Add scaling rules for one or two latency-sensitive deployments, with conservative limits." },
  { week: "Week 4", title: "Route", body: "Create routing policies with short TTLs and trigger them from your alerting pipeline." },
];

export default function Deploy() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Deploy
          </div>
          <span className="kicker">Production deployment</span>
          <h1>Deploy KernelEye to your cluster</h1>
          <p>
            Install the agent on an existing Kubernetes cluster, connect storage, put the console behind your
            Ingress, and adopt automation in stages. Expect about 30 minutes for a first install.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Before you begin</span>
            <h2>Requirements</h2>
          </div>
          <div className="grid-3">
            {requirements.map((r) => (
              <div key={r.name} className="card">
                <span className="card-icon">
                  <Icon name={r.icon} />
                </span>
                <h3>{r.name}</h3>
                <p>{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="kicker">Install</span>
          <h2 style={{ marginBottom: 40 }}>Seven steps to production</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <CodeBlock title={s.title} lang={s.lang} code={s.code} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Production checklist</span>
            <h2>Run it safely</h2>
            <p className="section-lead">
              KernelEye runs privileged on every node and can act on your workloads. Treat it like any other
              piece of cluster infrastructure.
            </p>
          </div>
          <div className="grid-3">
            {hardening.map((h) => (
              <div key={h.title} className="card">
                <span className="card-icon">
                  <Icon name={h.icon} />
                </span>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Adoption plan</span>
            <h2>From visibility to automation in four weeks</h2>
          </div>
          <div className="pipeline">
            {rollout.map((r) => (
              <div key={r.week} className="pipe-step">
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="tag">{r.week}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Next steps</span>
            <h2>Where to go from here</h2>
          </div>
          <div className="grid-3">
            <Link href="/use-cases/" className="card">
              <span className="card-icon">
                <Icon name="boxes" />
              </span>
              <h3>Real-world use cases</h3>
              <p>Flash-sale scaling, noisy-neighbour isolation, kernel-level alerting and more.</p>
              <span className="card-link">
                Use cases <Icon name="arrow" size={16} />
              </span>
            </Link>
            <a href={repoFile("docs/API_DOCUMENTATION.md")} className="card" target="_blank" rel="noreferrer">
              <span className="card-icon">
                <Icon name="code" />
              </span>
              <h3>API reference</h3>
              <p>Every REST and WebSocket endpoint, for automating KernelEye from CI or your alerting pipeline.</p>
              <span className="card-link">
                Read the reference <Icon name="arrow" size={16} />
              </span>
            </a>
            <a href={repoFile("README.md#troubleshooting")} className="card" target="_blank" rel="noreferrer">
              <span className="card-icon">
                <Icon name="book" />
              </span>
              <h3>Troubleshooting</h3>
              <p>The agent won&apos;t start, metrics are missing, or the kernel has no BTF? Start here.</p>
              <span className="card-link">
                Read the guide <Icon name="arrow" size={16} />
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
