"use client";
import { useRef, useState, type FormEvent } from "react";
import {
  inputSchema,
  validateResult,
  type AnalysisInput,
  type AnalysisResult,
} from "@/lib/analysis-contract";
import { sampleInput } from "@/lib/sample";
import { analyseDemo } from "@/lib/demo-analysis";
import { AnalysisResults } from "./analysis-results";
const emptyInput: AnalysisInput = { cv: "", role: "", projects: "" };

export function OpportunityForm() {
  const [input, setInput] = useState(emptyInput);
  const [mode, setMode] = useState<"demo" | "ai">("demo");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AnalysisInput, string>>
  >({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  function resetResult() {
    setResult(null);
    setError("");
  }
  function loadSample() {
    setInput({ ...sampleInput });
    setMode("demo");
    setErrors({});
    resetResult();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    resetResult();
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) {
      const messages: Partial<Record<keyof AnalysisInput, string>> = {};
      for (const issue of parsed.error.issues)
        messages[issue.path[0] as keyof AnalysisInput] = issue.message;
      setErrors(messages);
      const first = Object.keys(messages)[0];
      (
        form.current?.elements.namedItem(first) as HTMLTextAreaElement | null
      )?.focus();
      return;
    }
    setErrors({});
    if (mode === "ai" && !consent) {
      setError(
        "Confirm you agree to send this text to the AI provider before analysing.",
      );
      return;
    }
    setBusy(true);
    try {
      let next: AnalysisResult;
      if (mode === "demo") next = analyseDemo(parsed.data);
      else {
        const response = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
          signal: AbortSignal.timeout(35000),
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Analysis failed. Please try again.");
        next = validateResult(data, parsed.data);
      }
      setResult(next);
      requestAnimationFrame(() =>
        document.getElementById("results-heading")?.focus(),
      );
    } catch (e) {
      setError(
        mode === "demo" && e instanceof Error
          ? e.message
          : e instanceof Error &&
              /^(AI |Analysis |The provider)/.test(e.message)
            ? e.message
            : "AI analysis could not complete or returned invalid evidence. Your inputs are retained. Try again or explicitly load the demo sample.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="input-card" aria-labelledby="input-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / Start with your evidence</p>
            <h2 id="input-heading">A CV. A role. A clearer next step.</h2>
          </div>
          <button type="button" onClick={loadSample} disabled={busy}>
            Load sample inputs
          </button>
        </div>
        <form ref={form} onSubmit={submit} noValidate>
          <fieldset disabled={busy}>
            <legend>Analysis mode</legend>
            <p className="mode-intro">
              Start with Guided Demo to explore the workflow, then use your own
              evidence when a live provider is configured.
            </p>
            <div className="mode-options">
              <label>
                <input
                  type="radio"
                  name="mode"
                  aria-labelledby="demo-mode-label"
                  aria-describedby="demo-mode-hint"
                  checked={mode === "demo"}
                  onChange={() => {
                    setMode("demo");
                    resetResult();
                  }}
                />{" "}
                <span>
                  <span className="mode-title" id="demo-mode-label">
                    Guided Demo
                  </span>
                  <span className="mode-hint" id="demo-mode-hint">
                    Recommended start · Synthetic profile
                  </span>
                </span>
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  aria-labelledby="ai-mode-label"
                  aria-describedby="ai-mode-hint"
                  checked={mode === "ai"}
                  onChange={() => {
                    setMode("ai");
                    resetResult();
                  }}
                />{" "}
                <span>
                  <span className="mode-title" id="ai-mode-label">
                    Live AI Analysis
                  </span>
                  <span className="mode-hint" id="ai-mode-hint">
                    Your own text · Requires a configured provider
                  </span>
                </span>
              </label>
            </div>
            <p className="notice">
              {mode === "demo"
                ? "Guided Demo uses a synthetic student profile to demonstrate OpportunityGap’s full evidence-to-action workflow. Live AI analysis requires a configured API provider."
                : "AI mode sends your CV, role and optional project text to OpenAI through our server. Availability depends on server configuration. AI interpretations can be mistaken. Provider retention may apply; see the privacy note below."}
            </p>
            <p className="muted">
              Remove phone numbers, addresses and unnecessary personal details
              before pasting. Inputs stay in this page’s memory and are cleared
              on reload; they are not automatically saved.
            </p>
            <div className="input-grid">
              {(
                [
                  {
                    key: "cv",
                    label: "CV text",
                    min: 30,
                    max: 12000,
                    hint: "Describe experience you actually have.",
                  },
                  {
                    key: "role",
                    label: "Job or internship description",
                    min: 100,
                    max: 12000,
                    hint: "Include the role’s requirements and eligibility rules.",
                  },
                  {
                    key: "projects",
                    label: "Additional project evidence (optional)",
                    min: 0,
                    max: 4000,
                    hint: "What you built, tools used and your personal contribution. Links will not be fetched.",
                  },
                ] as const
              ).map((field) => (
                <div
                  className={`field ${field.key === "projects" ? "wide" : ""}`}
                  key={field.key}
                >
                  <label htmlFor={field.key}>{field.label}</label>
                  <p id={`${field.key}-hint`} className="hint">
                    {field.hint}{" "}
                    {field.min ? `${field.min.toLocaleString()}–` : "Up to "}
                    {field.max.toLocaleString()} characters.
                  </p>
                  <textarea
                    id={field.key}
                    name={field.key}
                    value={input[field.key]}
                    rows={field.key === "projects" ? 3 : 10}
                    maxLength={field.max}
                    required={field.min > 0}
                    aria-invalid={!!errors[field.key]}
                    aria-describedby={`${field.key}-hint ${field.key}-error`}
                    onChange={(e) => {
                      setInput({ ...input, [field.key]: e.target.value });
                      resetResult();
                      setErrors({ ...errors, [field.key]: undefined });
                    }}
                  />
                  <div className="field-footer">
                    <span id={`${field.key}-error`} className="field-error">
                      {errors[field.key]}
                    </span>
                    <span>
                      {input[field.key].length.toLocaleString()} /{" "}
                      {field.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {mode === "ai" && (
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />{" "}
                I agree to send the supplied text to OpenAI for analysis.
              </label>
            )}
            <button className="primary" type="submit">
              {busy
                ? "Analysing…"
                : mode === "demo"
                  ? "Analyse demo sample"
                  : "Analyse supplied text"}
            </button>
          </fieldset>
          <p role="status" className="status">
            {busy
              ? "Analysing your inputs. Please wait."
              : result
                ? "Analysis complete. Your action plan is ready."
                : ""}
          </p>
          {error && (
            <p role="alert" aria-label="Analysis error" className="error">
              {error}
            </p>
          )}
        </form>
      </section>
      {result && <AnalysisResults result={result} mode={mode} />}
      <aside className="privacy">
        <h2>Evidence first. Your next step, honestly.</h2>
        <p>
          A missing detail is a question, not proof that you lack a skill. A
          project can build evidence of a skill; it cannot replace a degree or
          other eligibility requirement. We do not predict hiring success or
          inspect GitHub repositories.
        </p>
        <p>
          <strong>Privacy:</strong> OpportunityGap does not save or log your CV
          or project text. Demo analysis stays in your browser. AI analysis
          sends text to OpenAI; provider retention depends on account settings
          and policy. Live retention behaviour has not been verified for this
          prototype, so use synthetic or de-identified text. There are no
          accounts, analytics or automatic input storage.
        </p>
      </aside>
    </>
  );
}
