import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
for (const width of [1280, 390]) {
  test(`complete accessible demo and download at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Analyse demo sample" }).click();
    await expect(
      page.getByText("CV must contain at least 30 characters."),
    ).toBeVisible();
    await expect(page.getByLabel("CV text", { exact: true })).toBeFocused();
    await page.getByRole("button", { name: "Load sample inputs" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("CV text", { exact: true })).toContainText(
      "Synthetic student",
    );
    await page.getByRole("button", { name: "Analyse demo sample" }).focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Your evidence & action plan" }),
    ).toBeFocused();
    await expect(page.getByText("Explicit gap", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Build a tested task planner" }),
    ).toBeVisible();
    await expect(
      page.getByText("Future CV template — use only after completion"),
    ).toBeVisible();
    const downloadEvent = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download action plan (.txt)" })
      .click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe("opportunitygap-action-plan.txt");
    const contents = await readFile((await download.path())!, "utf8");
    expect(contents).toContain("R3");
    expect(contents).toContain("TRUTHFUL CV WORDING");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(() => ({
        local: localStorage.length,
        session: sessionStorage.length,
      })),
    ).toEqual({ local: 0, session: 0 });
    await page
      .getByLabel("CV text", { exact: true })
      .fill("This is an edited synthetic CV with other experience.");
    await expect(
      page.getByRole("heading", { name: "Your evidence & action plan" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Analyse demo sample" }).click();
    await expect(
      page.getByRole("alert", { name: "Analysis error" }),
    ).toContainText("only the labelled sample");
  });
}
test("AI failure preserves input and never shows demo results", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load sample inputs" }).click();
  await page.getByLabel("Live AI Analysis").check();
  await page.getByRole("button", { name: "Analyse supplied text" }).click();
  await expect(
    page.getByRole("alert", { name: "Analysis error" }),
  ).toContainText("Confirm you agree");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Analyse supplied text" }).click();
  await expect(
    page.getByRole("alert", { name: "Analysis error" }),
  ).toBeVisible();
  await expect(page.getByLabel("CV text", { exact: true })).toContainText(
    "Synthetic student",
  );
  await expect(
    page.getByRole("heading", { name: "Your evidence & action plan" }),
  ).toHaveCount(0);
});

test("AI response contract errors retain edited input; valid evidence renders in AI mode", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load sample inputs" }).click();
  await page.getByLabel("Live AI Analysis").check();
  await page.getByRole("checkbox").check();
  await page.route("**/api/analyse", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ requirements: [] }),
    }),
  );
  await page.getByRole("button", { name: "Analyse supplied text" }).click();
  await expect(
    page.getByRole("alert", { name: "Analysis error" }),
  ).toContainText("invalid evidence");
  await expect(page.getByLabel("CV text", { exact: true })).toContainText(
    "Synthetic student",
  );
  await expect(
    page.getByRole("heading", { name: "Your evidence & action plan" }),
  ).toHaveCount(0);
  const { sampleResult } = await import("../../src/lib/sample");
  await page.unroute("**/api/analyse");
  await page.route("**/api/analyse", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(sampleResult),
    }),
  );
  await page.getByRole("button", { name: "Analyse supplied text" }).click();
  await expect(
    page.getByRole("heading", { name: "Your evidence & action plan" }),
  ).toBeVisible();
  await expect(page.getByText(/AI RESULTS/)).toBeVisible();
  await expect(page.getByText(/GUIDED DEMO · Synthetic example/)).toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel("CV text", { exact: true })).toHaveValue("");
});
