#4471 split: dates move by one day across time zones (5 reports)

**Reports covered: 5** of the 412 unique reports merged into #4471.

## Problem
The date is right but lands one day off, not day/month swapped. Reports mention only June, a client in Lisbon vs one in Toronto, and an invite that arrived before the booking. That points at time zones, not at the parser.

## How to recognise it
- Date is off by exactly one day; day and month are not swapped.
- Listed in the desk's own `oneDayMove` note.
- Channels: app 2 · email 3. Seen 2026-04-02 → 2026-10-04.

## Notes
- The kb's cause table files these under `parser` by tenant and footnotes them. Counted here once, not in the parser ticket.
- Cause is a lead, not proven: the reports point at time zones.
- Counted once per report id: the export holds 427 rows, 412 unique. The three tickets add up to 412.

## Reports (merged into #4471)
R-41202, R-41209, R-41236, R-41344, R-41620
