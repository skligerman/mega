#4471 split: booking-v3 form hints MM/DD but reads DD/MM (33 reports)

**Reports covered: 33** of the 412 unique reports merged into #4471.

## Problem
The booking-v3 form prints `MM/DD/YYYY` under its date field. People at day-first tenants type what the hint says, month first, and the form reads it their way. A different bug from the parser: fixing the parser does not fix it.

## How to recognise it
- Channel is `form`.
- Tenant runs booking-v3 and writes day first: alder.physio, copper.studio, pale.harbour.
- Body names two dates with day and month swapped.
- Channels: form 33. Seen 2026-04-17 → 2026-09-22.

## Notes
- Fix is the hint text (or the form's reading), not the shared parser.
- Counted once per report id: the export holds 427 rows, 412 unique. Parser + hint = 412; the shift reports are also inside parser.

## Reports (merged into #4471)
R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
