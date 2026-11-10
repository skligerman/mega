# What I learned in mega.dev (so far)

Informal notes. Not a transcript. Written to be re-read before the next challenge.
Only S01E02 to S01E04 have material in this repo; S01E01 folder is empty.

---

## S01E02: Who said what (audio + video, two timezones)

**What it was.** Two recordings of the same nightly batch, told by two different "reporters". The job: find a specific number in each (audio: invites moved `2,140`; video: `1,870`), report the finding plus a timestamp offset, then file one plain-text record with every spoken word, in order.

**What we did.**
- Transcribed locally (whisper `ggml-medium.en`, files in `s01e02/work/`), pulled a frame from the video (`frame66.jpg`) for the on-screen number.
- POSTed `{ticket, finding, offset}` to `/api/audio` and `/api/video`, each returning a **receipt**. Then `{ticket, record}` to `/api/record`.
- `s01e02/log.md` logs every request and reply. That log is the real debugging asset.

**Clues that mattered.**
- The two summaries disagree on purpose: one says "All times are UTC", the other "local, plus two hours". Same event, different clocks. 2,140 vs 1,870 are both "right" in their own frame.
- The reply's `forHarness` field told the agent the next exact step and the payload shape. Read it.
- Receipts last 14 days, then you must resend.
- The server told us to stop and continue in a **new session** with `resume-challenge` and the three receipts.

**Takeaways for my AI coding.**
1. Keep a request/reply log from the first call. When something breaks, the payload is the answer.
2. Two sources that disagree are often the same truth in different units or time zones. Check units before "fixing".
3. Machine replies carry instructions (`forHarness`, `instruction`). Read the whole reply, not just the status code.

---

## S01E03: Building knowledge systems

**The lesson in one paragraph.** Knowledge bases are now written and maintained by agents, read mostly by agents. So: plain text files (Markdown, HTML, `.svx` with components), a single inbox, metadata, global and project context, a task board, scheduled cleanup. Let the agent shape the structure; you steer. Search is a ladder: grep/ripgrep, semantic search (similar in meaning is not the same as relevant), fast "decision" models, hybrid. The real failure mode: the agent finds notes that *look* complete and never reaches the one that explains why.

**The challenge.** Ticket #4471 had 412 unique reports (427 rows in the export) all merged as one bug "dates are wrong". Split it into real problems and put a signed page in the support kb.

**What we found.**
| Problem | Reports | Cause |
|---|---|---|
| parser | 379 | shared parser reads month first, all 11 tenants write day first |
| hint | 33 | booking-v3 form prints `MM/DD/YYYY` but reads day first. Parser fix does NOT fix these |
| shift | 5 | one-day moves, time zone / UTC bug, no swap |

**Clues and traps (what the git history shows we hit).**
- Same symptom, different causes: the hint set looks exactly like the parser bug by body text. You must separate by **tenant + channel** (alder.physio, copper.studio, pale.harbour **and** form), not by wording.
- Intake's `parser`/`hint` tag comes from the reporter's **browser locale**. It is a guess. 41 were tagged hint; true hint count is 33.
- Duplicates: count once per report id (427 rows, 412 unique).
- "Counted the way the desk counts": the kb has its own cause table and counting rule. Matching its numbers (379/33/5) took a commit.
- The kb page had to be **signed** (`signature` frontmatter + `<RenderStamp />`) and use **only the desk's exported components**. Our first version invented components; the last commit removed them.
- Tickets had to list report ids and be filed "as filed" (bodies unedited).
- `classify.py` finds two dates in each body and classifies: swap, one-day-apart, other. This is the "verify with code, don't eyeball it" move.

**Takeaways for my AI coding.**
1. Tags are claims, not facts. Re-derive categories from fields you trust.
2. Put a number that can be computed in code, not prose. (The kb itself says this.)
3. Before adding to someone's system, read its README conventions. Reuse their components; don't invent.
4. A cheap script that classifies every record beats reading 400 records.
5. Give the agent context files (vision, styleguide, conventions). That is exactly what `CLAUDE.md` / `AGENTS.md` are for.

---

## S01E04: rig (plan, issues, workers, public preview)

**What it was.** A small Hono + JSX service (`s01e04-rig`) that keeps a heartbeat, serves a status board, and now needs a **morning digest** page from `runs/<night>.jsonl`. The point is the *workflow*, not the code: plan file, split into issues, workers per issue, review via a public preview, then clean up.

**How work moves (from the repo's `AGENTS.md`).**
1. One `plan.md` at a time.
2. Split into GitHub issues with the `plan-to-issues` skill. Human reviews the split before publishing. No GitHub issues? Use `docs/issues/NNN-slug.md` with YAML frontmatter (ADR 0004).
3. One worker per issue, own branch. Strong model for logic, cheaper for views and tests.
4. Close with a fixed comment: `done:` / `worker:` / `commit:`.

**Traps that are easy to miss.**
- `runs/` is read-only fixtures. Don't edit them. Tests use a temp dir.
- Bad JSONL lines must be counted, never thrown. `owner` can be `null`, show `—`.
- The page and the JSON must never disagree.
- Preview must be a **public HTTPS link on a real host** (not localhost, not an IP) you can upload over later. It carries the lane marker, so step 4 is: re-save with `LANE_MARKER` unset and upload over the same link. A link still showing the marker is a bug (ADR 0003).
- Never put previews in the repo, issues or chat.
- Repo history shows this was done via GitHub Pages and a "remove lane marker" commit.
- `s01e04-rig` is its own git repo inside this one; the outer repo shows it as untracked.

**Takeaways for my AI coding.**
1. Plans as files, work as issues: chat disappears, files and issues don't.
2. Commit the shared types first so parallel workers can start together.
3. Write "Done when:" for every task. It tells the agent when to stop.
4. Anything that goes public needs a clean-up step in the plan.

---

## When a challenge is stuck: checklist

1. Re-read the last reply in full (`note`, `forHarness`, `instruction`, error code, HTTP status).
2. Find the contract (`.claude/skills/read`). Quote it. Compare field by field.
3. Check units, time zones, and counting rules (unique ids vs rows).
4. Check expiry: receipts, tickets, tokens.
5. Check whether it needs a new session or a human action.
6. If a human is needed, give them: what is blocked, the exact payload and reply (tokens masked), and what you tried. Then ask.

## Open items / not verified
- S01E01 content isn't in the repo, so nothing is summarized.
- No video transcripts were found in the folders; S01E03 notes come from the lesson text, S01E02 and S01E04 from logs, code and commit history. Add transcripts and I'll fold them in.
