"use client";

import { useMemo, useState } from "react";
import { milestones, statusLabel, type MilestoneStatus } from "@/lib/roadmap";
import { Icon } from "./Icon";

type Filter = "all" | MilestoneStatus;

const filters: Filter[] = ["all", "shipped", "in-progress", "planned"];
const statusIcon = { shipped: "done", "in-progress": "progress", planned: "planned" } as const;

export function RoadmapTimeline() {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c = { all: milestones.length, shipped: 0, "in-progress": 0, planned: 0 };
    milestones.forEach((m) => c[m.status]++);
    return c;
  }, []);

  const visible = filter === "all" ? milestones : milestones.filter((m) => m.status === filter);
  const pct = (n: number) => `${(n / milestones.length) * 100}%`;

  return (
    <div className="roadmap">
      <div className="roadmap-progress" aria-label="Roadmap progress">
        <div className="progress-bar">
          <span className="seg shipped" style={{ width: pct(counts.shipped) }} />
          <span className="seg in-progress" style={{ width: pct(counts["in-progress"]) }} />
        </div>
        <div className="progress-legend">
          <span>
            <i className="dot shipped" /> {counts.shipped} shipped
          </span>
          <span>
            <i className="dot in-progress" /> {counts["in-progress"]} in progress
          </span>
          <span>
            <i className="dot planned" /> {counts.planned} planned
          </span>
        </div>
      </div>

      <div className="segmented" role="tablist" aria-label="Filter milestones">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : statusLabel[f]}
            <span className="count">{counts[f]}</span>
          </button>
        ))}
      </div>

      <ol className="timeline">
        {visible.map((m) => (
          <li key={m.title} className={`timeline-item ${m.status}`}>
            <div className="timeline-when">{m.when}</div>
            <div className="timeline-node">
              <Icon name={statusIcon[m.status]} size={16} />
            </div>
            <div className="timeline-card">
              <div className="timeline-head">
                <span className="card-icon">
                  <Icon name={m.icon} size={18} />
                </span>
                <div>
                  <h3>{m.title}</h3>
                  <span className={`status-pill ${m.status}`}>{statusLabel[m.status]}</span>
                </div>
              </div>
              <p>{m.body}</p>
              <div className="timeline-tags">
                {m.tags.map((t) => (
                  <span key={t} className="tag-mini">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
