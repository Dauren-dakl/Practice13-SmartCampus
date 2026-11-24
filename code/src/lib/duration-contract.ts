import { checkAvailability, type ExistingBooking } from './availability.ts';
export const NOW = 540;
export const BOOKINGS: ExistingBooking[] = [{ id: 'b1', title: 'Intro to Algorithms', start: 600, end: 660 }];
export const MESSAGES = {
  AVAILABLE: 'Available. The requested interval is free; no booking has been created.',
  OVERLAP: 'Unavailable. The interval overlaps the existing 10:00-11:00 booking.',
  ROOM_BLOCKED: 'Unavailable. Room B-204 is blocked.',
  INVALID_START: 'Enter a whole-number start from 0 to 1439 minutes.',
  INVALID_DURATION: 'Enter a whole-number duration greater than 0 and at most 120 minutes.',
  PAST_START: 'Start must be strictly after the fixed current time, 09:00 (540).',
  DAY_END_EXCEEDED: 'The interval must end by minute 1440 (24:00).',
  INVALID_BLOCKED: 'Room blocked must be a boolean value.',
} as const;
export type ReasonCode = keyof typeof MESSAGES;
export type Outcome = { availability: boolean; valid: boolean; reasonCode: ReasonCode; message: string };
export type RequestInput = { start: unknown; duration: unknown; blocked: unknown };
function integer(v: unknown): number | null {
  if (typeof v === 'number') return Number.isSafeInteger(v) ? v : null;
  if (typeof v !== 'string' || v.trim().length > 4 || !/^-?\d+$/.test(v.trim())) return null;
  const n = Number(v.trim()); return Number.isSafeInteger(n) ? n : null;
}
function outcome(code: ReasonCode, valid = false): Outcome {
  return { availability: code === 'AVAILABLE', valid, reasonCode: code, message: MESSAGES[code] };
}
export function evaluateRequest(input: RequestInput): Outcome {
  const start = integer(input.start), duration = integer(input.duration);
  if (start === null || start < 0 || start > 1439) return outcome('INVALID_START');
  if (duration === null || duration <= 0 || duration > 120) return outcome('INVALID_DURATION');
  if (start + duration > 1440) return outcome('DAY_END_EXCEEDED');
  if (start <= NOW) return outcome('PAST_START');
  if (typeof input.blocked !== 'boolean') return outcome('INVALID_BLOCKED');
  const field = (value: number) => ({ value: String(value), touched: true });
  const result = checkAvailability({ nowField: field(NOW), startField: field(start), endField: field(start + duration), roomBlocked: input.blocked, existingBookings: BOOKINGS });
  if (result.status === 'available') return outcome('AVAILABLE', true);
  if (input.blocked) return outcome('ROOM_BLOCKED', true);
  return outcome('OVERLAP', true);
}
export const COMMON_CASES = [
  { id: 'T1', label: 'Valid free interval', input: { start: 700, duration: 60, blocked: false }, expected: 'AVAILABLE' },
  { id: 'T2', label: 'Overlap existing booking', input: { start: 630, duration: 60, blocked: false }, expected: 'OVERLAP' },
  { id: 'T3', label: 'Blocked room', input: { start: 700, duration: 60, blocked: true }, expected: 'ROOM_BLOCKED' },
  { id: 'T4', label: 'Zero duration', input: { start: 700, duration: 0, blocked: false }, expected: 'INVALID_DURATION' },
  { id: 'T5', label: 'Duration 121', input: { start: 700, duration: 121, blocked: false }, expected: 'INVALID_DURATION' },
  { id: 'T6', label: 'Past start', input: { start: 500, duration: 60, blocked: false }, expected: 'PAST_START' },
  { id: 'T7', label: 'Adjacent interval', input: { start: 660, duration: 60, blocked: false }, expected: 'AVAILABLE' },
] as const;
export function runCommonSuite() {
  const before = JSON.stringify(BOOKINGS);
  const rows: Array<{ id: string; test: string; expected: string; observed: string; pass: boolean }> = COMMON_CASES.map(c => { const observed = evaluateRequest(c.input); return { id: c.id, test: c.label, expected: c.expected as string, observed: observed.reasonCode as string, pass: observed.reasonCode === c.expected }; });
  rows.push({ id: 'T8', test: 'Booking data unchanged', expected: 'UNCHANGED', observed: JSON.stringify(BOOKINGS) === before ? 'UNCHANGED' : 'CHANGED', pass: JSON.stringify(BOOKINGS) === before }); return rows;
}
