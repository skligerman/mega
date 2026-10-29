**Reports covered: 33** of the 412 unique reports merged into #4471.

## Problem
The booking-v3 form prints `MM/DD/YYYY` under its date field, so people type the month first, but the form reads the date the tenant's way, day first. Day and month swap. This is not the parser: fixing the shared parser leaves these reports as they are. The hint, or how the form reads its input, has to change.

## How to recognise it
- Tenant runs booking-v3: alder.physio (12), copper.studio (11), pale.harbour (10).
- Came in by the form channel.
- Body looks like the parser bug (day and month swapped), so the body alone does not tell them apart.
- Seen 2026-04-17 → 2026-09-22.

## Notes
- Intake tagged 41 reports `hint`, but its tag is a guess from the reporter's browser locale; it is not this set.

## Reports (merged into #4471)
R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
