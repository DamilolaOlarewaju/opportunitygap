# OpportunityGap: five-minute capstone walkthrough

Use the production app, Guided Demo, and only the synthetic sample. The prepared MP4 is a captioned screen-capture walkthrough with no audio. This script is also suitable for recording your own narration. No live AI success is demonstrated.

## Before recording

Run the README checks, build, and start the production server on port 3000. Use a 1280px browser with normal zoom; close unrelated tabs and notifications. Keep the sample unchanged. Have the downloaded plan and validation notes ready.

## 0:00–0:40 — The student problem

“OpportunityGap helps students turn an internship's requirements into an inspectable next step. Students can struggle to connect their CV and projects with what a role asks for. In our preliminary four-response survey, three people reported avoiding an application because they were unsure whether their skills or projects were enough. That small, self-reported sample is not proof of demand. The goal is clarity: what is supported, what needs a question, and what to build next.”

Show the landing page and recommended Guided Demo control. Explain the synthetic disclosure and the separate provider requirement for live analysis.

## 0:40–1:20 — Inputs and evidence

Click **Load sample inputs**.

“This is a synthetic student, Alex, and a synthetic frontend internship. The CV describes a study planner built with HTML, CSS and JavaScript, Git and collaboration. It explicitly says, ‘I have not written automated tests yet.’ The role also asks for a completed degree, professional experience and twenty-hour availability. Those are distinct from skills. Optional project evidence records what the student actually contributed. Inputs are not automatically saved.”

## 1:20–2:20 — Requirement comparison

Click **Analyse demo sample**. Inspect R1, R3 and R5–R7.

“Each card keeps the role requirement and student evidence visible. Interface work and Git have self-reported support; that does not certify proficiency. Testing is an explicit gap because the student says they have not done it. Professional experience and availability are not stated, so they need clarification. Studying toward a degree does not establish a completed degree. Missing evidence is a question, not proof that the student lacks a skill. We do not assign a hiring score.”

## 2:20–3:20 — Learning to opportunity

Show **Build a tested task planner**, the deliverable and both checklists.

“The next action is a small tested task planner. It addresses testing, R3, and builds on existing interface and Git work, R1 and R2. Completion means building the task behaviours, testing them and recording the actual results. The GitHub checklist asks for the problem, approach, screenshots or tests and personal contribution. That makes learning produce evidence a student can later discuss. OpportunityGap has not inspected a repository. This project does not replace degree or experience requirements.”

## 3:20–4:00 — Truthful CV wording and a portable plan

Show the conditional future template and existing-experience suggestions. Click **Download action plan (.txt)** and open the saved file.

“These rewrites refer to supplied experience and retain supporting excerpts. The proposed project belongs in the separate future template, clearly marked ‘use only after completion.’ There are no invented metrics or achievements. The text download keeps requirements, evidence, checklists, questions and CV wording together. It can be read offline once saved; that does not make the website offline.”

## 4:00–4:20 — Mobile and accessibility

Show the 390px layout and stacked checklists.

“The same guided flow works at desktop and mobile width. Browser checks exercise keyboard submission and focus, downloads and no horizontal overflow. Automated accessibility checks are useful evidence, not a substitute for testing with students and assistive technology.”

## 4:20–5:00 — Limits, Codex and next evaluation

“Guided Demo is deterministic and synthetic. The live AI adapter is implemented, with bounded requests, server-only configuration and validated responses, but live model access and quality remain unverified. Failed live analysis never silently becomes a demo. Codex helped implement, review, test and polish the workflow and prepare these materials. No measured hiring outcomes or time savings are claimed. Next I would test whether students understand clarification states and can complete the checklist, then evaluate live AI using synthetic cases.”

Show the repository branch URL and validation results at the close.

## Recovery during a recording

- If the sample was edited, click **Load sample inputs** again before analysing.
- If live analysis fails, show the error and retained inputs, then explicitly load Guided Demo. Say that the new result is synthetic.
- If the server is unavailable, restart using the README production commands. Saved video/screenshots and the text plan are backup artifacts; do not claim they demonstrate a currently running website.

Review the final video duration, readable text, synthetic disclosure, file format and size before uploading. The recorded specification accepts MP4, MOV or WebM, roughly five minutes and at most 500 MB. Follow the latest programme form if it differs. Upload and final submission are separate user actions.
