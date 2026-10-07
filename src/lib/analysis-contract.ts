import { z } from "zod";

export const inputSchema = z
  .object({
    cv: z
      .string()
      .trim()
      .min(30, "CV must contain at least 30 characters.")
      .max(12000, "CV must be at most 12,000 characters."),
    role: z
      .string()
      .trim()
      .min(100, "Role description must contain at least 100 characters.")
      .max(12000, "Role description must be at most 12,000 characters."),
    projects: z
      .string()
      .trim()
      .max(4000, "Project evidence must be at most 4,000 characters."),
  })
  .strict();
const text = z.string().trim().min(1).max(2000);
const evidence = z
  .object({ source: z.enum(["cv", "projects"]), excerpt: text })
  .strict();
export const resultSchema = z
  .object({
    requirements: z
      .array(
        z
          .object({
            id: z.string().regex(/^R[1-9]\d*$/),
            excerpt: text,
            type: z.enum(["skill", "experience", "credential", "eligibility"]),
            priority: z.enum(["required", "preferred", "unspecified"]),
            assessment: z.enum([
              "self_reported_support",
              "stated_gap",
              "unknown",
            ]),
            evidence: evidence.nullable(),
            explanation: text,
          })
          .strict(),
      )
      .min(1)
      .max(40),
    action: z
      .object({
        kind: z.enum(["project", "clarification"]),
        title: text,
        requirementIds: z.array(z.string()).min(1),
        rationale: text,
        deliverable: text,
        checklist: z.array(text).min(1).max(10),
        githubEvidence: z.array(text).max(10),
        futureCvTemplate: text.nullable(),
      })
      .strict(),
    cvSuggestions: z
      .array(z.object({ evidence, rewrite: text }).strict())
      .max(8),
    clarificationQuestions: z.array(text).max(10),
  })
  .strict();
export type AnalysisInput = z.infer<typeof inputSchema>;
export type AnalysisResult = z.infer<typeof resultSchema>;
export const assessmentLabels = {
  self_reported_support: "Supported · self-reported",
  stated_gap: "Explicit gap",
  unknown: "Needs clarification",
};

export function validateResult(
  value: unknown,
  input: AnalysisInput,
): AnalysisResult {
  const result = resultSchema.parse(value);
  const ids = new Set(result.requirements.map((r) => r.id));
  if (ids.size !== result.requirements.length)
    throw new Error("Duplicate requirement IDs.");
  const checkEvidence = (e: z.infer<typeof evidence>) => {
    if (!input[e.source].includes(e.excerpt))
      throw new Error("Evidence is not an exact supplied excerpt.");
  };
  for (const r of result.requirements) {
    if (!input.role.includes(r.excerpt))
      throw new Error("Requirement is not an exact role excerpt.");
    if (r.assessment !== "unknown" && !r.evidence)
      throw new Error("Assessment requires student evidence.");
    if (r.assessment === "unknown" && r.evidence)
      throw new Error("Unknown must not present evidence as support.");
    if (r.evidence) checkEvidence(r.evidence);
    if (
      r.assessment === "stated_gap" &&
      !/\b(no|not|never|lack|without|haven't|cannot|can't|unable)\b/i.test(
        r.evidence!.excerpt,
      )
    ) {
      throw new Error(
        "Gap must include an explicit limitation; otherwise use unknown.",
      );
    }
  }
  for (const id of result.action.requirementIds)
    if (!ids.has(id))
      throw new Error("Action references an unknown requirement.");
  if (result.action.kind === "project") {
    if (
      result.action.requirementIds.some(
        (id) => result.requirements.find((r) => r.id === id)?.type !== "skill",
      )
    ) {
      throw new Error(
        "A project must address skill requirements, not replace eligibility or professional experience.",
      );
    }
    if (
      !result.action.githubEvidence.length ||
      !result.action.futureCvTemplate
    ) {
      throw new Error(
        "A project needs GitHub evidence guidance and a conditional future CV template.",
      );
    }
  } else if (
    result.action.githubEvidence.length ||
    result.action.futureCvTemplate
  ) {
    throw new Error(
      "A clarification action must not imply a future project is completed.",
    );
  }
  for (const s of result.cvSuggestions) {
    checkEvidence(s.evidence);
    // Conservative lexical grounding rejects new tools, names and metrics. This
    // is an additional guard, not a proof that every paraphrase is semantically true.
    const words = (value: string) =>
      value.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
    const supplied = new Set(words(s.evidence.excerpt));
    const connectiveWords = new Set([
      "a",
      "an",
      "the",
      "and",
      "or",
      "with",
      "using",
      "in",
      "on",
      "for",
      "to",
      "of",
      "my",
      "i",
    ]);
    if (
      words(s.rewrite).some(
        (word) => !supplied.has(word) && !connectiveWords.has(word),
      )
    ) {
      throw new Error("CV wording introduces unsupported words or metrics.");
    }
    if (/\b(no|not|never|haven't|cannot|can't)\b/i.test(s.evidence.excerpt)) {
      throw new Error("Do not rewrite a limitation as an achievement.");
    }
  }
  if (
    result.action.futureCvTemplate &&
    !/use only after completion/i.test(result.action.futureCvTemplate)
  ) {
    throw new Error("Future CV wording must be explicitly conditional.");
  }
  return result;
}
