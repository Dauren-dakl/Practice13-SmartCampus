export type ExistingBooking = {
  id: string;
  title: string;
  start: number;
  end: number;
};

export const MAX_DURATION = 120;
export const MIN_MINUTE = 0;
export const MAX_MINUTE = 1440;

export const NOW_RANGE = { min: MIN_MINUTE, max: 1439 };
export const START_RANGE = { min: MIN_MINUTE, max: 1439 };
export const END_RANGE = { min: 1, max: MAX_MINUTE };

export type FieldState = {
  value: string;
  touched: boolean;
};

export type FieldError = "empty" | "non-integer" | "out-of-range" | null;

export type CheckOutcome =
  | { status: "available" }
  | { status: "unavailable"; reasons: string[] }
  | { status: "invalid"; reasons: string[] };

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function minutesToTime(m: number): string {
  if (Number.isNaN(m) || m < 0 || m > 1440) return "--:--";
  const h = Math.floor(m / 60) % 24;
  const min = m % 60;
  return `${pad2(h)}:${pad2(min)}`;
}

export function parseField(f: FieldState): number | null {
  const trimmed = f.value.trim();
  if (trimmed === "") return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n)) return null;
  return n;
}

export function fieldError(f: FieldState, opts: { min: number; max: number }): FieldError {
  const trimmed = f.value.trim();
  if (trimmed === "") return "empty";
  if (!/^-?\d+$/.test(trimmed)) return "non-integer";
  const n = Number(trimmed);
  if (!Number.isInteger(n)) return "non-integer";
  if (n < opts.min || n > opts.max) return "out-of-range";
  return null;
}

export function errorText(
  err: NonNullable<FieldError>,
  opts: { min: number; max: number }
): string {
  if (err === "empty") return "This field is required.";
  if (err === "non-integer") return "Enter a whole number (no decimals or letters).";
  return `Enter a whole number between ${opts.min} and ${opts.max}.`;
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function bannerMessage(
  label: string,
  err: NonNullable<FieldError>,
  opts: { min: number; max: number }
): string {
  return `${label}: ${lowerFirst(errorText(err, opts))}`;
}

export function checkAvailability(params: {
  nowField: FieldState;
  startField: FieldState;
  endField: FieldState;
  roomBlocked: boolean;
  existingBookings: ExistingBooking[];
}): CheckOutcome {
  const { nowField, startField, endField, roomBlocked, existingBookings } = params;

  const nowErr = fieldError(nowField, NOW_RANGE);
  const startErr = fieldError(startField, START_RANGE);
  const endErr = fieldError(endField, END_RANGE);

  const validation: string[] = [];
  if (nowErr) validation.push(bannerMessage("Now", nowErr, NOW_RANGE));
  if (startErr) validation.push(bannerMessage("Start", startErr, START_RANGE));
  if (endErr) validation.push(bannerMessage("End", endErr, END_RANGE));

  if (validation.length > 0) {
    return { status: "invalid", reasons: validation };
  }

  const n = parseField(nowField) as number;
  const s = parseField(startField) as number;
  const e = parseField(endField) as number;

  const block: string[] = [];

  // AC1
  if (!(0 <= s && s < e && e <= MAX_MINUTE)) {
    block.push("Start must be earlier than end, and both within 0–1440.");
  }
  if (!(s > n)) {
    block.push("Start must be strictly after the current time.");
  }

  // AC2
  if (e - s > MAX_DURATION) {
    block.push(`Booking duration is ${e - s} min; the maximum allowed is ${MAX_DURATION} min.`);
  }

  if (roomBlocked) {
    block.push("Room B-204 is currently blocked.");
  }

  // AC4 — overlap, touching endpoints allowed
  for (const b of existingBookings) {
    const overlaps = s < b.end && e > b.start;
    if (overlaps) {
      block.push(
        `Overlaps an existing booking: ${b.title} (${minutesToTime(b.start)}–${minutesToTime(b.end)}).`
      );
    }
  }

  if (block.length > 0) {
    return { status: "unavailable", reasons: block };
  }
  return { status: "available" };
}
