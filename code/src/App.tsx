import { useId, useMemo, useState } from 'react';
import { evaluateRequest, runCommonSuite } from './lib/duration-contract';
function TimeField({ label, hint, value, onChange, readOnly = false }: { label: string; hint: string; value: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  const id = useId();
  return <div><label htmlFor={id} className="block text-sm font-semibold text-slate-800">{label}</label><p id={`${id}-hint`} className="mb-2 text-sm text-slate-500">{hint}</p><input id={id} type="text" inputMode="numeric" value={value} readOnly={readOnly} onChange={e => onChange?.(e.target.value)} aria-describedby={`${id}-hint`} aria-invalid="false" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base read-only:bg-slate-100" /></div>;
}
export default function App() {
  const [start, setStart] = useState('700'), [duration, setDuration] = useState('60'), [blocked, setBlocked] = useState(false), [submitted, setSubmitted] = useState(false), [tests, setTests] = useState<ReturnType<typeof runCommonSuite> | null>(null);
  const result = useMemo(() => submitted ? evaluateRequest({ start, duration, blocked }) : null, [submitted, start, duration, blocked]);
  return <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900"><div className="mx-auto max-w-3xl">
    <header className="mb-6"><p className="text-sm font-bold uppercase tracking-widest text-teal-700">Smart Campus / code-based track</p><h1 className="mt-2 text-3xl font-bold">Room B-204 availability</h1><p className="mt-3 text-base text-slate-600">One fictional room. Existing booking: Intro to Algorithms, 10:00-11:00 (600-660). This checker never creates a booking.</p></header>
    <div className="grid gap-6 md:grid-cols-2"><form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <TimeField label="Current time (now)" hint="Fixed classroom clock, minutes after midnight" value="540" readOnly />
      <TimeField label="Requested start" hint="Whole minutes, strictly after 540" value={start} onChange={setStart} />
      <TimeField label="Duration" hint="Whole minutes, 1-120; end must be by 1440" value={duration} onChange={setDuration} />
      <label className="flex items-center gap-3 text-base"><input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} className="h-5 w-5" />Room is blocked</label>
      <button type="submit" className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white">Check availability</button>
    </form><section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Deterministic decision</h2>
      {result ? <div role="status" aria-live="polite" className={`mt-5 rounded-xl border p-5 ${result.availability ? 'border-emerald-200 bg-emerald-50' : result.valid ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}><p className="text-xl font-bold">{result.availability ? 'Available' : result.valid ? 'Unavailable' : 'Validation error'}</p><p className="mt-3 text-base">{result.message}</p><p className="mt-4 break-all font-mono text-sm">availability: {String(result.availability)}<br />reasonCode: {result.reasonCode}</p></div> : <p className="mt-5 text-slate-500">Check a request to see the result.</p>}
      <p className="mt-5 text-sm text-slate-500">The existing rule module determines availability. Input and duration validation are a small boundary adapter.</p>
    </section></div><section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">The same eight tests</h2><button type="button" onClick={() => setTests(runCommonSuite())} className="rounded-xl border border-teal-700 px-4 py-2 font-semibold text-teal-800">Run 8 tests</button></div>
      {tests && <><p className="my-4 font-bold">{tests.filter(t => t.pass).length} / 8 passed</p><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Case</th><th className="p-2">Expected</th><th className="p-2">Observed</th><th className="p-2">Result</th></tr></thead><tbody>{tests.map(t => <tr key={t.id} className="border-t border-slate-200"><td className="p-2">{t.id}: {t.test}</td><td className="p-2">{t.expected}</td><td className="p-2">{t.observed}</td><td className="p-2">{t.pass ? 'PASS' : 'FAIL'}</td></tr>)}</tbody></table></div></>}
    </section></div></main>;
}
