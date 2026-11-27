import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Icon } from "@/components/Icon";
import { features } from "@/lib/features";
import { useCases } from "@/lib/use-cases";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "How teams use KernelEye in production: flash-sale scaling, noisy-neighbour isolation, kernel-level alerting and more.",
};

const featureName = (slug: string) => features.find((f) => f.slug === slug);

export default function UseCases() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Use Cases
          </div>
          <span className="kicker">Use cases</span>
          <h1>Built for problems you already have</h1>
          <p>
            From flash-sale traffic to noisy tenants and edge sites, here is how teams put kernel telemetry to work.
            Each scenario uses the real API, so you can copy it.
          </p>
          <div className="usecase-index">
            {useCases.map((u) => (
              <a key={u.id} href={`#${u.id}`} className="chip">
                <Icon name={u.icon} size={15} /> {u.industry}
              </a>
            ))}
          </div>
        </div>
      </section>

      {useCases.map((u, i) => (
        <section key={u.id} id={u.id} className={`section${i % 2 ? " section-soft" : ""}`}>
          <div className={`container split usecase${i % 2 ? " reverse" : ""}`}>
            <div>
              <div className="usecase-head">
                <span className="card-icon">
                  <Icon name={u.icon} />
                </span>
                <span className="kicker" style={{ margin: 0 }}>
                  {u.industry}
                </span>
              </div>
              <h2>{u.title}</h2>
              <h3 className="usecase-label">The challenge</h3>
              <p className="section-lead">{u.problem}</p>
              <h3 className="usecase-label">With KernelEye</h3>
              <p className="section-lead">{u.solution}</p>
              <ul className="checklist">
                {u.outcomes.map((o) => (
                  <li key={o}>
                    <Icon name="check" size={18} />
                    {o}
                  </li>
                ))}
              </ul>
              <div className="feature-tags">
                {u.features.map((slug) => {
                  const f = featureName(slug);
                  return f ? (
                    <Link key={slug} href={`/features/${slug}/`} className="chip">
                      <Icon name={f.icon} size={15} /> {f.name}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
            <CodeBlock title={u.example.title} lang={u.example.lang} code={u.example.body} />
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Have a similar problem?</h2>
              <p>Deploy KernelEye to a staging cluster and spend a week watching your baseline before you automate anything.</p>
            </div>
            <div className="cta-actions">
              <Link href="/get-started/" className="btn btn-primary">
                Deploy guide <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
