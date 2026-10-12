// Optional submission-media helper. Requires a running local production app,
// Chromium and FFmpeg. Screenshots/captions are artifacts, not app changes.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { spawn } from "node:child_process";

const output = fileURLToPath(
  new URL("../../opportunitygap-submission/", import.meta.url),
);
const shots = join(output, "screenshots");
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 960 },
});
const page = await context.newPage();
const evidence = {
  date: "2026-10-12",
  scenes: [],
  accessibility: {},
  demoExternalRequests: [],
};
page.on("request", (request) => {
  if (
    !request.url().startsWith("http://127.0.0.1:3000") &&
    /^https?:/.test(request.url())
  )
    evidence.demoExternalRequests.push(request.url());
});

async function focus(targetPage, locator) {
  await targetPage.evaluate(() =>
    document.getElementById("capture-caption")?.remove(),
  );
  await locator.evaluate((element) =>
    window.scrollTo(
      0,
      Math.max(0, element.getBoundingClientRect().top + scrollY - 24),
    ),
  );
}
async function scene(targetPage, title, caption) {
  const number = evidence.scenes.length + 1;
  await targetPage.evaluate(
    ({ title, caption, number }) => {
      document.getElementById("capture-caption")?.remove();
      const panel = document.createElement("aside");
      panel.id = "capture-caption";
      panel.style.cssText =
        "position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#18352e;color:white;padding:20px 36px;height:150px;box-sizing:border-box;font-family:system-ui,sans-serif;line-height:1.5;border-top:4px solid #b7cfbc";
      const heading = document.createElement("div");
      heading.style.cssText =
        "font-weight:750;font-size:25px;margin-bottom:8px";
      heading.textContent = `${String(number).padStart(2, "0")} / ${title}`;
      const text = document.createElement("div");
      text.style.cssText = "font-size:19px;max-width:1150px";
      text.textContent = caption;
      panel.append(heading, text);
      document.body.append(panel);
    },
    { title, caption, number },
  );
  const name = `scene-${String(number).padStart(2, "0")}.png`;
  await targetPage.screenshot({ path: join(shots, name) });
  evidence.scenes.push({ name, title, caption, durationSeconds: 20 });
  console.log(`Captured ${number}: ${title}`);
}

