// The problems inside one merged ticket. causes.ts tells `parser` from `hint` by tenant and channel.
// It has no word for a date that moved by one day: no month flip explains that, so the desk's notes
// (desk-notes.json) pick those reports out, and here they get a problem of their own.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'shift' | 'unplaced';

export const PROBLEMS: Record<Problem, string> = {
  parser: 'the shared parser reads day-first dates month first: day and month swap',
  hint: 'the booking-v3 form hints MM/DD and reads DD/MM: day and month swap',
  shift: 'the date moves by one day across time zones: no swap at all',
  unplaced: 'no tenant on file: no cause can be placed',
};

export function problemOf(r: Report, t: Tenant | undefined, shifted: readonly string[]): Problem {
  if (shifted.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: string[];
  channels: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

export type Split = { rows: number; unique: number; merged: number; groups: ProblemGroup[] };

export function splitTicket(
  rows: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  shifted: readonly string[],
): Split {
  const unique = uniqueById(rows);
  const merged = unique.filter((r) => r.mergedInto === ticket);
  const byProblem = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r), shifted);
    byProblem.set(p, [...(byProblem.get(p) ?? []), r]);
  }
  const groups = [...byProblem.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
        channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { rows: rows.length, unique: unique.length, merged: merged.length, groups };
}
