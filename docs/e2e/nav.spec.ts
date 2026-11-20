import { expect, test } from "@playwright/test";

import { nav } from "../lib/nav";

const hrefs = nav.flatMap((group) => group.items.map((item) => item.href));

// One test visits every sidebar link. Each page gets a fresh browser page so
// that Next's link prefetching from the previous page cannot leak into the
// results. For each href it asserts:
//   - the HTTP status is 200,
//   - there is exactly one <h1>,
//   - the browser logged no console errors and no uncaught page errors.
test("every sidebar link returns 200, renders one h1, and logs no errors", async ({ browser }) => {
  const context = await browser.newContext();
  const failures: string[] = [];

  try {
    for (const href of hrefs) {
      const page = await context.newPage();
      const problems: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") problems.push(`console error: ${msg.text()}`);
      });
      page.on("pageerror", (err) => problems.push(`uncaught error: ${err.message}`));

      const response = await page.goto(href, { waitUntil: "load" });
      const status = response?.status() ?? 0;
      if (status !== 200) problems.push(`status ${status}, expected 200`);

      // Give hydration and client effects a moment to surface runtime errors.
      await page.waitForLoadState("networkidle");

      const h1Count = await page.locator("h1").count();
      if (h1Count !== 1) problems.push(`found ${h1Count} <h1> elements, expected 1`);

      for (const problem of problems) failures.push(`${href}: ${problem}`);
      await page.close();
    }
  } finally {
    await context.close();
  }

  expect(failures, failures.join("\n")).toEqual([]);
});
