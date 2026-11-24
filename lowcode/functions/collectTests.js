const state = flow.get("suite:" + msg.suiteId);
if (!state) return null;
const actual = msg.payload;
const expected = msg.expected;
const pass = actual.availability === expected.availability && actual.valid === expected.valid && actual.reasonCode === expected.reasonCode;
state.rows.push({ case: msg.caseId, test: msg.caseLabel, expected: expected.reasonCode, observed: actual.reasonCode, result: pass ? "PASS" : "FAIL" });
if (state.rows.length < 7) { flow.set("suite:" + msg.suiteId, state); return null; }
state.rows.sort((a,b) => a.case.localeCompare(b.case));
const unchanged = state.before === JSON.stringify(flow.get("bookings"));
state.rows.push({ case: "T8", test: "Booking data unchanged", expected: "UNCHANGED", observed: unchanged ? "UNCHANGED" : "CHANGED", result: unchanged ? "PASS" : "FAIL" });
flow.set("suite:" + msg.suiteId, undefined);
msg.payload = state.rows;
return msg;
