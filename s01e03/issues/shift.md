**Reports covered: 5** of the 412 unique reports merged into #4471.

## Problem
The date moves by one day, or differs between people in different places. No day/month swap explains it; this looks like a time zone / UTC conversion bug, not the parser.

## Reports
- R-41202 kettle.books, email: "Invite says Tuesday 12 May. Calendar says Monday 11 May."
- R-41209 alder.physio, app: "Every booking in June is one day off. Only June."
- R-41236 nine.lanterns, app: "The invite arrived before I made the booking."
- R-41344 pale.harbour, email: "Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting."
- R-41620 lantern.row, email: "Tuesday 6 October showed as Monday."

Seen 2026-04-02 → 2026-10-04. The desk listed exactly these as `oneDayMove` in its notes but counted them under the parser cause of #4471.
