import { assessmentLabels, type AnalysisResult } from "./analysis-contract";
export function formatActionPlan(result: AnalysisResult, mode: "demo" | "ai") {
  return [
    "OpportunityGap action plan",
    mode === "demo"
      ? "DEMO — synthetic example, not an assessment of your CV."
      : "AI interpretation — review against your supplied evidence.",
    "Self-reported evidence is not independently verified. No hiring score or GitHub inspection is provided.",
    "\nREQUIREMENT COMPARISON",
    ...result.requirements.map(
      (r) =>
        `${r.id} · ${r.type} · ${r.priority}\nRole: ${r.excerpt}\n${assessmentLabels[r.assessment]}\n${r.evidence ? `${r.evidence.source}: ${r.evidence.excerpt}` : "No supporting evidence supplied."}\n${r.explanation}\n`,
    ),
    "NEXT ACTION",
    result.action.title,
    `Addresses: ${result.action.requirementIds.join(", ")}`,
    result.action.rationale,
    result.action.deliverable,
    ...result.action.checklist.map((s) => `[ ] ${s}`),
    "\nGITHUB EVIDENCE TO CAPTURE",
    ...result.action.githubEvidence,
    result.action.futureCvTemplate
      ? `\nUSE ONLY AFTER COMPLETION\n${result.action.futureCvTemplate}`
      : "",
    "\nTRUTHFUL CV WORDING",
    ...result.cvSuggestions.map(
      (s) =>
        `Source (${s.evidence.source}): ${s.evidence.excerpt}\nSuggested wording: ${s.rewrite}`,
    ),
    "\nCLARIFICATIONS",
    ...result.clarificationQuestions,
    "\nThis downloaded file may contain personal evidence. Keep it somewhere private.",
  ].join("\n\n");
}
