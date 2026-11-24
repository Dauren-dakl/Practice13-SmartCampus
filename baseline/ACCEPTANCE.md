# Assignment05 acceptance criteria
A1. Validate integer fields and range0..1440; require start<end and start strictly after now. Invalid or rejected requests never show Available.
A2. A valid slot is Available only if duration<=120, room not blocked and no overlap. Half-open intervals permit touching endpoints.
A3. Keep one fictional room and the600-660 booking unchanged; no writes, login, backend, credentials or booking creation.
A4. After the first check, every input/block change displays the deterministic result for the current request rather than a stored earlier decision. This requirement exposes a baseline defect and must pass in final.
A5. All three time inputs have visible programmatically associated labels and hint/error descriptions; validation is usable by keyboard and at375px. Screen-reader behavior is not claimed without direct testing. This is strengthened by the second mitigation.
Core engine and original tests are byte-for-byte preserved. A1-A3 have original plus edge-case unit tests; A4 has concrete browser event checks; A5 has rendered React markup regression tests and browser label-focus/validation checks.
