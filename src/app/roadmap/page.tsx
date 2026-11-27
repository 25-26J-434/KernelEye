import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { contactLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What KernelEye has shipped, what is in progress, and what comes next: AI recommendations, Cloud and Enterprise.",
};

export default function Roadmap() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="kicker">Roadmap</span>
          <h1>From research prototype to platform</h1>
          <p>
            What we have shipped since December 2025, what we are building now, and where KernelEye is going next.
            Shipped dates come from the project&apos;s commit history.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="container" style={{ maxWidth: 920 }}>
          <RoadmapTimeline />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta">
            <div>
              <h2>Want something on this list sooner?</h2>
              <p>Tell us what you need. Requests from real deployments shape the order we build in.</p>
            </div>
            <div className="cta-actions">
              <a href={contactLink("Roadmap request")} className="btn btn-primary" target="_blank" rel="noreferrer">
                Request a feature <Icon name="arrow" size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
