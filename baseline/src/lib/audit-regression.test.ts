import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';

const cases = [
  ['empty now', '', '700', '760', 'invalid'],
  ['decimal start', '540', '700.5', '760', 'invalid'],
  ['end out of range', '540', '1380', '1441', 'invalid'],
  ['zero duration', '540', '700', '700', 'unavailable'],
  ['valid end of day', '540', '1380', '1440', 'available'],
  ['contains booking', '400', '590', '670', 'unavailable'],
  ['touches booking before', '400', '500', '600', 'available'],
  ['negative start', '0', '-1', '60', 'invalid'],
] as const;
describe('Audit acceptance edge cases', () => {
  it.each(cases)('%s', (_name, now, start, end, status) => {
    const bookings = [{ id: 'b1', title: 'Intro to Algorithms', start: 600, end: 660 }];
    const before = JSON.stringify(bookings);
    const out = checkAvailability({ nowField: { value: now, touched: true }, startField: { value: start, touched: true }, endField: { value: end, touched: true }, roomBlocked: false, existingBookings: bookings });
    expect(out.status).toBe(status);
    expect(JSON.stringify(bookings)).toBe(before);
  });
});
