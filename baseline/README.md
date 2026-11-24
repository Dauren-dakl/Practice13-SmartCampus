# Assignment05 - Smart Campus audit
Shaldarbek Dauren / 24B032108. Existing project: one fictional room B-204 with a600-660 read-only booking. No backend, login, database, external API, personal data or booking creation.

## Baseline and scope
Baseline is the after/ tree in the student's Practice09_Shaldarbek_Dauren_Source.html export. The Assignment05 checkpoint is preserved in baseline/ with SHA-256 evidence. This task deliberately audits the smaller deterministic checker, not the unpublished Practice12 mock extension. No Bolt workspace, live site or external repository was changed. A source export is the assignment's allowed submission route.

## Setup and exact checks
Tested runtime: Node24.22.3, npm11.19.1. Vite7 requires Node20.19+ or22.12+; the previous loose Node22+ guidance was incomplete.
Install using the unchanged package-lock.json: npm ci --ignore-scripts --no-audit. A separate clean copy successfully installed321 packages and passed the full verification sequence. Offline installation was attempted first and failed ENOTCACHED for yocto-queue; cache completeness is not assumed.
Run npm test (20 tests), npm run lint, npm run typecheck, npm run build. Build does not replace typecheck. npm audit --json is a separate risk check and currently exits1 with20 affected package entries. Never run audit fix --force or silently upgrade dependencies.
For local review: npm run dev -- --host 127.0.0.1 --port 5200 --strictPort. Managed QA used only compiled static pages via the internal preview route, never a Vitest UI/API server. The standalone App.html needs no development server.

## Repository map
src/main.tsx: React entry; src/App.tsx: room fixture, form, current result and accessible fields.
src/lib/availability.ts: pure integer/range/duration/block/overlap rules, unchanged.
src/lib/availability.test.ts: original9 tests, unchanged.
src/lib/audit-regression.test.ts:8 additional edge cases and immutability checks.
src/App.audit.test.tsx:3 rendered-component label/description regressions.
index.html, src/index.css, tailwind/postcss configs: presentation/build setup.
package.json: test/lint/typecheck/build/dev/preview commands; lockfile pins resolved packages.
Dependencies: React18, TypeScript5.5, Vite7, Vitest2, ESLint9, Tailwind3, lucide-react; unused Supabase package remains installed but no client is configured.

## Changes and policy
R1: remove redundant submitted-outcome state; derive the displayed decision from current fields after first check.
R2: useId/label htmlFor/input id and linked hint/error descriptions with aria-invalid.
No new pattern: Strategy and Adapter do not solve a current variation point. No engine, fixture, original assertions, CSS, dependency or lockfile changes. See ACCEPTANCE.md, PATTERN_DECISION.md, AGENTS.md and BACKGROUND_TASK.md.

## Readiness and release
Level2 Documented, not Level3. CONDITIONAL for a local classroom demonstration with trusted fixtures, no credentials, no public dev/test servers and human review before a production merge. Dependency advisories remain; production/network-exposed tooling is NO-GO pending reviewed remediation and verification. The formatter still shows1440 as00:00 (known feedback ambiguity); source export contains no CI gate; no screen-reader/physical-phone or Windows-specific checks were run. See the report, risk register and raw evidence.
