# OpportunityGap validation notes

Validated locally on **12 October 2026** on `feature/opportunitygap-poc`.
Base commit: `e24088c` (Guided Demo positioning). Validation covered the
reviewed visual polish and deadline documentation/capture helper before publication. No analysis logic,
API behaviour, contracts or synthetic result generation changed in this completion pass.

## Required checks

| Check                                                                        | Result | Evidence                                                                                                                                                                    |
| ---------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                                                                   | PASS   | Both test files passed with zero failures. Source contains 13 named product/provider/route cases (6 + 7); this runtime reports two file entries, not 13 individual entries. |
| `npm run lint`                                                               | PASS   | ESLint exited 0 with warnings treated as failures. Re-run after adding the capture helper.                                                                                  |
| `npm run typecheck`                                                          | PASS   | Standalone TypeScript check exited 0.                                                                                                                                       |
| `npm run build`                                                              | PASS   | Production build and framework type checks exited 0; `/` prerendered and `/api/analyse` remains a server route.                                                             |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` | PASS   | Four tests passed in 7.5 seconds against the production server.                                                                                                             |
| `git diff --check`                                                           | PASS   | No whitespace errors.                                                                                                                                                       |
| `node --check scripts/capture-capstone.mjs`                                  | PASS   | Optional media-helper syntax check.                                                                                                                                         |

Environment: Node 24.19.0, npm 11.9.0, Next.js 16.4.0, React 19.3.0,
TypeScript 5.9.3, Playwright 1.63.0, system Chromium. Existing locked dependencies
were used; no package or lockfile changes were made.

## Acceptance evidence

- Both 1280px desktop and 390px mobile complete the Guided Demo, inspect results
  and download a UTF-8 action plan. There is no horizontal overflow at 390px.
- Empty inputs show errors and focus the first invalid field. Keyboard activation
  and result-heading focus pass. Editing the sample clears results; attempting to
  analyse edited text in Guided Demo fails honestly.
- All seven synthetic requirements are present. Self-reported support uses exact
  excerpts; R3 is an explicit testing gap. Degree completion, professional experience
  and availability remain clarification states. Projects cannot replace credentials.
- The action links R3 with existing R1/R2 skills, has a deliverable and completion
  checklist, and lists GitHub evidence to capture. Existing CV rewrites remain
  grounded; future wording is labelled use only after completion.
- AI consent, unavailable-provider failure, invalid response rejection and mocked
  valid output pass. Failure retains inputs and never renders demo output silently.
  Mocked success is not verification of live model access.
- Axe reported **zero violations** on desktop/mobile landing and result screens
  during the additional artifact capture. Existing browser result-screen checks
  also passed. Local and session storage were both empty.
- The actual Guided Demo capture made **zero external HTTP requests**. Local HTTP
  readiness returned 200; screenshots show branding, synthetic disclosure and
  the expected evidence/action plan. Capture annotations were removed before
  application accessibility measurements.

## Submission media

`node scripts/capture-capstone.mjs` completed successfully against the production
server. Outputs are in `/workspace/opportunitygap-submission`:

- `opportunitygap-capstone.mp4`: **300.000 seconds (5:00)**, H.264,
  **1280 × 960**, 10 fps, **4,706,361 bytes (4.71 MB)**. Fifteen captioned
  production-app screen captures at 20 seconds each, with mobile and closing
  summary frames. There is **no audio track**; it is a screen-capture walkthrough,
  not a continuous screen recording. It is below the recorded 500 MB limit.
- `opportunitygap-action-plan.txt`: actual synthetic plan downloaded through the UI.
- `screenshots/`: real desktop/mobile application captures and captioned scenes.
- `capture-validation.json`: observations for HTTP readiness, accessibility,
  storage, overflow and external requests. `frames.txt` records the video sequence.

Frame inspection checked synthetic mode disclosure, truthful/future CV wording,
mobile layout and caption readability. FFprobe verified format, duration, resolution
and byte size. A full decode check verifies the exported media is readable. Review
before uploading; use DEMO_SCRIPT.md if adding personal narration.

## Unverified or outside scope

- Live OpenAI access, credits, model quality and provider retention are not verified.
  No credentials were provisioned and no external AI call was required for the demo.
- Automated axe/Chromium checks do not establish universal accessibility. Screen
  readers, Safari/Firefox and real-student usability have not been tested here.
- No hosted deployment, website offline loading, hiring outcome or representative
  research claim is made. The four-response survey is preliminary.
- The current programme portal/form requirements have not been inspected. The
  user's stated deadline is used; the older planning document's date is historical.
- Validation and preparation did not submit the capstone form. The reviewed video
  and synthetic plan are included under `capstone/`; final GitHub publication status
  is recorded in SUBMISSION.md. Uploading to the programme portal remains separate.
