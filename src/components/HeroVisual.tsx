/**
 * Animated node diagram: kernel hooks stream events up through eBPF maps into the
 * KernelEye DaemonSet, which fans out to routing, scaling and federation.
 * All colours come from CSS theme tokens (see .hv-* in globals.css).
 */
export function HeroVisual() {
  const pods = [
    { x: 30, label: "frontend" },
    { x: 145, label: "checkout" },
    { x: 260, label: "payments" },
  ];
  const hooks = [
    { x: 22, label: "kprobe" },
    { x: 116, label: "tracepoint" },
    { x: 210, label: "cgroup" },
    { x: 304, label: "fentry" },
  ];
  const outputs = [
    { y: 112, label: "Route", tone: "a" },
    { y: 172, label: "Scale", tone: "b" },
    { y: 232, label: "Federate", tone: "c" },
  ];
  const up = hooks.map((h) => `M${h.x + 40} 318 L${h.x + 40} 262 L${h.x + 40} 206`);

  return (
    <svg className="hero-visual" viewBox="0 0 520 430" role="img" aria-label="KernelEye data path diagram">
      <defs>
        <linearGradient id="hv-daemon" x1="0" x2="1">
          {/* Fixed deep tones so the white label stays legible in both themes. */}
          <stop offset="0" stopColor="#2f5bea" />
          <stop offset="1" stopColor="#0e8a7c" />
        </linearGradient>
      </defs>

      <rect x="6" y="6" width="390" height="418" rx="16" className="hv-frame" />
      <text x="22" y="30" className="hv-caption">KUBERNETES NODE · USER SPACE</text>

      {pods.map((p) => (
        <g key={p.label}>
          <rect x={p.x} y="44" width="104" height="46" rx="9" className="hv-box" />
          <text x={p.x + 52} y="64" textAnchor="middle" className="hv-label">
            {p.label}
          </text>
          <text x={p.x + 52} y="80" textAnchor="middle" className="hv-sub">
            no sidecar
          </text>
          <path d={`M${p.x + 52} 90 V 150`} className="hv-dash" />
        </g>
      ))}

      <rect x="22" y="150" width="358" height="56" rx="11" fill="url(#hv-daemon)" />
      <text x="201" y="174" textAnchor="middle" className="hv-daemon-title">
        KernelEye DaemonSet
      </text>
      <text x="201" y="192" textAnchor="middle" className="hv-daemon-sub">
        enrich · aggregate · decide · serve
      </text>

      <rect x="22" y="236" width="358" height="26" rx="7" className="hv-maps" />
      <text x="201" y="253" textAnchor="middle" className="hv-mono">
        eBPF maps · ring buffers
      </text>

      <line x1="6" x2="396" y1="282" y2="282" className="hv-boundary" />
      <text x="22" y="302" className="hv-caption">KERNEL SPACE</text>

      {hooks.map((h) => (
        <g key={h.label}>
          <rect x={h.x} y="318" width="80" height="32" rx="8" className="hv-hook" />
          <text x={h.x + 40} y="338" textAnchor="middle" className="hv-hook-label">
            {h.label}
          </text>
        </g>
      ))}

      <rect x="22" y="366" width="358" height="40" rx="9" className="hv-box" />
      <text x="201" y="391" textAnchor="middle" className="hv-kernel-label">
        Linux kernel · TCP/IP · scheduler · block I/O
      </text>

      {up.map((d, i) => (
        <g key={d}>
          <path d={d} className="hv-track" />
          {[0, 1].map((k) => (
            <circle key={k} r="3" className="hv-dot">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.45 + k * 1.2}s`} path={d} />
            </circle>
          ))}
        </g>
      ))}

      {outputs.map((o, i) => {
        const d = `M380 178 C 410 178, 410 ${o.y + 16}, 432 ${o.y + 16}`;
        return (
          <g key={o.label} className={`hv-out hv-tone-${o.tone}`}>
            <path d={d} className="hv-track" />
            <circle r="3" className="hv-out-dot">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${i * 0.5}s`} path={d} />
            </circle>
            <rect x="432" y={o.y} width="80" height="32" rx="8" className="hv-out-box" />
            <text x="472" y={o.y + 20} textAnchor="middle" className="hv-out-label">
              {o.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