try {
  const response = await page.goto("http://127.0.0.1:3000");
  assert.equal(response.status(), 200);
  evidence.httpStatus = response.status();
  assert.equal(
    await page
      .getByRole("radio", { name: "Guided Demo", exact: true })
      .isChecked(),
    true,
  );
  evidence.accessibility.desktopLanding = (
    await new AxeBuilder({ page }).analyze()
  ).violations;
  await page.screenshot({
    path: join(shots, "desktop-landing.png"),
    fullPage: true,
  });
  await scene(
    page,
    "From learning to opportunity",
    "OpportunityGap helps students connect internship requirements to evidence from their CV and projects, then choose a practical next step. No hiring score is provided.",
  );
  await focus(page, page.locator(".mode-options"));
  await scene(
    page,
    "Guided Demo is the recommended start",
    "This workflow uses a synthetic student profile and deterministic results. Our four-response survey is preliminary evidence, not representative research or proof of demand.",
  );
  await page.getByRole("button", { name: "Load sample inputs" }).click();
  await focus(page, page.locator(".input-grid"));
  await scene(
    page,
    "Inspect the synthetic CV and role",
    "Alex describes HTML, CSS, JavaScript, Git and collaboration, but explicitly says they have not written automated tests. The role also includes degree and experience requirements.",
  );
  await focus(page, page.locator(".field.wide"));
  await scene(
    page,
    "Keep personal contribution visible",
    "Optional evidence describes what the student actually built. Inputs are not automatically saved. Guided Demo accepts this sample only; edited text cannot silently receive a sample assessment.",
  );
  await page.evaluate(() =>
    document.getElementById("capture-caption")?.remove(),
  );
  await page.getByRole("button", { name: "Analyse demo sample" }).click();
  await page
    .getByRole("heading", { name: "Your evidence & action plan" })
    .waitFor();
  evidence.accessibility.desktopResults = (
    await new AxeBuilder({ page }).analyze()
  ).violations;
  await page
    .locator(".results")
    .screenshot({ path: join(shots, "desktop-results.png") });
  await focus(page, page.locator(".results"));
  await scene(
    page,
    "Evidence you can inspect",
    "Every requirement has an exact role excerpt. Supported assessments cite the student's supplied evidence. Support is self-reported, not independently verified proficiency.",
  );
  await focus(page, page.locator(".requirements .requirement").nth(2));
  await scene(
    page,
    "Explicit gaps need explicit evidence",
    "Testing is an explicit gap because the CV says: I have not written automated tests yet. Missing information alone would be classified as needing clarification.",
  );
  await focus(page, page.locator(".requirements .requirement").nth(4));
  await scene(
    page,
    "Eligibility stays separate from skills",
    "A degree in progress is not a completed degree. Professional experience and twenty-hour availability are unstated. A practice project cannot replace these requirements.",
  );
  await focus(page, page.locator(".project-card"));
  await scene(
    page,
    "One practical next action",
    "Build a tested task planner: practise testing, R3, using existing interface and Git experience, R1 and R2. The deliverable is a small repository with tests for real task behaviours.",
  );
  await focus(page, page.locator(".action-checklists"));
  await scene(
    page,
    "A concrete definition of completion",
    "Build the task form, subject filter and completion control. Test the three behaviours and an empty task error. Run the tests and record actual results in the README.",
  );
  await scene(
    page,
    "Turn learning into portfolio evidence",
    "Capture the problem, approach, screenshots or test results, and your personal contribution. OpportunityGap provides a checklist; it has not fetched or inspected a GitHub repository.",
  );
  await focus(page, page.locator(".future"));
  await scene(
    page,
    "Truthful CV wording",
    "Current rewrites cite existing experience. Proposed project wording is separate and marked use only after completion. Do not invent achievements, tools, credentials or metrics.",
  );
  await page.evaluate(() =>
    document.getElementById("capture-caption")?.remove(),
  );
  const downloaded = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download action plan (.txt)" })
    .click();
  const download = await downloaded;
  await download.saveAs(join(output, "opportunitygap-action-plan.txt"));
  const text = await readFile(
    join(output, "opportunitygap-action-plan.txt"),
    "utf8",
  );
  assert.ok(
    text.includes("synthetic example") &&
      text.includes("USE ONLY AFTER COMPLETION"),
  );
  const reader = await context.newPage();
  await reader.setContent(
    '<main style="max-width:1140px;margin:32px auto;font-family:system-ui;color:#18352e"><h1>Downloaded action plan · Synthetic example</h1><pre style="white-space:pre-wrap;font:18px/1.5 system-ui"></pre></main>',
  );
  await reader.locator("pre").evaluate((element, value) => {
    element.textContent = value;
  }, text);
  await scene(
    reader,
    "A plan you can keep",
    "The real downloaded text file includes comparisons, evidence, checklists, CV wording and clarifications. It can be read offline once saved; the website is not an offline app.",
  );

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 900 },
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://127.0.0.1:3000");
  evidence.accessibility.mobileLanding = (
    await new AxeBuilder({ page: mobile }).analyze()
  ).violations;
  await mobile.screenshot({
    path: join(shots, "mobile-landing.png"),
    fullPage: true,
  });
  await mobile.getByRole("button", { name: "Load sample inputs" }).click();
  await mobile.getByRole("button", { name: "Analyse demo sample" }).click();
  await mobile
    .getByRole("heading", { name: "Your evidence & action plan" })
    .waitFor();
  evidence.accessibility.mobileResults = (
    await new AxeBuilder({ page: mobile }).analyze()
  ).violations;
  evidence.mobileNoOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth,
  );
  await mobile
    .locator(".results")
    .screenshot({ path: join(shots, "mobile-results.png") });
  await focus(mobile, mobile.locator(".project-card"));
  const mobileImage = await mobile.screenshot();
  await reader.setContent(
    '<main style="display:flex;gap:70px;padding:24px 80px;font:24px/1.6 system-ui;color:#18352e"><img width="330" alt="Actual app at 390px mobile width"><section style="max-width:600px"><h1>390px mobile layout</h1><p>The same synthetic demo, with stacked cards and checklists.</p><p>Keyboard focus, downloads and no horizontal overflow are covered by the existing browser checks.</p><p>Automated accessibility checks do not replace screen-reader or real-student testing.</p></section></main>',
  );
  await reader.locator("img").evaluate((image, data) => {
    image.src = `data:image/png;base64,${data}`;
  }, mobileImage.toString("base64"));
  await scene(
    reader,
    "Desktop and mobile",
    "The production browser checks pass at 1280px and 390px. The mobile view shown here is captured from the working app. Accessibility and student usability evaluation remain ongoing work.",
  );
  evidence.storage = await mobile.evaluate(() => ({
    localStorage: localStorage.length,
    sessionStorage: sessionStorage.length,
  }));
  assert.deepEqual(evidence.storage, { localStorage: 0, sessionStorage: 0 });
  assert.ok(evidence.mobileNoOverflow);
  for (const violations of Object.values(evidence.accessibility))
    assert.equal(violations.length, 0);
  assert.equal(evidence.demoExternalRequests.length, 0);
  await page.getByRole("button", { name: "Load sample inputs" }).click();
  await page
    .getByRole("radio", { name: "Live AI Analysis", exact: true })
    .check();
  await focus(page, page.locator(".mode-options"));
  await scene(
    page,
    "Live AI is implemented, not verified working access",
    "Live analysis requires provider configuration, credits and explicit consent. Model quality and retention are unverified. The capstone uses Guided Demo; failed AI never becomes a synthetic result silently.",
  );
  await reader.setContent(
    '<main style="padding:60px 80px;font:23px/1.6 system-ui;color:#18352e"><p>OpportunityGap · Capstone summary</p><h1>Evidence first. A practical next step.</h1><h2>Built with Codex</h2><p>Implementation, evidence checks, review, visual polish, validation and documentation.</p><h2>Validated locally</h2><p>Tests, lint, typecheck, production build and four browser checks pass.</p><h2>Next evaluation</h2><p>Test student understanding of clarification states and project checklists; then evaluate live AI on synthetic cases.</p><p style="font-size:17px">github.com/DamilolaOlarewaju/opportunitygap/tree/feature/opportunitygap-poc</p></main>',
  );
  await scene(
    reader,
    "A reviewable capstone",
    "The owner supplied the learner problem, research and constraints; Codex helped implement and validate the app. No hiring outcomes or time savings are claimed. Review the final branch and video before submission.",
  );
  assert.equal(evidence.scenes.length, 15);
  await writeFile(
    join(output, "capture-validation.json"),
    JSON.stringify(evidence, null, 2) + "\n",
  );
  const manifest = evidence.scenes.flatMap((entry) => [
    `file 'screenshots/${entry.name}'`,
    "duration 20",
  ]);
  manifest.push(`file 'screenshots/${evidence.scenes.at(-1).name}'`);
  await writeFile(join(output, "frames.txt"), manifest.join("\n") + "\n");
  await mobileContext.close();
} finally {
  await browser.close();
}
await new Promise((resolve, reject) => {
  const process = spawn(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      join(output, "frames.txt"),
      "-t",
      "300",
      "-vf",
      "fps=10,format=yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "22",
      "-movflags",
      "+faststart",
      join(output, "opportunitygap-capstone.mp4"),
    ],
    { stdio: "inherit" },
  );
  process.on("error", reject);
  process.on("exit", (code) =>
    code === 0 ? resolve() : reject(new Error(`FFmpeg exited ${code}`)),
  );
});
console.log(
  `Saved captioned five-minute video and validation artifacts to ${output}`,
);
