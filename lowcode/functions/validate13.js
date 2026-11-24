const p = msg.payload || {};
const integer = v => {
  if (typeof v === "number") return Number.isSafeInteger(v) ? v : null;
  if (typeof v !== "string" || v.trim().length > 4 || !/^-?\d+$/.test(v.trim())) return null;
  const n = Number(v.trim()); return Number.isSafeInteger(n) ? n : null;
};
const start = integer(p.start), duration = integer(p.duration);
let reasonCode = null;
if (start === null || start < 0 || start > 1439) reasonCode = "INVALID_START";
else if (duration === null || duration <= 0 || duration > 120) reasonCode = "INVALID_DURATION";
else if (start + duration > 1440) reasonCode = "DAY_END_EXCEEDED";
else if (start <= msg.now) reasonCode = "PAST_START";
else if (typeof p.blocked !== "boolean") reasonCode = "INVALID_BLOCKED";
msg.validationOK = reasonCode === null;
msg.request = { start, duration, blocked: p.blocked === true };
msg.result = { availability: false, valid: false, reasonCode };
return msg;
