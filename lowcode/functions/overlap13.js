const s = msg.request.start, e = s + msg.request.duration;
const occupied = msg.bookings.some(b => s < b.end && e > b.start);
msg.result = { availability: !occupied, valid: true, reasonCode: occupied ? "OVERLAP" : "AVAILABLE" };
return msg;
