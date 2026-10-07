import { assessmentLabels, type AnalysisResult } from "@/lib/analysis-contract";
import { formatActionPlan } from "@/lib/action-plan";

export function AnalysisResults({
  result,
  mode,
}: {
  result: AnalysisResult;
  mode: "demo" | "ai";
}) {
  function download() {
    const url = URL.createObjectURL(
      new Blob([formatActionPlan(result, mode)], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "opportunitygap-action-plan.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section aria-labelledby="results-heading" className="results">
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / Your next steps</p>
          <h2 id="results-heading" tabIndex={-1}>
            Your evidence & action plan
          </h2>
        </div>
        <button type="button" onClick={download}>
          Download action plan (.txt)
        </button>
      </div>
      <p className="notice">
        {mode === "demo"
          ? "GUIDED DEMO · Synthetic example"
          : "AI RESULTS · Check this interpretation against your own evidence."}{" "}
        Support is self-reported, not verified proficiency. No hiring score or
        GitHub inspection is provided.
      </p>
      <h3>Requirement-by-requirement comparison</h3>
      <div className="requirements">
        {result.requirements.map((r) => (
          <article className="requirement" key={r.id}>
            <div className="requirement-top">
              <span className="requirement-meta">
                {r.id} · {r.type} · {r.priority}
              </span>
              <span className={`badge ${r.assessment}`}>
                {assessmentLabels[r.assessment]}
              </span>
            </div>
            <h4>{r.excerpt}</h4>
            <p>{r.explanation}</p>
            {r.evidence ? (
              <blockquote>
                <span>
                  Supplied {r.evidence.source === "cv" ? "CV" : "project"}{" "}
                  evidence
                </span>
                <p>{r.evidence.excerpt}</p>
              </blockquote>
            ) : (
              <p className="muted">
                No supporting evidence supplied. Ask for clarification.
              </p>
            )}
          </article>
        ))}
      </div>
      <article className="project-card">
        <p className="eyebrow">
          One practical next action · {result.action.requirementIds.join(", ")}
        </p>
        <h3>{result.action.title}</h3>
        <p>{result.action.rationale}</p>
        <p>
          <strong>Deliverable:</strong> {result.action.deliverable}
        </p>
        <h4>Completion checklist</h4>
        <ul>
          {result.action.checklist.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {result.action.githubEvidence.length > 0 && (
          <>
            <h4>Evidence to capture in your GitHub README</h4>
            <ul>
              {result.action.githubEvidence.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        )}
        {result.action.futureCvTemplate && (
          <div className="future">
            <strong>Future CV template — use only after completion</strong>
            <p>{result.action.futureCvTemplate}</p>
          </div>
        )}
      </article>
      <h3>Truthful CV suggestions</h3>
      <p>
        Use only wording that accurately describes your experience. These
        suggestions refer to supplied experience, not the proposed project.
      </p>
      {result.cvSuggestions.length === 0 && (
        <p>
          No supported rewrite is available. Document your actual contribution
          first.
        </p>
      )}
      {result.cvSuggestions.map((s, i) => (
        <article className="requirement" key={i}>
          <blockquote>
            <span>Supplied {s.evidence.source} evidence</span>
            <p>{s.evidence.excerpt}</p>
          </blockquote>
          <p>
            <strong>Suggested wording:</strong> {s.rewrite}
          </p>
        </article>
      ))}
      {result.clarificationQuestions.length > 0 && (
        <>
          <h3>What to clarify</h3>
          <ul>
            {result.clarificationQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </>
      )}
      <p className="muted">
        The download works offline once saved. It may contain personal evidence;
        keep it private.
      </p>
    </section>
  );
}
