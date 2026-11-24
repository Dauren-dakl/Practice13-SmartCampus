import { describe, it, expect } from "vitest";
import {
  checkAvailability,
  type ExistingBooking,
  type FieldState,
} from "./availability";

const B: ExistingBooking = { id: "b1", title: "Intro to Algorithms", start: 600, end: 660 };
const BOOKINGS: ExistingBooking[] = [{ ...B }];

function field(value: string): FieldState {
  return { value, touched: true };
}

function run(overrides: Partial<{
  now: string;
  start: string;
  end: string;
  roomBlocked: boolean;
  existingBookings: ExistingBooking[];
}>) {
  return checkAvailability({
    nowField: field(overrides.now ?? "500"),
    startField: field(overrides.start ?? "700"),
    endField: field(overrides.end ?? "760"),
    roomBlocked: overrides.roomBlocked ?? false,
    existingBookings: overrides.existingBookings ?? BOOKINGS,
  });
}

describe("checkAvailability — regression (AC1-AC6)", () => {
  // AC1: reject a start that is not strictly after "now".
  // Past time: start (400) <= now (500) violates "start must be strictly after now".
  it("rejects a start that is not strictly after now (AC1)", () => {
    const out = run({ now: "500", start: "400", end: "460" });
    expect(out.status).toBe("unavailable");
    expect(out.status === "unavailable" && out.reasons).toContain(
      "Start must be strictly after the current time."
    );
  });

  // AC1: reject start >= end.
  // Reversed interval: start (760) >= end (700) violates "start must be earlier than end".
  it("rejects a reversed interval where start >= end (AC1)", () => {
    const out = run({ now: "500", start: "760", end: "700" });
    expect(out.status).toBe("unavailable");
    expect(out.status === "unavailable" && out.reasons).toContain(
      "Start must be earlier than end, and both within 0–1440."
    );
  });

  // AC2: reject durations longer than 120 minutes; exactly 120 is allowed.
  // 121-minute slot: end - start = 121 > MAX_DURATION (120).
  it("rejects a 121-minute duration (AC2)", () => {
    const out = run({ now: "500", start: "700", end: "821" });
    expect(out.status).toBe("unavailable");
    expect(out.status === "unavailable" && out.reasons).toContain(
      "Booking duration is 121 min; the maximum allowed is 120 min."
    );
  });

  // AC2 boundary: exactly 120 minutes must be allowed (no duration reason).
  it("allows exactly 120 minutes (AC2 boundary)", () => {
    const out = run({ now: "500", start: "700", end: "820" });
    expect(out.status).toBe("available");
  });

  // AC3: reject every request when the room is blocked.
  // A slot that would otherwise be available becomes unavailable because roomBlocked is true.
  it("rejects an otherwise-valid slot when the room is blocked (AC3)", () => {
    const out = run({ now: "500", start: "700", end: "760", roomBlocked: true });
    expect(out.status).toBe("unavailable");
    expect(out.status === "unavailable" && out.reasons).toContain(
      "Room B-204 is currently blocked."
    );
  });

  // AC4: reject overlaps; touching endpoints are allowed (half-open intervals).
  // Overlap: requested 700-760 overlaps existing 600-660? No — these don't overlap.
  // Use 650-710 which overlaps 600-660 (s < b.end && e > b.start).
  it("rejects an overlap with an existing booking (AC4)", () => {
    const out = run({ now: "500", start: "650", end: "710" });
    expect(out.status).toBe("unavailable");
    expect(out.status === "unavailable" && out.reasons).toContain(
      "Overlaps an existing booking: Intro to Algorithms (10:00–11:00)."
    );
  });

  // AC4: touching endpoints are allowed. Requested 660-720 touches existing 600-660
  // at the endpoint (s == b.end), which is NOT an overlap under half-open intervals.
  it("allows a slot that only touches an existing booking at an endpoint (AC4)", () => {
    const out = run({ now: "500", start: "660", end: "720" });
    expect(out.status).toBe("available");
  });

  // AC5: the function must not mutate the input booking array or its elements.
  it("does not mutate the input bookings array (AC5)", () => {
    const snapshot = JSON.stringify(BOOKINGS);
    run({ now: "500", start: "650", end: "710" });
    expect(JSON.stringify(BOOKINGS)).toBe(snapshot);
    expect(BOOKINGS[0]).toEqual(B);
  });

  // AC6 sanity: a fully valid, non-overlapping, within-duration, future slot is available.
  it("returns available for a valid future slot with no overlaps (AC6/usability)", () => {
    const out = run({ now: "500", start: "700", end: "760" });
    expect(out.status).toBe("available");
  });
});
