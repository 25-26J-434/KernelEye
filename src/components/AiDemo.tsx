"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";

type Phase = "idle" | "analyzing" | "done";

const signals = [
  { label: "checkout · DNS latency", value: "1.9 ms", trend: "+310%", level: "high" },
  { label: "worker-3 · disk I/O latency", value: "4.8 ms", trend: "+720%", level: "high" },
  { label: "payments · TCP retransmits", value: "0.8 %", trend: "+40%", level: "medium" },
  { label: "search · run-queue latency", value: "120 µs", trend: "stable", level: "ok" },
] as const;

const analysisSteps = [
  "Reading kernel telemetry from 6 nodes",
  "Comparing against 7-day baselines",
  "Correlating pods, nodes and services",
  "Drafting changes within your guardrails",
];

interface Suggestion {
  kind: "Scaling" | "Routing" | "Investigate";
  icon: IconName;
  title: string;
  confidence: number;
  why: string;
  evidence: string[];
  change?: { endpoint: string; body: string };
}

const suggestions: Suggestion[] = [
  {
    kind: "Scaling",
    icon: "scale",
    title: "Scale checkout from 4 to 6 replicas",
    confidence: 92,
    why: "DNS latency for checkout has been above its 7-day p95 for 6 minutes while CPU is only 41%. A CPU-based autoscaler would not react yet.",
    evidence: ["dns_latency 1.9 ms vs 0.46 ms baseline", "CPU 41%", "traffic +2.3×"],
    change: {
      endpoint: "POST /api/scaling/rules",
      body: `{
  "namespace": "shop",
  "deployment": "checkout",
  "metric": "dns_latency",
  "operator": ">",
  "threshold": 900,
  "action": "scale_up",
  "step": 2,
  "minReplicas": 4,
  "maxReplicas": 12,
  "useCustomScheduler": true,
  "enabled": true
}`,
    },
  },
  {
    kind: "Routing",
    icon: "route",
    title: "Shift search traffic off worker-3 for 5 minutes",
    confidence: 87,
    why: "Disk I/O latency on worker-3 is 8× its normal level. The busiest container is a batch export from another tenant. Two healthy search replicas run on worker-1 and worker-5.",
    evidence: ["worker-3 disk 4.8 ms", "export-job writes 210 MB/s", "2 healthy candidates"],
    change: {
      endpoint: "POST /api/policies",
      body: `{
  "policy_name": "search-io-guard",
  "namespace": "search",
  "scope": "cluster",
  "frontend": { "service": "search", "port": 80 },
  "telemetry": { "violation_threshold": 2000 },
  "action": {
    "type": "redirect",
    "strategy": "best_pod",
    "backend_candidates_selector": "app=search",
    "backend_port": 8080,
    "ttl_seconds": 300
  }
}`,
    },
  },
  {
    kind: "Investigate",
    icon: "search",
    title: "Check the network path for payments on worker-1",
    confidence: 64,
    why: "Retransmissions are rising, but only on one node and within tolerance. An automated change is not recommended yet. Watch it, or check the node's NIC and MTU.",
    evidence: ["tcp_retrans 0.8%", "worker-1 only", "no latency impact yet"],
  },
];

export function AiDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [openChange, setOpenChange] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setPhase("analyzing");
    setStep(0);
    setOpenChange(null);
    analysisSteps.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i + 1), 550 * (i + 1)));
    });
    timers.current.push(setTimeout(() => setPhase("done"), 550 * analysisSteps.length + 300));
  };

  return (
    <div className="ai-demo">
      <div className="ai-demo-bar">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>KernelEye AI · cluster prod-eu-1</span>
        <span className="preview-label">Preview · simulated data</span>
      </div>

      <div className="ai-demo-body">
        <aside className="ai-signals">
          <h4>Live signals</h4>
          {signals.map((s) => (
            <div key={s.label} className={`signal ${s.level}`}>
              <span className="signal-dot" />
              <span className="signal-label">{s.label}</span>
              <span className="signal-value">{s.value}</span>
              <span className="signal-trend">{s.trend}</span>
            </div>
          ))}
          <button type="button" className="btn btn-primary ai-run" onClick={run} disabled={phase === "analyzing"}>
            <Icon name="sparkles" size={16} />
            {phase === "idle" ? "Analyze cluster" : phase === "analyzing" ? "Analyzing…" : "Run again"}
          </button>
        </aside>

        <div className="ai-output" aria-live="polite">
          {phase === "idle" && (
            <div className="ai-empty">
              <span className="ai-orb">
                <Icon name="bot" size={28} />
              </span>
              <h3>Ask KernelEye what to change</h3>
              <p>Press Analyze cluster to see how the assistant turns kernel signals into explained, reviewable changes.</p>
            </div>
          )}

          {phase === "analyzing" && (
            <ul className="ai-steps">
              {analysisSteps.map((s, i) => (
                <li key={s} className={i < step ? "done" : i === step ? "active" : ""}>
                  <Icon name={i < step ? "done" : i === step ? "progress" : "planned"} size={17} />
                  {s}
                </li>
              ))}
            </ul>
          )}

          {phase === "done" && (
            <div className="ai-results">
              <div className="ai-summary">
                <Icon name="sparkles" size={16} /> 3 suggestions · 2 ready to apply · 1 to investigate
              </div>
              {suggestions.map((s, i) => (
                <article key={s.title} className="suggestion" style={{ animationDelay: `${i * 120}ms` }}>
                  <header>
                    <span className={`kind ${s.kind.toLowerCase()}`}>
                      <Icon name={s.icon} size={14} /> {s.kind}
                    </span>
                    <span className="confidence" title="Model confidence">
                      <span className="meter">
                        <span style={{ width: `${s.confidence}%` }} />
                      </span>
                      {s.confidence}%
                    </span>
                  </header>
                  <h3>{s.title}</h3>
                  <p>{s.why}</p>
                  <div className="evidence">
                    {s.evidence.map((e) => (
                      <span key={e} className="tag-mini">
                        {e}
                      </span>
                    ))}
                  </div>
                  <div className="suggestion-actions">
                    {s.change ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          aria-expanded={openChange === i}
                          onClick={() => setOpenChange(openChange === i ? null : i)}
                        >
                          {openChange === i ? "Hide change" : "Review change"}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm" disabled title="Preview only">
                          Apply with approval
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn btn-ghost btn-sm" disabled title="Preview only">
                        Create ticket
                      </button>
                    )}
                  </div>
                  {s.change && openChange === i && (
                    <pre className="suggestion-change">
                      <span className="muted">{s.change.endpoint}</span>
                      {"\n"}
                      {s.change.body}
                    </pre>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
