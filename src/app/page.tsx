import Link from "next/link";
import { OpportunityForm } from "@/components/opportunity-form";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <Link href="/" aria-label="OpportunityGap home">
          Opportunity<span>Gap</span>
        </Link>
        <span className="prototype">Student prototype</span>
      </header>
      <main id="main">
        <section className="hero">
          <p className="eyebrow">From learning to opportunity</p>
          <h1>
            Turn role requirements
            <br />
            into your next practical step.
          </h1>
          <p>
            See what your CV supports, what needs clarification, and one project
            you can build to show your skills.
          </p>
          <div className="hero-notes">
            <span>Evidence you can inspect</span>
            <span>No hiring scores</span>
            <span>A plan you can keep</span>
          </div>
        </section>
        <OpportunityForm />
      </main>
      <footer>
        OpportunityGap · A learning and portfolio planning proof of concept.
      </footer>
    </>
  );
}
