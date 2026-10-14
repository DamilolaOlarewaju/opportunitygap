# OpportunityGap submission packet

Prepared for the owner's stated deadline, 12 October 2026. The older planning spec mentions 14 October; the latest user instruction takes precedence. The programme portal and current form fields have not been inspected.

## Copy-ready project summary

**Name:** OpportunityGap

**Track:** Guidance, Pathways & Opportunity

**Summary:** OpportunityGap helps students preparing for internships connect role requirements to their CV and project evidence. Its Guided Demo follows a synthetic student through an evidence-linked requirement comparison, a concrete project checklist, truthful CV suggestions and a downloadable action plan. It distinguishes self-reported support, explicit skill gaps and information needing clarification. A learning project never replaces credentials or eligibility requirements.

**Research:** A preliminary four-response survey suggested uncertainty about skills and project evidence can discourage applications. This is small, self-reported research, not representative demand validation.

**AI status:** A server-side OpenAI adapter and response validation are implemented. Live provider access and model quality are unverified; the video uses the deterministic Guided Demo. Failed live analysis never silently falls back to synthetic results.

**Codex contribution:** Repository inspection, implementation and review, evidence checks, visual polish, test execution, documentation and captioned demo preparation. The owner supplied the problem, research and constraints. No measured time savings or hiring outcomes are claimed.

**Repository:** https://github.com/DamilolaOlarewaju/opportunitygap

**Application branch:** https://github.com/DamilolaOlarewaju/opportunitygap/tree/main

The complete application and submission materials were merged into main with the project owner’s authorization on 14 October 2026. The final polish and materials were first published on 12 October 2026. The application-and-materials commit is [9692e0b](https://github.com/DamilolaOlarewaju/opportunitygap/commit/9692e0b). The MP4 and synthetic downloaded plan are published under `capstone/`.

## Prepared artifacts

The reviewed MP4, synthetic action plan and capture observations are also included in the repository under `capstone/`. The remaining capture artifacts and ZIP bundle are local backups.

The capture helper writes these outside the repository, to `/workspace/opportunitygap-submission` in this workspace:

- `opportunitygap-capstone.mp4`: five-minute silent, captioned walkthrough of production-app screen captures. Use DEMO_SCRIPT.md to add your own narration if desired.
- `opportunitygap-action-plan.txt`: downloaded synthetic demonstration plan.
- `screenshots/`: desktop, mobile and walkthrough scenes.
- `capture-validation.json`: HTTP readiness, accessibility and storage observations.

The helper is `scripts/capture-capstone.mjs`. It runs against the local production app using Chromium/FFmpeg. It does not configure a provider or upload anything. Final media measurements are recorded in [VALIDATION.md](VALIDATION.md).

## Final review and upload checklist

- Review the video for readable text, synthetic disclosure and truthful capability claims. It has captions and no audio track.
- Confirm the latest form accepts the format; the planning spec calls for MP4/MOV/WebM, roughly five minutes, at most 500 MB.
- Open the published application branch and confirm README, source, validation notes and the `capstone/` video are visible.
- Upload the reviewed video and paste the repository URL. Include the branch URL wherever supported so reviewers can find the working app.
- Review the completed form before submitting. The spec says submission locks the project for review. No form has been submitted and no video has been uploaded to the programme portal.

No hosted deployment URL is provided or claimed. The app runs locally using documented commands. Any hosting requirement on the current form must be addressed separately.
