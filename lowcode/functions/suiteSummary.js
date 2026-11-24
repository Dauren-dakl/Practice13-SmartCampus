const rows=msg.payload; msg.payload=rows.filter(r=>r.result === "PASS").length + " / 8 passed / actual Node-RED flow"; return msg;
