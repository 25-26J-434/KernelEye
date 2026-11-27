import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/CodeBlock";
import { Icon } from "@/components/Icon";
import { features, getFeature } from "@/lib/features";
import { repoFile } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = getFeature(slug);
  return f ? { title: f.name, description: f.summary } : {};
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = getFeature(slug);
  if (!f) notFound();

  const idx = features.findIndex((x) => x.slug === f.slug);
  const next = features[(idx + 1) % features.length];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/#features">Features</Link> / {f.name}
          </div>
          <div className="hero-icon">
            <Icon name={f.icon} size={28} />
          </div>
          <span className="kicker">
            {f.name}
          </span>
          <h1>{f.headline}</h1>
          <p>{f.intro}</p>
          <div className="hero-ctas" style={{ marginTop: 28 }}>
            <Link href="/get-started/" className="btn btn-primary">
              Deploy it <Icon name="arrow" size={18} />
            </Link>
            {f.docs[0] && (
              <a href={repoFile(f.docs[0].path)} className="btn btn-ghost" target="_blank" rel="noreferrer">
                <Icon name="book" size={18} /> Read the docs
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Capabilities</span>
            <h2>What you get</h2>
          </div>
          <div className="grid-3">
            {f.highlights.map((h) => (
              <div key={h.title} className="card">
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">How it works</span>
            <h2>Under the hood</h2>
            <ol className="steps" style={{ marginTop: 28 }}>
              {f.steps.map((s) => (
                <li key={s}>
                  <p style={{ margin: 0, color: "var(--text)" }}>{s}</p>
                </li>
              ))}
            </ol>
          </div>
          <CodeBlock title={f.code.title} lang={f.code.lang} code={f.code.body} />
        </div>
      </section>

      <section className="section">
        <div className="container grid-2" style={{ alignItems: "start", gap: 48 }}>
          <div>
            <span className="kicker">API</span>
            <h2 style={{ fontSize: "1.8rem" }}>Endpoints</h2>
            <table className="endpoints">
              <tbody>
                {f.endpoints.map((e) => (
                  <tr key={e.method + e.path}>
                    <td style={{ width: 70 }}>
                      <span className={`method ${e.method}`}>{e.method}</span>
                    </td>
                    <td>
                      <div className="path">{e.path}</div>
                      <div className="muted small">{e.note}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <span className="kicker">Documentation</span>
            <h2 style={{ fontSize: "1.8rem" }}>Go deeper</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {f.docs.map((d) => (
                <a key={d.path} href={repoFile(d.path)} className="doc-link" target="_blank" rel="noreferrer">
                  <span className="card-icon">
                    <Icon name="book" size={18} />
                  </span>
                  <span>
                    <strong>{d.label}</strong>
                    <small>{d.path}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Link href={`/features/${next.slug}/`} className="card" style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            <span className="card-icon" style={{ margin: 0 }}>
              <Icon name={next.icon} />
            </span>
            <span style={{ flex: 1 }}>
              <small className="muted">Next feature</small>
              <h3 style={{ margin: 0 }}>{next.name}</h3>
            </span>
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
