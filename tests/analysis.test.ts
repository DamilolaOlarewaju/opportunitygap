import test from "node:test";
import assert from "node:assert/strict";
import { inputSchema, validateResult } from "../src/lib/analysis-contract";
import { sampleInput, sampleResult } from "../src/lib/sample";
import { analyseDemo } from "../src/lib/demo-analysis";
import { formatActionPlan } from "../src/lib/action-plan";

test("synthetic demo covers every role requirement and all three assessments", () => {
  const result = analyseDemo(sampleInput);
  assert.equal(result.requirements.length, 7);
  assert.deepEqual(
    new Set(result.requirements.map((r) => r.assessment)),
    new Set(["self_reported_support", "stated_gap", "unknown"]),
  );
  assert.equal(
    result.requirements.find((r) => r.type === "credential")?.assessment,
    "unknown",
  );
  assert.equal(
    result.requirements.find((r) => r.type === "experience")?.assessment,
    "unknown",
  );
  assert.ok(result.action.requirementIds.includes("R3"));
});
test("demo refuses edited text rather than substituting sample results", () => {
  assert.throws(
    () =>
      analyseDemo({
        ...sampleInput,
        cv: sampleInput.cv + "\nOther experience.",
      }),
    /only the labelled sample/,
  );
});
test("input limits allow empty project evidence and reject bad bounds", () => {
  assert.ok(inputSchema.safeParse({ ...sampleInput, projects: "" }).success);
  for (const input of [
    { ...sampleInput, cv: "" },
    { ...sampleInput, role: "a".repeat(99) },
    { ...sampleInput, cv: "a".repeat(12001) },
    { ...sampleInput, projects: "a".repeat(4001) },
  ])
    assert.ok(!inputSchema.safeParse(input).success);
  assert.ok(
    inputSchema.safeParse({
      cv: "a".repeat(30),
      role: "a".repeat(100),
      projects: "a".repeat(4000),
    }).success,
  );
});
test("source and evidence checks reject fabricated excerpts and unsupported assessments", () => {
  const mutations = [
    (r: typeof sampleResult) => {
      r.requirements[0].excerpt = "Invented requirement";
    },
    (r: typeof sampleResult) => {
      r.requirements[0].evidence!.excerpt = "Invented achievement";
    },
    (r: typeof sampleResult) => {
      r.requirements[0].evidence = null;
    },
    (r: typeof sampleResult) => {
      r.requirements[0].assessment = "stated_gap";
    },
    (r: typeof sampleResult) => {
      r.requirements[4].assessment = "stated_gap";
    },
    (r: typeof sampleResult) => {
      r.cvSuggestions[0].evidence.excerpt = "Increased sales by 50%";
    },
    (r: typeof sampleResult) => {
      r.cvSuggestions[0].rewrite =
        "Built a responsive study planner with React and increased sales by 50%.";
    },
    (r: typeof sampleResult) => {
      r.action.futureCvTemplate = "Already completed the project.";
    },
    (r: typeof sampleResult) => {
      r.action.requirementIds = ["R99"];
    },
    (r: typeof sampleResult) => {
      r.action.requirementIds = ["R5"];
    },
    (r: typeof sampleResult) => {
      r.requirements[1].id = "R1";
    },
  ];
  for (const mutate of mutations) {
    const result = structuredClone(sampleResult);
    mutate(result);
    assert.throws(() => validateResult(result, sampleInput));
  }
  assert.throws(() =>
    validateResult({ ...sampleResult, hiringScore: 90 }, sampleInput),
  );
});
test("download includes evidence, practical deliverable, truthful wording and completion warning", () => {
  const plan = formatActionPlan(analyseDemo(sampleInput), "demo");
  for (const content of [
    "DEMO",
    "R3",
    "I have not written automated tests yet.",
    "No supporting evidence supplied.",
    sampleResult.action.deliverable,
    "[ ]",
    "USE ONLY AFTER COMPLETION",
    sampleResult.cvSuggestions[0].rewrite,
  ])
    assert.ok(plan.includes(content), content);
});

test("credential-only action clarifies eligibility rather than forcing a project", () => {
  const result = structuredClone(sampleResult);
  result.action = {
    kind: "clarification",
    title: "Ask whether students are eligible",
    requirementIds: ["R5"],
    rationale: "A degree in progress does not establish a completed degree.",
    deliverable: "A documented eligibility answer from the employer.",
    checklist: ["Ask whether current students can apply."],
    githubEvidence: [],
    futureCvTemplate: null,
  };
  assert.equal(
    validateResult(result, sampleInput).action.kind,
    "clarification",
  );
  result.action.kind = "project";
  result.action.requirementIds = ["R3", "R5"];
  assert.throws(
    () => validateResult(result, sampleInput),
    /skill requirements/,
  );
});
