# Timezone Converter App

Vue 3 + TypeScript + Vite app for timezone conversion with UTC as internal source of truth.

## Features

- Source timezone + local datetime input
- Immediate conversion to UTC internal state
- Target timezone output conversion
- Typed timezone mapping
- Unit tests (Vitest)
- E2E tests (Playwright)

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vitest
- Playwright

## Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended
- Git

## Clone And Setup

If cloning for the first time, include submodules:

```bash
git clone --recurse-submodules https://github.com/Joytun-Sultana/timezone-converter-app.git
cd <project-folder>
npm install
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
npm install
```

## Run Locally

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

## Test

Run unit tests:

```bash
npm run test:unit
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## Project Structure

- `src/` - application source code
- `tests/unit/` - Vitest unit tests
- `tests/e2e/` - Playwright E2E tests
- `context/` - project context documentation (Git submodule)

## Submodule Notes

This project tracks `context/` as a Git submodule:

- Path: `context`
- Remote: `https://github.com/Joytun-Sultana/timezone-context.git`
- Branch: `main`

When context docs are updated inside `context/`, commit and push in the submodule first, then commit the updated submodule pointer in the main repo.
