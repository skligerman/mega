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
