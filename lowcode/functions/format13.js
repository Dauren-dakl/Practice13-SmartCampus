const messages = {"AVAILABLE": "Available. The requested interval is free; no booking has been created.", "OVERLAP": "Unavailable. The interval overlaps the existing 10:00-11:00 booking.", "ROOM_BLOCKED": "Unavailable. Room B-204 is blocked.", "INVALID_START": "Enter a whole-number start from 0 to 1439 minutes.", "INVALID_DURATION": "Enter a whole-number duration greater than 0 and at most 120 minutes.", "PAST_START": "Start must be strictly after the fixed current time, 09:00 (540).", "DAY_END_EXCEEDED": "The interval must end by minute 1440 (24:00).", "INVALID_BLOCKED": "Room blocked must be a boolean value."};
msg.result.message = messages[msg.result.reasonCode];
msg.payload = msg.result;
return msg;
