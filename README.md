# OpportunityGap

Turn role requirements into an evidence-linked next step. OpportunityGap is a student-focused proof of concept for MIVA learners preparing for internships: compare role requirements with CV/project evidence, separate explicit skill gaps from missing information, and choose one practical action with truthful CV wording.

**Start with Guided Demo.** It uses a clearly labelled synthetic student profile and deterministic results to demonstrate the full evidence-to-action workflow without an API key. Live AI Analysis is implemented, but live provider access and model quality are unverified. The capstone uses Guided Demo.

## Run locally

Use Node.js 24 (tested with 24.19.0) and npm (tested with 11.9.0). Next.js requires Node >=20.9.0. The app uses Next.js 16.4.0, React 19.3.0, TypeScript, plain CSS and system fonts. No database or account setup is needed.

The complete app and capstone materials are on [main](https://github.com/DamilolaOlarewaju/opportunitygap).

```sh
git clone --branch main https://github.com/DamilolaOlarewaju/opportunitygap.git
cd opportunitygap
npm ci --no-fund --no-audit
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Open [http://localhost:3000](http://localhost:3000). For development, use `npm run dev -- --hostname 0.0.0.0 --port 3000` instead. Stop the development server before building. The project `.npmrc` puts npm's cache in the parent directory; if it is not writable, use `npm --cache /tmp/opportunitygap-npm ci --no-fund --no-audit`.

## Try the guided workflow

1. Keep **Guided Demo** selected and click **Load sample inputs**.
2. Inspect the synthetic CV, frontend internship and optional project evidence.
3. Click **Analyse demo sample**. Seven requirements are compared with exact excerpts.
4. Inspect **Supported · self-reported**, **Explicit gap** and **Needs clarification**. Testing is an explicit gap; degree completion, professional experience and availability need clarification.
5. Review **Build a tested task planner**, its deliverable, completion checklist and GitHub evidence checklist. This project addresses skills, not degree eligibility.
6. Review the grounded CV suggestions and future template marked **use only after completion**. Download the plain-text action plan.

Guided Demo only accepts the supplied sample. If you edit it, the app asks you to reload the sample or explicitly choose live analysis; it never silently substitutes a sample assessment. Empty inputs show field-specific errors.

## Checks

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Browser checks exercise the production build at 1280px and 390px, keyboard submission/focus, downloads, accessibility, storage and AI failure/response handling. After building, with port 3000 free:

```sh
npx playwright install chromium
CI=1 npm run test:browser
```

If Chromium is already installed, use its executable instead of downloading:

```sh
CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

Playwright starts and stops the production server. Without `CI=1`, it can reuse a running server; make sure that server is production, rather than development. The system-Chromium command was verified in this workspace. See [VALIDATION.md](VALIDATION.md) for fresh results and limits.

## Privacy, evidence and limitations

- Guided Demo runs in the browser using synthetic text. No external AI request is needed. The app does not automatically persist inputs or include CV/project text in application logs. Reloading clears the form.
- Live AI Analysis sends supplied CV, role and optional project text to OpenAI through the server, after explicit consent. It requires server-only `OPENAI_API_KEY` and `OPENAI_MODEL`, credits, model access and permitted outbound network access. `.env.example` lists variable names. Never put credentials in `NEXT_PUBLIC_` variables, screenshots or Git.
- Requests use `store: false`; this is not a promise of zero provider retention. Live retention behaviour is unverified. Use synthetic/de-identified inputs and remove unnecessary personal details. Downloaded plans may contain evidence; keep them private. Hosting/provider infrastructure has its own policies.
- Missing evidence is unknown, not proof of a missing skill. Self-reported support is not certified proficiency. Projects do not replace credentials, professional experience or eligibility requirements.
- Exact-excerpt and conservative rewrite checks reduce unsupported output; they do not prove semantic truth or exhaustive extraction. AI interpretations need review. English is the initial language.
- No hiring scores, outcome guarantees, GitHub fetching, PDF upload, accounts, analytics, automatic applications or verified live AI capability are claimed. The website is not an offline app; the downloaded text file can be read offline.

## Architecture and research

`src/components` contains form/results presentation. `sample.ts` and `demo-analysis.ts` implement the deterministic sample. `analysis-contract.ts` validates inputs, excerpts, assessments and truthful rewrites. `action-plan.ts` formats the download. `/api/analyse` validates bounded requests and calls a server-only OpenAI Responses adapter with output validation, timeouts and honest errors. Failed live analysis retains inputs and never becomes a demo result.

The preliminary research had four survey responses: three respondents reported avoiding an application because they were unsure whether their skills or projects were enough. This is self-reported preliminary evidence, not representative research or proof of demand. See [PRODUCT_BRIEF.md](PRODUCT_BRIEF.md).

## Built with Codex

Codex helped inspect the repository, implement and validate the sample workflow and provider adapter, improve Guided Demo positioning, polish CSS/layout, run browser checks, and prepare documentation and a captioned walkthrough. The owner supplied the learner problem, research context, constraints and review decisions. No measured time savings or hiring benefits are claimed.

IntelliTrex was a workshop setup reference, not an application dependency. The recorded inspection in [CAPSTONE_SPEC.md](CAPSTONE_SPEC.md) covers its README, package scripts and agent instructions. No reference implementation is copied in this completion pass; its licence and a specific inspected commit are not verified here, so no broader reuse claim is made.

## Capstone materials

- [Captioned five-minute MP4](capstone/opportunitygap-capstone.mp4): the reviewed silent walkthrough.
- [Synthetic action plan](capstone/opportunitygap-action-plan.txt): the actual downloaded demonstration plan.
- [DEMO_SCRIPT.md](DEMO_SCRIPT.md): timed narration, recording steps and recovery.
- [SUBMISSION.md](SUBMISSION.md): copy-ready summary, branch URL and final checklist.
- [VALIDATION.md](VALIDATION.md): checks, acceptance evidence and limitations.
- [REFLECTION.md](REFLECTION.md): decisions and lessons.

To regenerate the captioned screen-capture video, start the production app and run `node scripts/capture-capstone.mjs`. This optional helper needs FFmpeg and Chromium (or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). It writes screenshots, a synthetic action plan and a five-minute silent MP4 to `../opportunitygap-submission`. It changes no application data or source. Review the video before uploading; use the demo script if recording your own voice. No final submission is automatic.
