**Reports covered: 379** of the 412 unique reports merged into #4471.

## Problem
The shared date parser reads every date month first. All tenants on file write the day first, so their dates come out with day and month swapped ("8 December is now 12 August").

## How to recognise it
- Tenant writes dates day first (all 11 tenants: alder.physio, copper.studio, harbour.dental, kettle.books, lantern.row, long.table, morrow.tax, nine.lanterns, pale.harbour, ridge.clinic, stone.and.sons).
- Came in by app, email, or the booking-v2 form (not the booking-v3 form, see the hint ticket).
- Body names two dates with day and month swapped.
- Channels: app 204 · email 150 · form 25. Seen 2026-04-01 → 2026-10-04.

## Notes
- Counted the way the desk counts (its cause table): by tenant and channel. The desk files its one-day-move notes here too; they also have their own ticket.
- This is the fix #4471 already has queued. It does not fix the booking-v3 form hint.
- Intake's tag (`parser`/`hint`) comes from the reporter's browser and does not match the cause; use the tenant and channel.
- Counted once per report id: the export holds 427 rows.
