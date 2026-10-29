<script lang="ts">
  import { split } from '#lib/kb/split';
  import { PROBLEMS, type Problem } from '#lib/kb/problems';

  // `tickets`: where each problem is tracked now, problem → ticket URL.
  let { ticket, tickets = {} }: { ticket: number; tickets?: Partial<Record<Problem, string>> } = $props();

  const s = $derived(split(ticket));
  const channels = (c: Record<string, number>) =>
    Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .map(([ch, n]) => `${ch} ×${n}`)
      .join(' · ');
  const ref = (url: string) => '#' + url.split('/').pop();
</script>

<p class="sum">
  <strong>{s.rows}</strong> rows in the export · <strong>{s.unique}</strong> reports once each ·
  <strong>{s.merged}</strong> merged into #{ticket} · <strong>{s.groups.length}</strong>
  {s.groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>channels</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each s.groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code><br /><span class="what">{PROBLEMS[g.problem]}</span></td>
        <td>{g.reports.length}</td>
        <td class="small">{channels(g.channels)}</td>
        <td class="small" title={g.tenants.join(', ')}>{g.tenants.length}</td>
        <td class="small">{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if tickets[g.problem]}<a href={tickets[g.problem]}>{ref(tickets[g.problem]!)}</a>
          {:else}<span class="none">no ticket yet</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .what, .small { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
</style>
