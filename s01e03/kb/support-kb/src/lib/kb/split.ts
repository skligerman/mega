// One split of a ticket, from the export the kb ships with. Components read it; pages never type its numbers.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import type { Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';
import { splitTicket, type Problem } from '#lib/kb/problems';

export const split = (ticket: number) => splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove);

export function count(ticket: number, what: Problem | 'rows' | 'unique' | 'merged' | 'problems'): number {
  const s = split(ticket);
  if (what === 'rows' || what === 'unique' || what === 'merged') return s[what];
  if (what === 'problems') return s.groups.length;
  return s.groups.find((g) => g.problem === what)?.reports.length ?? 0;
}
