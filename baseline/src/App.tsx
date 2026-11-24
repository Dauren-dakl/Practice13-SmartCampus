import { useState, useMemo, useId } from "react";
import {
  DoorClosed,
  Clock,
  CalendarRange,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Info,
  Lock,
} from "lucide-react";
import {
  type ExistingBooking,
  type FieldState,
  type FieldError,
  type CheckOutcome,
  checkAvailability,
  fieldError,
  parseField,
  errorText,
  minutesToTime,
  NOW_RANGE,
  START_RANGE,
  END_RANGE,
} from "@/lib/availability";

const EXISTING_BOOKINGS: ExistingBooking[] = [
  { id: "b1", title: "Intro to Algorithms", start: 600, end: 660 },
];

function App() {
  const [now, setNow] = useState<FieldState>({ value: "", touched: false });
  const [start, setStart] = useState<FieldState>({ value: "", touched: false });
  const [end, setEnd] = useState<FieldState>({ value: "", touched: false });
  const [roomBlocked, setRoomBlocked] = useState(false);

  const [submitted, setSubmitted] = useState(false);


  const nowErr = fieldError(now, NOW_RANGE);
  const startErr = fieldError(start, START_RANGE);
  const endErr = fieldError(end, END_RANGE);

  const previewOutcome = useMemo(() => {
    if (!submitted) return null;
    return checkAvailability({
      nowField: now,
      startField: start,
      endField: end,
      roomBlocked,
      existingBookings: EXISTING_BOOKINGS,
    });
  }, [submitted, now, start, end, roomBlocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNow((f) => ({ ...f, touched: true }));
    setStart((f) => ({ ...f, touched: true }));
    setEnd((f) => ({ ...f, touched: true }));
    setSubmitted(true);

  };

  const showFieldError = (
    f: FieldState,
    err: FieldError,
    opts: { min: number; max: number }
  ) => (f.touched && err ? errorText(err, opts) : null);

  const result = previewOutcome;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-[375px] px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <DoorClosed className="h-5 w-5" strokeWidth={2.2} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Smart Campus
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900">
            Room Availability Checker
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Check when Room B-204 is free. This tool only checks availability — it does not
            create or confirm bookings.
          </p>
        </header>

        {/* Room card */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <DoorClosed className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-base font-semibold leading-tight text-slate-900">
                  Room B-204
                </p>
                <p className="text-xs text-slate-500">Building B · 2nd floor · 40 seats</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                roomBlocked
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  roomBlocked ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />
              {roomBlocked ? "Blocked" : "Open"}
            </span>
          </div>

          <div className="px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <CalendarRange className="h-3.5 w-3.5" />
              Today's existing bookings
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Booking</th>
                    <th className="px-3 py-2 text-right font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {EXISTING_BOOKINGS.map((b) => (
                    <tr key={b.id} className="bg-white">
                      <td className="px-3 py-2 font-medium text-slate-700">{b.title}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                        {minutesToTime(b.start)}–{minutesToTime(b.end)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Existing bookings are read-only and never modified.
            </p>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Clock className="h-4 w-4 text-emerald-600" />
              Check a time slot
            </h2>

            {/* Now */}
            <TimeField
              label="Current time (now)"
              hint="Minutes after midnight, 0–1439"
              field={now}
              error={showFieldError(now, nowErr, NOW_RANGE)}
              onChange={(v) => setNow({ value: v, touched: true })}
            />

            {/* Start */}
            <TimeField
              label="Requested start"
              hint="Must be strictly after now"
              field={start}
              error={showFieldError(start, startErr, START_RANGE)}
              onChange={(v) => setStart({ value: v, touched: true })}
            />

            {/* End */}
            <TimeField
              label="Requested end"
              hint="Must be after start; max 120 min slot"
              field={end}
              error={showFieldError(end, endErr, END_RANGE)}
              onChange={(v) => setEnd({ value: v, touched: true })}
              isLast
            />
          </div>

          {/* Room blocked */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
            <span className="relative mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={roomBlocked}
                onChange={(e) => setRoomBlocked(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition checked:border-emerald-600 checked:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <CheckCircle2
                className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100"
                strokeWidth={3}
              />
            </span>
            <span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                <Lock className="h-3.5 w-3.5 text-rose-500" />
                Room is blocked
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                Tick this to simulate a room block. Any request will be rejected.
              </span>
            </span>
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.4} />
            Check availability
          </button>
        </form>

        {/* Result */}
        {result && <ResultPanel outcome={result} />}
      </div>
    </div>
  );
}

function TimeField({
  label,
  hint,
  field,
  error,
  onChange,
  isLast,
}: {
  label: string;
  hint: string;
  field: FieldState;
  error: string | null;
  onChange: (value: string) => void;
  isLast?: boolean;
}) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const value = parseField(field);
  return (
    <div className={isLast ? "" : "mb-3"}>
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">{label}</label>
        <span id={hintId} className="text-[11px] text-slate-400">{hint}</span>
      </div>
      <div className="flex items-stretch gap-2">
        <input
          id={inputId}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          aria-invalid={Boolean(error)}
          type="text"
          inputMode="numeric"
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. 600"
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm tabular-nums text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 ${
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/30"
              : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/30"
          }`}
        />
        <div className="flex w-[72px] flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium tabular-nums text-slate-500">
          {value !== null && value >= 0 && value <= 1440
            ? minutesToTime(value)
            : "--:--"}
        </div>
      </div>
      {error && (
        <p id={errorId} className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
          <Info className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function ResultPanel({ outcome }: { outcome: CheckOutcome }) {
  if (outcome.status === "available") {
    return (
      <section
        role="status"
        className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-emerald-800">Available</p>
            <p className="text-xs leading-relaxed text-emerald-700">
              Room B-204 is free for the requested slot. All rules passed.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isUnavailable = outcome.status === "unavailable";
  const title = isUnavailable ? "Unavailable" : "Couldn't check";
  const accent = isUnavailable ? "rose" : "amber";
  const Icon = isUnavailable ? XCircle : ShieldAlert;
  const reasons = outcome.reasons;

  return (
    <section
      role="status"
      className={`mt-4 rounded-2xl border p-4 shadow-sm ${
        isUnavailable
          ? "border-rose-200 bg-rose-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white ${
            isUnavailable ? "bg-rose-600" : "bg-amber-500"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.4} />
        </div>
        <div>
          <p
            className={`text-base font-bold leading-tight ${
              isUnavailable ? "text-rose-800" : "text-amber-800"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-xs leading-relaxed ${
              isUnavailable ? "text-rose-700" : "text-amber-700"
            }`}
          >
            {isUnavailable
              ? "This slot can't be booked. See why below."
              : "Please fix the input errors, then check again."}
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {reasons.map((r, i) => (
          <li
            key={i}
            className={`flex items-start gap-1.5 text-xs leading-relaxed ${
              accent === "rose" ? "text-rose-700" : "text-amber-700"
            }`}
          >
            <span
              className={`mt-1 h-1 w-1 flex-shrink-0 rounded-full ${
                accent === "rose" ? "bg-rose-500" : "bg-amber-500"
              }`}
            />
            {r}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default App;
