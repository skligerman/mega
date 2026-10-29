// The problems inside one merged ticket. Counts follow the desk's own view (causes.ts): every report is
// filed under its cause by tenant and channel. causes.ts has no word for a date that moved by one day:
// no month flip explains that. The desk's notes (desk-notes.json) pick those reports out; here they get
// a problem of their own, still counted where the desk files them.
import { groupByCause, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift' | 'unplaced';

export const PROBLEMS: Record<Problem, string> = {
  parser: 'the shared parser reads day-first dates month first: day and month swap',
  hint: 'the booking-v3 form hints MM/DD and reads DD/MM: day and month swap',
  shift: 'the date moves by one day across time zones: no swap at all',
  unplaced: 'no tenant on file: no cause can be placed',
};

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  // Where the desk files these reports, when that is another problem.
  filedUnder: Problem[];
  tenants: string[];
  channels: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

export type Split = { rows: number; unique: number; merged: number; groups: ProblemGroup[] };

function group(problem: Problem, rs: Report[], filedUnder: Problem[]): ProblemGroup {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    filedUnder,
    tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
    channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
  };
}

export function splitTicket(
  rows: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  shifted: readonly string[],
): Split {
  const unique = uniqueById(rows);
  const merged = unique.filter((r) => r.mergedInto === ticket);
  const filed = groupByCause(merged, tenantOf);
  const groups = filed.map((g) => group(g.cause, g.reports, []));
  const moved = merged.filter((r) => shifted.includes(r.id));
  if (moved.length) {
    const under = filed.filter((g) => g.reports.some((r) => shifted.includes(r.id))).map((g) => g.cause);
    groups.push(group('shift', moved, under));
  }
  return { rows: rows.length, unique: unique.length, merged: merged.length, groups };
}
