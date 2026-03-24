import { expect, test } from "@playwright/test";

test.describe("timezone conversion flow", () => {
  test("converts Norway local datetime to Bangladesh output", async ({ page }) => {
    await page.goto("/");

    // Norway -> Europe/Oslo, Bangladesh -> Asia/Dhaka.
    await page.getByTestId("source-timezone").selectOption("Europe/Oslo");
    await page.getByTestId("local-datetime").fill("2025-01-15T12:00");
    await page.getByTestId("target-timezone").selectOption("Asia/Dhaka");

    await expect(page.getByTestId("stored-utc")).toContainText("2025-01-15T11:00:00.000Z");
    await expect(page.getByTestId("converted-output")).toContainText("2025-01-15 17:00:00");
  });

  test("handles DST conversion from Norway to Bangladesh", async ({ page }) => {
    await page.goto("/");

    // 2025-03-30 is DST start day in Oslo; 03:30 local is valid CEST (UTC+2).
    await page.getByTestId("source-timezone").selectOption("Europe/Oslo");
    await page.getByTestId("local-datetime").fill("2025-03-30T03:30");
    await page.getByTestId("target-timezone").selectOption("Asia/Dhaka");

    await expect(page.getByTestId("stored-utc")).toContainText("2025-03-30T01:30:00.000Z");
    await expect(page.getByTestId("converted-output")).toContainText("2025-03-30 07:30:00");
  });
});
