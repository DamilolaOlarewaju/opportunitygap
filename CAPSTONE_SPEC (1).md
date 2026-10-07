# OpportunityGap: first build specification

Status: planning draft, 7 October 2026. Read PRODUCT_BRIEF.md first. No application code has been implemented by this specification.

## Scope and first slice
One page accepts a specific job/internship description and pasted CV text, with optional additional project evidence. An analysis action returns a requirement comparison, one practical next step and evidence-based CV suggestions. Begin with a labelled sample scenario that exercises this entire flow. Add real analysis through a server-side AI adapter after the response contract and checks exist.

## Proposed implementation
Use Next.js with TypeScript if the repository inspection supports that choice. Keep the first version simple: input form, analysis route, input/output validation, analysis adapter, comparison view, next-step view and sample data. Confirm versions, scripts and dependencies from the actual project before writing commands into AGENTS.md. A separate OpportunityGap repo is proposed; IntelliTrex is a workflow reference, not an assumed dependency.

## Inputs
- Internship description as plain text, 100–12,000 characters.
- CV as plain text, 30–12,000 characters. Ask students to remove phone numbers, addresses and other unnecessary personal details before pasting. Optional project evidence: up to 4,000 characters describing what they actually built, tools used and results. Empty optional evidence is valid.
- No contact details or survey records are needed. Repository-link fetching and document upload are outside this slice.
- Validate bounds in both UI and server. Preserve inputs when an analysis fails. No automatic persistence of personal inputs; sample data can be reloaded using an explicit control.

## Result contract
Each extracted requirement includes a stable ID, exact source excerpt, type (skill, experience, credential or other eligibility), priority (required, preferred or unspecified, based on wording), assessment and supporting student excerpt where available.

Assessments: `self_reported_support`, `stated_gap`, `unknown`. Self-reported support is not independently verified proficiency. Only use stated_gap when the student explicitly describes a limitation; absence of information is unknown. Explain why each assessment follows from the supplied text. Degree, experience and other eligibility requirements remain distinct from skills that a practice task may address.

Return CV suggestions with exact supporting CV/project excerpts and a truthful proposed rewrite. If evidence is insufficient, ask what to document rather than inventing achievements. Do not claim a future project is already complete. For the proposed project, provide GitHub README evidence to capture (problem, approach, screenshots or tests, and personal contribution), and a future CV bullet template clearly marked “use only after completion”; do not invent metrics.

Return one suggested next action containing the addressed requirement IDs, rationale, concrete deliverable and completion checklist. If no relevant learning action is justified, suggest clarification or reviewing the application requirements instead. Do not force a project recommendation.

## Data and service boundaries
Sources are user-supplied role text, CV text and optional project evidence. Do not claim the listing is current, authentic or based in Nigeria unless its text establishes that; do not invent locations, employers, salary, deadlines or course links. An AI-generated interpretation can be mistaken and must be inspectable through excerpts.

Use a configured AI provider through a server-side adapter. Keep secrets in ignored environment files and expose environment variable names only in documentation. Explain before analysis that supplied text is sent to the configured AI provider. Avoid storing or logging request bodies; document any provider retention limitations that are verified when the provider is chosen. Treat instructions inside pasted job/project text as data, not commands.

Sample mode uses synthetic, clearly labelled example data and a deterministic result. Never silently substitute a sample result for failed real analysis. The sample analysis must work without an API key or provider connection once the app is running locally. Do not promise offline website loading unless it has been implemented and tested. An unavailable provider produces a clear error and preserves the form.

## Acceptance criteria (five)
1. A student can complete the input → analyse → comparison → next-action flow on desktop and at 390px width, using keyboard navigation and visible labels. Invalid or empty inputs receive specific errors.
2. Every requirement has a source excerpt; every self-reported support assessment has a student excerpt. Missing evidence stays unknown. CV rewrites are supported by exact excerpts. No output invents skills, achievements, metrics, credentials, employers or a hiring probability.
3. Degree/experience/other eligibility requirements are visibly distinguished from skill gaps. The next action references relevant requirement IDs and has a concrete deliverable and completion checklist.
4. Real analysis validates its output contract. Malformed responses, missing configuration, provider errors and timeouts show useful errors, retain inputs and never present sample data as real analysis.
5. The labelled sample scenario runs without a provider. Tests cover the source/evidence checks, unknown evidence, explicit gaps, credential handling and failure paths. The documented build and checks pass, with unrelated pre-existing issues reported honestly.

