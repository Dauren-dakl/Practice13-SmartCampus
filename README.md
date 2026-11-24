# Practice 13 - code versus low-code

Shaldarbek Dauren | 24B032108 | Tuesday 13:00-16:00

Submission subject: AI-Driven Software Engineering Practice #13, Shaldarbek Dauren, 24B032108
The source brief is Lesson 12; its submission section explicitly says Practice #13.

## Status
Both real local implementations pass the same eight acceptance checks. Code has 36 passing automated tests. Public repository destination: https://github.com/Dauren-dakl/Practice13-SmartCampus. Public code demo: https://dauren-dakl.github.io/Practice13-SmartCampus/ (verified 8/8 common tests). The real low-code Node-RED runtime remains local; no public low-code host is claimed. Local URLs below are not public demo links. The code demo is published; the low-code reproduction is local, with the real flow export supplied.

## Reproduce (Node.js 24 used)
1. In code/: npm ci; npm test; npm run lint; npm run typecheck; npm run build.
2. In lowcode/: npm ci --ignore-scripts; node node_modules/node-red/red.js --userDir . --settings settings.cjs.
3. Wait for the initialization Inject node. Open http://127.0.0.1:1880/dashboard/room and http://127.0.0.1:1880/code/.
4. Editor: http://127.0.0.1:1880/editor/. flows.json is the actual importable visual workflow; it uses native Dashboard form/text/table widgets, Change, Switch, Link and small Function nodes.
5. From repository root, with Node-RED running: node run-runtime-tests.mjs. This runs the actual TypeScript module and actual HTTP flow. Results are written into evidence/.

## Shared contract
One fictional B-204 booking: Intro to Algorithms 600-660; fixed now 540. Start is a whole minute 0-1439 and strictly after now. Duration is a whole minute 1-120; end <=1440. Adjacent endpoints do not overlap. Blocked is strictly boolean. Output: availability, valid, reasonCode, message. No booking writes.

AC1 future start (T6); AC2 duration 1-120 (T4/T5 and additional boundary test); AC3 no overlap (T2/T7); AC4 blocked unavailable (T3); AC5 deterministic decision and immutable bookings (T1/T8); AC6 clear validation feedback (T4-T6 and malformed-input probes).

## Evidence and limitations
Baseline A5 source was frozen before implementation; checkpoint hashes and 20 passing inherited tests retained. Its pure rule module is reused unchanged. The code UI adds duration-to-end conversion. The low-code workflow is a genuine deployed Node-RED flow, generated/imported programmatically and reviewed in its editor; it is not a claim of manual dragging or no-code development.

The shared test table is shared/test-results.csv; full booleans/messages and raw runtime evidence are in evidence/common-runtime-results.json. Screenshots show actual running interfaces. Browser review also covered invalid duration and 375px layouts. The low-code toolbar title truncates at 375px and wide result tables require horizontal scrolling; form fields remain usable.

Timing files measure assistant/tool wall-clock segments, not student work or a controlled speed benchmark. Earlier platform selection was untimed. Code implementation segment 2.29 min; type repair/recheck 2.039 seconds. Low-code initial flow generation/start segment 1.91 min, ending before a successful cross-namespace browser connection. Package install reported 18 seconds; subsequent environment setup and UI display repair were not continuously timed. Runtime suite has its own elapsed seconds. Do not infer low-code is faster from these unequal segments.

## Security review
No real student bookings, connectors, database, external LLM, API keys or credentials. Code renders static result messages through React; low-code emits static text. Integer validation rejects script/SQL-like strings, fractions, empty and oversized input; no payload echo. Only own localhost runtime was probed. No third-party scanning.

Node-RED binds 127.0.0.1, editor /editor, HTTP routes /practice13, no admin authentication because local only. Never expose this editor or these unauthenticated test routes publicly. Public hosting requires separate admin authentication/TLS and dashboard/API access policy; no such public security deployment is claimed. No new external function modules; 2-second function timeout; memory-only fixture.

npm audit full dependency graphs report 20 code findings (2 critical,10 high,7 moderate,1 low), and 35 moderate low-code findings. These are advisory graph counts, not 55 independently demonstrated exploitable application bugs. Raw JSON retained. Baseline dependencies were not silently upgraded during the comparison; code owner must triage and patch test/build dependencies (notably vitest/tinypool), then rerun regression checks; low-code operator must track Node-RED/platform and transitive npm/minimatch updates. Public deployment is pending, including this triage.

## Comparison and recommendation
Both: 8/8 common tests. Code: custom React UI and direct TS tests, explicit boundary adapter, normal source/lockfile diffs. Low-code: built-in form/layout and visible routing; custom validation/overlap functions still need review; JSON export is portable with matching package versions, but requires a Node-RED runtime. Local paid subscription spend was zero; hosting and operator maintenance are not zero-effort or cost estimates. Prefer code for this existing React application and fine UI control; use low-code for rapid internal workflow integration when an operator can secure and maintain the runtime. No speed winner is asserted.

## AI-use reflection
ChatGPT/Codex assisted requirements extraction, TS adapter/UI, Node-RED flow JSON, tests and documentation. Exact model/version is not exposed by this session; not invented. Human student should review and explain both implementations. AI initially produced a T8 array typing error caught by separate typecheck, and a low-code object-to-text binding error caught visually despite API tests passing. Both were corrected and rechecked. This is why test output and visible UI were reviewed separately.

## Publish checklist
Public repository is populated at https://github.com/Dauren-dakl/Practice13-SmartCampus, including report, source, flow, tests and screenshots. No secrets or node_modules. The static demo is live on GitHub Pages at the URL above. Deploy the real Node-RED backend on an appropriately secured Node-compatible host if a low-code live demo is required. A static clone of its UI does not count as the real low-code runtime. Verified code demo and repository URLs are included in the report/README. Do not send ZIP/WinRAR or OneDrive links.

## References
https://nodered.org/about/
https://dashboard.flowfuse.com/nodes/widgets/ui-form.html
https://nodered.org/docs/user-guide/runtime/securing-node-red
