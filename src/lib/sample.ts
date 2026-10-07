import type { AnalysisInput, AnalysisResult } from "./analysis-contract";
export const sampleInput: AnalysisInput = {
  cv: `Synthetic student CV — Alex
I am currently studying for a BSc in Computer Science.
Built a responsive study planner using HTML, CSS and JavaScript.
Used Git to track changes and collaborated with two classmates on the study planner.
I have not written automated tests yet.`,
  role: `Synthetic internship — Frontend development
Requirements:
- Build responsive interfaces with HTML, CSS and JavaScript.
- Use Git for version control.
- Write automated tests.
- Communicate and collaborate with a team.
- A completed bachelor's degree is required.
- Previous professional development experience is preferred.
- Availability to work 20 hours per week is required.`,
  projects: `The study planner lets students add tasks and filter by subject. I built the task form and responsive layout.`,
};
export const sampleResult: AnalysisResult = {
  requirements: [
    {
      id: "R1",
      excerpt: "Build responsive interfaces with HTML, CSS and JavaScript.",
      type: "skill",
      priority: "required",
      assessment: "self_reported_support",
      evidence: {
        source: "cv",
        excerpt:
          "Built a responsive study planner using HTML, CSS and JavaScript.",
      },
      explanation:
        "The CV describes relevant interface work. This is self-reported, not verified proficiency.",
    },
    {
      id: "R2",
      excerpt: "Use Git for version control.",
      type: "skill",
      priority: "required",
      assessment: "self_reported_support",
      evidence: {
        source: "cv",
        excerpt:
          "Used Git to track changes and collaborated with two classmates on the study planner.",
      },
      explanation: "The supplied CV explicitly describes using Git.",
    },
    {
      id: "R3",
      excerpt: "Write automated tests.",
      type: "skill",
      priority: "required",
      assessment: "stated_gap",
      evidence: {
        source: "cv",
        excerpt: "I have not written automated tests yet.",
      },
      explanation:
        "The student explicitly states a testing limitation. This is a learning gap.",
    },
    {
      id: "R4",
      excerpt: "Communicate and collaborate with a team.",
      type: "skill",
      priority: "required",
      assessment: "self_reported_support",
      evidence: {
        source: "cv",
        excerpt:
          "Used Git to track changes and collaborated with two classmates on the study planner.",
      },
      explanation:
        "Classmate collaboration provides self-reported teamwork evidence; professional teamwork is not claimed.",
    },
    {
      id: "R5",
      excerpt: "A completed bachelor's degree is required.",
      type: "credential",
      priority: "required",
      assessment: "unknown",
      evidence: null,
      explanation:
        "Currently studying does not establish a completed degree. Clarify eligibility with the employer; a project cannot replace this credential.",
    },
    {
      id: "R6",
      excerpt: "Previous professional development experience is preferred.",
      type: "experience",
      priority: "preferred",
      assessment: "unknown",
      evidence: null,
      explanation:
        "No professional experience is supplied. Absence of evidence does not prove lack of experience.",
    },
    {
      id: "R7",
      excerpt: "Availability to work 20 hours per week is required.",
      type: "eligibility",
      priority: "required",
      assessment: "unknown",
      evidence: null,
      explanation: "Availability is not stated and needs clarification.",
    },
  ],
  action: {
    kind: "project",
    title: "Build a tested task planner",
    requirementIds: ["R3", "R1", "R2"],
    rationale:
      "Practise automated testing (R3) in a small project connected to your existing interface and Git experience (R1, R2). This does not satisfy the degree or professional experience requirements.",
    deliverable:
      "A GitHub repository with a small task planner and automated tests for adding, filtering and completing tasks.",
    checklist: [
      "Build a small task form, subject filter and completion control.",
      "Write automated tests for the three main behaviours and an empty task error.",
      "Run the tests and record the actual result in the README.",
      "Commit the implementation and tests to GitHub with a README describing your contribution.",
    ],
    githubEvidence: [
      "Problem: what the task planner helps students do.",
      "Approach: tools and design choices you actually used.",
      "Evidence: screenshots, test commands and actual test results.",
      "Personal contribution: what you built yourself and any help received.",
    ],
    futureCvTemplate:
      "Use only after completion: Built a task planner using [tools actually used] and wrote automated tests covering [behaviours actually tested].",
  },
  cvSuggestions: [
    {
      evidence: {
        source: "cv",
        excerpt:
          "Built a responsive study planner using HTML, CSS and JavaScript.",
      },
      rewrite:
        "Built a responsive study planner with HTML, CSS and JavaScript.",
    },
    {
      evidence: {
        source: "projects",
        excerpt: "I built the task form and responsive layout.",
      },
      rewrite:
        "Built the task form and responsive layout.",
    },
  ],
  clarificationQuestions: [
    "Does the employer accept students working toward the required degree?",
    "Do you have professional development experience to document?",
    "Can you commit to 20 hours per week?",
  ],
};
