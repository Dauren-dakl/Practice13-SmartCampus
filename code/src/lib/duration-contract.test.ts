import { describe, it, expect } from 'vitest';
import { BOOKINGS, COMMON_CASES, evaluateRequest, runCommonSuite } from './duration-contract';
describe('Frozen Practice13 common cases', () => {
  it.each(COMMON_CASES)('$id: $label', c => { expect(evaluateRequest(c.input).reasonCode).toBe(c.expected); });
  it('T8 bookings unchanged after T1-T7', () => { const before = JSON.stringify(BOOKINGS); const rows = runCommonSuite(); expect(rows).toHaveLength(8); expect(rows.every(r => r.pass)).toBe(true); expect(JSON.stringify(BOOKINGS)).toBe(before); });
});
describe('Safe input boundaries', () => {
  it.each(['', '1.5', 'x', '<img src=x onerror=alert(1)>', '0'.repeat(5000)])('rejects malformed start %#', start => { const r = evaluateRequest({ start, duration: 60, blocked: false }); expect(r.valid).toBe(false); expect(r.reasonCode).toBe('INVALID_START'); expect(r.message).not.toContain(start || 'untrusted'); });
  it('rejects non-boolean room status', () => { expect(evaluateRequest({ start: 700, duration: 60, blocked: 'false' }).reasonCode).toBe('INVALID_BLOCKED'); });
  it('accepts exactly120 and end1440', () => { expect(evaluateRequest({ start: 1320, duration: 120, blocked: false }).availability).toBe(true); });
  it('rejects crossing day end', () => { expect(evaluateRequest({ start: 1430, duration: 30, blocked: false }).reasonCode).toBe('DAY_END_EXCEEDED'); });
});