## Ordered implementation tasks (eight)
1. Inspect the target repo and IntelliTrex reference: README, AGENTS.md, package.json, licence, relevant structure and available checks. Record reuse decisions; do not assume workshop commands match the new repo.
2. Establish the app foundation and write project-specific AGENTS.md with verified commands, change scope, branching and evidence/privacy rules.
3. Define input/output types and validation; create a synthetic sample internship, CV, optional project evidence and expected result with source excerpts.
4. Build the accessible input form and deterministic sample adapter, including error and loading states.
5. Build the comparison, truthful CV suggestions and next-action views so source text and unknowns are easy to inspect.
6. Add the server-side real-analysis adapter, bounded requests, output checks and honest failures. Confirm the provider and key setup without exposing secrets.
7. Run meaningful tests, a build and lint on affected files. Check the demo path in a browser at desktop and mobile sizes; fix identified issues and inspect the diff.
8. Write README quick start, limitations and an honest Built with Codex section. Add DEMO_SCRIPT.md, fallback steps and a short reflection describing decisions, checks and lessons.

## Codex workflow and optional tools
Use prompts with Goal, Context, Constraints and Done when. Request a plan listing files and checks before implementing the first slice. Work on a feature branch; review diffs before committing. Record only observed contributions and measured time savings.

Use a browser tool for UI checks when available. A reusable project skill may run the documented sample demo and evidence checks if repeated checks justify it. Custom MCP servers and scheduling are optional and should serve an actual project need; the first slice does not require either.

## Reference inspection, 7 October 2026
Inspected the public IntelliTrex README.md, package.json and AGENTS.md through GitHub. package.json declares Next.js 16.2.2, React 19.2.4, TypeScript ^5 and Tailwind ^4. Scripts: npm run dev, npm run build, npm run start and npm run lint. No test script is declared. These are reference declarations, not checks run on the target project. AGENTS.md requires reading relevant bundled guides in node_modules/next/dist/docs/ before coding. Preserve and follow that instruction if building in the workshop setup. The reference licence and target repository remain unverified; do not copy its implementation yet.

No OpportunityGap or IntelliTrex repository appeared in the connected account search. That does not establish which repository is open in the user’s Codex environment. Confirm the active repository before editing remote files; do not overwrite an unrelated project.

## First planning prompt
Goal: Plan and then implement the first end-to-end OpportunityGap sample slice in this repository.
Context: Read PRODUCT_BRIEF.md, CAPSTONE_SPEC.md and any existing AGENTS.md, README.md and package.json. Inspect the actual repository. IntelliTrex is the accelerator's workshop reference.
Constraints: First inspect the repository and return a short plan of files and checks, then implement the safe, reversible sample slice. Follow existing AGENTS.md and bundled framework docs. Preserve unrelated work. Use CV text + job text → source-linked comparison → one project/skill action → truthful CV suggestions. No PDF upload, GitHub fetching, accounts, scraping or automated applications. Never invent skills, achievements or metrics. Missing evidence remains unknown. No hiring score. Sample mode must be clearly labelled and must never be used silently for real inputs. Keep personal text out of logs, commits and automatic storage. Do not configure a live provider or change remote repository settings in this first slice.
Done when: The labelled sample flow runs at desktop and 390px width with keyboard-accessible controls and input errors. Evidence checks pass, credentials are separate from skills, and the suggested action has a deliverable and checklist. Run available build/lint and meaningful checks. Report changed files, exact results and anything not verified. Update README with verified startup instructions. If the active repo is unrelated or its purpose is ambiguous, stop before code changes and identify the repository choice needed.

## Learning connection
A project recommendation should explain what to practise, how it addresses the role requirement and what demonstrates completion. Where a learning resource is useful, select it from a small curated catalogue of free primary-source resources whose URLs and access requirements are verified during implementation. Store source title, publisher, URL, topic and check date; no generated or unverified links. Keep the action checklist visible without opening external resources. Initial language is English with simple wording and translation-ready labels; do not claim multilingual support yet.

## Demo path
Open app → load labelled sample → inspect input → analyse → inspect source-linked requirements → inspect one next action and truthful CV improvement. Explain that planned project work belongs on the CV only after completion. Explain where Codex helped with planning, implementation and review using actual work history. Use sample mode as the fallback if the AI provider is unavailable.

## References
- Session 01 IntelliTrex: pages 6–11 (reference repo, inspection and review).
- Session 02 Prompts That Ship: pages 3, 13, 16 and 19–21 (prompt format, planning, specifications, honest checks and AGENTS.md).
- Session 03 Give Codex Tools: pages 3–4 and 10 (browser checks and repeatable skills).
- Session 04 Alerts and Moonshot: pages 6, 8–11 (brief/spec, first slice, README and demo).
- Codex Hackathon Program onboarding: pages 9–10 (evaluation and learning-to-opportunity track). The supplied deck lists 14 October as the submission deadline; confirm any programme updates before relying on it.

## Final submission gate
After implementation and verification, prepare a roughly five-minute video (MP4, MOV or WebM, at most 500 MB) and the GitHub repository URL. Cover the learner problem, working sample, learning-to-opportunity connection, limitations and actual Codex contributions. The submission locks the project for review, so submit only after final review. No final submission is authorized by this specification.
