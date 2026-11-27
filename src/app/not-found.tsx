import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "70vh", display: "grid", alignItems: "center" }}>
      <div className="container">
        <span className="kicker">
          404
        </span>
        <h1>This page isn&apos;t in any eBPF map.</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
