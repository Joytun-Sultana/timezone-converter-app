import { describe, expect, it } from "vitest";

import { countryToIanaMap } from "../../src/config/timezones";
import { convert } from "../../src/utils/timezone";

function formatUtcInTimezone(utcIso: string, timeZone: string): string {
  const date = new Date(utcIso);

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${byType.year}-${byType.month}-${byType.day} ${byType.hour}:${byType.minute}:${byType.second}`;
}

describe("timezone conversion utility", () => {
  it("converts UTC to Bangladesh time (Asia/Dhaka)", () => {
    const utc = "2025-01-15T12:00:00.000Z";
    const timezone = "Asia/Dhaka";

    const result = convert(utc, timezone);
    const expected = formatUtcInTimezone(utc, timezone);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(`Expected success, got ${result.error}`);
    expect(result.value).toBe(expected);
  });

  it("converts UTC to Norway time (Europe/Oslo)", () => {
    const utc = "2025-01-15T12:00:00.000Z";
    const timezone = "Europe/Oslo";

    const result = convert(utc, timezone);
    const expected = formatUtcInTimezone(utc, timezone);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(`Expected success, got ${result.error}`);
    expect(result.value).toBe(expected);
  });

  it("handles DST transition for Europe/Oslo (spring forward)", () => {
    // Europe/Oslo DST starts on 2025-03-30; offset changes from UTC+1 to UTC+2.
    const beforeDstUtc = "2025-03-30T00:30:00.000Z";
    const afterDstUtc = "2025-03-30T01:30:00.000Z";
    const timezone = "Europe/Oslo";

    const beforeResult = convert(beforeDstUtc, timezone);
    const afterResult = convert(afterDstUtc, timezone);

    expect(beforeResult.ok).toBe(true);
    expect(afterResult.ok).toBe(true);

    if (!beforeResult.ok) throw new Error(`Expected success, got ${beforeResult.error}`);
    if (!afterResult.ok) throw new Error(`Expected success, got ${afterResult.error}`);

    expect(beforeResult.value).toBe(formatUtcInTimezone(beforeDstUtc, timezone));
    expect(afterResult.value).toBe(formatUtcInTimezone(afterDstUtc, timezone));
    expect(beforeResult.value).not.toBe(afterResult.value);
  });

  it("returns typed failure for invalid timezone", () => {
    const result = convert("2025-01-15T12:00:00.000Z", "Mars/Olympus_Mons");

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected invalid timezone failure");
    expect(result.error).toBe("INVALID_TIMEZONE");
  });

  it("returns typed failure for invalid UTC datetime", () => {
    const result = convert("not-a-utc-datetime", "Europe/Oslo");

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected invalid UTC datetime failure");
    expect(result.error).toBe("INVALID_UTC_DATETIME");
  });

  it("converts a single UTC input to multiple target timezones", () => {
    const utc = "2025-07-01T12:00:00.000Z";
    const timezones = ["UTC", "Europe/Oslo", "Asia/Dhaka", "America/New_York"] as const;

    for (const timezone of timezones) {
      const result = convert(utc, timezone);
      const expected = formatUtcInTimezone(utc, timezone);

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(`Expected success for ${timezone}, got ${result.error}`);
      expect(result.value).toBe(expected);
    }
  });
});

describe("typed country to IANA mapping", () => {
  it("contains Bangladesh and Norway timezone entries", () => {
    expect(countryToIanaMap.BD).toContain("Asia/Dhaka");
    expect(countryToIanaMap.NO).toContain("Europe/Oslo");
  });
});
