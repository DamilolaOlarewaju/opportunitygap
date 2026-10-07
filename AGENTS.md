# OpportunityGap development instructions

## Context and scope

Read README.md, PRODUCT_BRIEF.md and CAPSTONE_SPEC.md before making changes.
This repository contains the Next.js/TypeScript foundation, a complete deterministic
sample flow and a server-side AI adapter. Live AI access remains unverified; see README.
Follow the capstone's evidence and privacy rules when implementing them: missing
evidence stays unknown; never invent achievements or hiring scores; distinguish
credentials from skills; keep personal input out of logs, commits and automatic
storage. Never silently replace real analysis with sample results.

## Framework guidance

Before writing Next.js code, read the relevant installed guides in
`node_modules/next/dist/docs/`. The installed framework version can differ from
remembered APIs. Start with `01-app/01-getting-started/01-installation.md` and
`01-app/01-getting-started/03-layouts-and-pages.md` for foundation work. Heed
deprecation notices. Use the App Router under `src/app`, strict TypeScript, and
the `@/*` alias for `src/*`.

## Commands

Run all commands from the repository root (`/workspace/opportunitygap` in cloud).
Validated with Node.js 24.19.0 and npm 11.9.0; Next.js requires Node.js >=20.9.0.
The project `.npmrc` puts npm's cache in `../.npm-cache`, a writable path in cloud.
Override with `npm --cache <writable-path> ci` if needed elsewhere.

| Purpose | Command |
| --- | --- |
| Install exact locked dependencies | `npm ci --no-fund --no-audit` |
| Development server | `npm run dev -- --hostname 0.0.0.0 --port 3000` |
| Production build (also checks types) | `npm run build` |
| Production server, after build | `npm run start -- --hostname 0.0.0.0 --port 3000` |
| Lint, warnings fail | `npm run lint` |
| Standalone type check | `npm run typecheck` |
| Product and adapter tests | `npm test` |
| Production browser checks | `npm run test:browser` (see README for Chromium setup) |

For readiness, request `/` locally and confirm HTTP 200, `OpportunityGap` branding,
the product headline and labelled Demo mode. Do not treat an open port
alone as success. Do not run dev and build concurrently against the same `.next`
directory; stop the dev server before building. Generated `next-env.d.ts`, `.next`
and TypeScript build info are ignored. Next.js regenerates its types on startup
and build. No secrets, database or other services are required for the demo.
Product tests use synthetic inputs and mocked provider responses; never add personal
CV text to fixtures. Keep server-only imports out of client modules. Real analysis
requires server credentials and permitted network access; never silently fall back.

## Change discipline

Use the existing checkout: each cloud task already has an isolated environment.
Do not create Git worktrees unless explicitly requested. Use a feature branch,
preserve unrelated changes, and inspect the diff before committing. Do not commit
or push unless requested. Keep package-lock.json synchronized with intentional
dependency changes; otherwise use npm ci. Do not disable lint, type checks, TLS,
package signatures or checksum verification to make checks pass.

IntelliTrex is a setup reference, not a dependency. See README.md for the inspected
commit and reuse decisions. Inspect its licence before copying any implementation.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
