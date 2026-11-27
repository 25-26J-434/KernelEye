import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { comparison, plans, pricingFaq, type Cell } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "KernelEye is free and open source. Cloud and Enterprise plans are on the way.",
};

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return (
      <span className="cell-yes" aria-label="Included">
        <Icon name="check" size={17} />
      </span>
    );
  if (value === false)
    return (
      <span className="cell-no" aria-label="Not included">
        —
      </span>
    );
  return <span className="cell-text">{value}</span>;
}

export default function Pricing() {
  return (
    <>
      <section className="page-hero center-hero">
        <div className="container">
          <span className="kicker">Pricing</span>
          <h1>Start free. Scale when you&apos;re ready.</h1>
          <p>
            The open-source edition has every feature available today. Cloud and Enterprise add hosted operations, AI
            and governance as they launch.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="plans">
            {plans.map((p) => (
              <div key={p.id} className={`plan${p.highlight ? " featured" : ""}`}>
                <div className="plan-top">
                  <h3>{p.name}</h3>
                  <span className={`status-pill ${p.availability === "Available now" ? "shipped" : p.availability === "Early access" ? "in-progress" : "planned"}`}>
                    {p.availability}
                  </span>
                </div>
                <div className="plan-price">{p.price}</div>
                <div className="plan-note">{p.priceNote}</div>
                <p className="plan-desc">{p.description}</p>
                {p.cta.external ? (
                  <a href={p.cta.href} className={`btn ${p.highlight ? "btn-primary" : "btn-ghost"} plan-cta`} target="_blank" rel="noreferrer">
                    {p.cta.label} <Icon name="arrow" size={16} />
                  </a>
                ) : (
                  <Link href={p.cta.href} className={`btn ${p.highlight ? "btn-primary" : "btn-ghost"} plan-cta`}>
                    {p.cta.label} <Icon name="arrow" size={16} />
                  </Link>
                )}
                <ul className="plan-features">
                  {p.includesFrom && <li className="plan-includes">Everything in {p.includesFrom}, plus:</li>}
                  {p.features.map((f) => (
                    <li key={f}>
                      <Icon name="check" size={16} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="muted small" style={{ textAlign: "center", marginTop: 24 }}>
            Cloud and Enterprise are on the <Link href="/roadmap/">roadmap</Link>. Features and plan contents may
            change before launch.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Compare plans</span>
            <h2>What&apos;s in each plan</h2>
          </div>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th />
                  {plans.map((p) => (
                    <th key={p.id} className={p.highlight ? "featured" : ""}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {comparison.map((g) => (
                <tbody key={g.group}>
                  <tr className="group-row">
                    <th colSpan={4}>{g.group}</th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      {r.values.map((v, i) => (
                        <td key={i} className={plans[i].highlight ? "featured" : ""}>
                          <CellValue value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-layout">
          <div>
            <span className="kicker">FAQ</span>
            <h2>Questions about plans and billing</h2>
            <p className="section-lead">
              Can&apos;t find an answer? <Link href="/enterprise/">Talk to us</Link>.
            </p>
          </div>
          <Faq items={pricingFaq} />
        </div>
      </section>
    </>
  );
}
