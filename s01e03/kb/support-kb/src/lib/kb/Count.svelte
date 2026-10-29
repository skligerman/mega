<script lang="ts">
  import { count } from '#lib/kb/split';
  import type { Problem } from '#lib/kb/problems';

  // An inline number from the data: <Count ticket={4471} of="hint" />
  let { ticket, of }: { ticket: number; of: Problem | 'rows' | 'unique' | 'merged' | 'problems' } = $props();
</script>

<strong>{count(ticket, of)}</strong>
