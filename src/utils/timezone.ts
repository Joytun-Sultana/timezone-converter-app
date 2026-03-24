export type ConvertResult =
  | { ok: true; value: string }
  | { ok: false; error: "INVALID_UTC_DATETIME" | "INVALID_TIMEZONE" };

export type ToUtcResult =
  | { ok: true; value: string }
  | {
      ok: false;
      error: "INVALID_LOCAL_DATETIME" | "INVALID_TIMEZONE";
    };

type LocalDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function isValidUtcDatetime(utcDatetime: string): boolean {
  const date = new Date(utcDatetime);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  // Enforce explicit UTC input for internal state consistency.
  return utcDatetime.endsWith("Z");
}

function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

function parseLocalDateTime(localDatetime: string): LocalDateTimeParts | null {
  const match = localDatetime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
  );
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { year, month, day, hour, minute };
}

function formatPartsInTimezone(date: Date, timeZone: string): LocalDateTimeParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(byType.year),
    month: Number(byType.month),
    day: Number(byType.day),
    hour: Number(byType.hour),
    minute: Number(byType.minute),
  };
}

function localPartsToUtcEpochMs(parts: LocalDateTimeParts): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0, 0);
}

function formatUtcInTimezone(utcDatetime: string, timeZone: string): string {
  const date = new Date(utcDatetime);
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

export function convert(utcDatetime: string, targetTimezone: string): ConvertResult {
  if (!isValidUtcDatetime(utcDatetime)) {
    return { ok: false, error: "INVALID_UTC_DATETIME" };
  }

  if (!isValidTimezone(targetTimezone)) {
    return { ok: false, error: "INVALID_TIMEZONE" };
  }

  return {
    ok: true,
    value: formatUtcInTimezone(utcDatetime, targetTimezone),
  };
}

export function toUtcFromLocal(
  localDatetime: string,
  sourceTimezone: string,
): ToUtcResult {
  if (!isValidTimezone(sourceTimezone)) {
    return { ok: false, error: "INVALID_TIMEZONE" };
  }

  const desiredLocal = parseLocalDateTime(localDatetime);
  if (!desiredLocal) {
    return { ok: false, error: "INVALID_LOCAL_DATETIME" };
  }

  let guessUtcMs = localPartsToUtcEpochMs(desiredLocal);
  const desiredEpochLike = localPartsToUtcEpochMs(desiredLocal);

  // Iteratively reconcile desired local wall-clock time in source timezone.
  for (let index = 0; index < 5; index += 1) {
    const actualLocal = formatPartsInTimezone(new Date(guessUtcMs), sourceTimezone);
    const actualEpochLike = localPartsToUtcEpochMs(actualLocal);
    const differenceMs = desiredEpochLike - actualEpochLike;

    if (differenceMs === 0) {
      return { ok: true, value: new Date(guessUtcMs).toISOString() };
    }

    guessUtcMs += differenceMs;
  }

  return { ok: false, error: "INVALID_LOCAL_DATETIME" };
}
