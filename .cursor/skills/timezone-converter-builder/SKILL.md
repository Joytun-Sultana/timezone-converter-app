---
name: timezone-converter-builder
description: Build and review Vue 3 + TypeScript + Vite timezone conversion features with UTC as the source of truth, typed country-to-IANA mappings, reusable conversion utilities, and robust tests. Use when implementing datetime/timezone logic, handling DST, validating timezone inputs, or structuring timezone code outside UI components.
---

# Timezone Converter Builder

## Scope

Use this skill when implementing or reviewing timezone conversion logic in a Vue 3 + TypeScript + Vite codebase.

## Non-Negotiable Rules

1. Treat UTC as the single source of truth.
2. Convert picked local datetime to UTC immediately at the boundary (form handlers, adapters, or composables that receive user input).
3. Keep timezone logic outside UI components.
4. Prefer `Intl` APIs over manual offset arithmetic.
5. Reject invalid UTC datetime strings and invalid timezone identifiers.
6. Require unit tests for multi-timezone behavior, DST transitions, and invalid inputs.
7. Keep ESLint, Prettier, Playwright, and Vitest (or Jest) green.

## Suggested File Layout

- `src/config/timezones.ts`
- `src/utils/timezone.ts`
- `tests/unit/timezone.spec.ts`

## Implementation Workflow

Copy this checklist and keep it updated:

```md
Timezone task progress:
- [ ] Define typed country -> IANA timezone map
- [ ] Implement reusable convert(utcDatetime, targetTimezone)
- [ ] Add strict validation for UTC datetime and timezone values
- [ ] Keep conversion logic out of UI components
- [ ] Add/expand unit tests (multi-timezone, DST, invalid cases)
- [ ] Run lint/format/tests and ensure all pass
```

### 1) Configure typed timezone data

In `src/config/timezones.ts`:

- Export a typed map of country code (or agreed key) to IANA timezone(s).
- Use strict typing (`as const`, explicit union types, or typed records).
- Keep naming consistent (`countryToIanaMap`, `CountryCode`, `IanaTimezone`).
- If a country can have multiple timezones, model it explicitly (`readonly string[]`), do not flatten implicitly.

### 2) Implement reusable conversion utility

In `src/utils/timezone.ts`:

- Implement `convert(utcDatetime, targetTimezone)` as a reusable pure function.
- Expect UTC input (ISO-like UTC string or equivalent agreed format).
- Validate UTC input before conversion.
- Validate `targetTimezone` using `Intl.DateTimeFormat` construction in `try/catch`.
- Use `Intl.DateTimeFormat` with `timeZone` for representation in target zone.
- Avoid manual `getTimezoneOffset` math for conversion logic.

Recommended function shape:

```ts
type ConvertResult =
  | { ok: true; value: string }
  | { ok: false; error: "INVALID_UTC_DATETIME" | "INVALID_TIMEZONE" };

export function convert(
  utcDatetime: string,
  targetTimezone: string
): ConvertResult
```

If the project already standardizes on throwing errors or `Result` helpers, follow that convention and keep error semantics equivalent.

### 3) Enforce boundary conversion to UTC

- At input boundaries, convert user-picked local datetime to UTC immediately.
- Persist, compare, and pass UTC internally.
- Only convert from UTC to display timezone at output boundaries.

### 4) Keep logic outside UI

- UI components should call utilities/composables, not embed timezone algorithms.
- Move parsing/validation/conversion into `src/utils/timezone.ts` (or composables/services that delegate to it).

### 5) Add unit tests

In `tests/unit/timezone.spec.ts`, include at minimum:

- Multi-timezone conversion cases (for example: `UTC`, `America/New_York`, `Europe/London`, `Asia/Tokyo`).
- DST-sensitive cases (spring forward and fall back windows for at least one DST timezone).
- Invalid UTC datetime input handling.
- Invalid timezone identifier handling.

Prefer deterministic assertions:

- Assert known formatted outputs for fixed UTC timestamps.
- Avoid relying on machine local timezone.
- Keep tests explicit about timezone under test.

Vitest-first commands (Jest alternative in parentheses):

- `npm run lint`
- `npm run format` (or project-specific prettier check command)
- `npm run test:unit` (`npm run test` for Jest-based setups)
- `npm run test:e2e` (Playwright, if impacted by datetime UI behavior)

## Review Checklist

- UTC is the only persisted/internal datetime representation.
- `convert(utcDatetime, targetTimezone)` exists and is reused.
- No manual offset math where `Intl` can be used safely.
- Invalid UTC/timezone inputs are handled predictably.
- Country-to-IANA map is typed and centralized.
- Tests cover multi-timezone + DST + invalid datetime + invalid timezone.
- ESLint, Prettier, Playwright, and unit tests pass.

## Brief Pre-Finalization Checklist

- [ ] Function signatures and error behavior are documented or self-evident from types.
- [ ] No timezone conversion logic remains inside Vue component templates/scripts.
- [ ] Added/updated tests fail before and pass after the change.
- [ ] Lint, format, unit tests, and relevant Playwright tests are green.
- [ ] File organization matches:
  - `src/config/timezones.ts`
  - `src/utils/timezone.ts`
  - `tests/unit/timezone.spec.ts`
