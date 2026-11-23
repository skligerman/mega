"""Split the #4471 export into causes and write one issue body per cause.
Usage: python3 -I split.py <kb-dir> <out-dir>"""
import json, glob, sys, collections
kb, out = sys.argv[1], sys.argv[2]
D = f"{kb}/src/lib/data"
rows = json.load(open(f"{D}/reports-4471.json"))
tenants = {t["handle"]: t for t in map(lambda f: json.load(open(f)), glob.glob(f"{D}/tenants/*.json"))}
shift_ids = set(json.load(open(f"{D}/desk-notes.json"))["oneDayMove"])
uniq = list({r["id"]: r for r in rows}.values())  # one id, one report
day_first = lambda loc: loc != "en-US"           # only en-US writes month first here
def cause(r):
    t = tenants[r["tenant"]]
    return "hint" if r["channel"] == "form" and t["form"] == "booking-v3" and day_first(t["locale"]) else "parser"
g = collections.defaultdict(list)
for r in uniq: g[cause(r)].append(r)
g["shift"] = [r for r in uniq if r["id"] in shift_ids]  # also inside parser: the desk's view
assert len(uniq) == 412 and len(g["parser"]) + len(g["hint"]) == 412
def facts(rs):
    ch = collections.Counter(r["channel"] for r in rs)
    d = sorted(r["receivedAt"][:10] for r in rs)
    return f"Channels: " + " · ".join(f"{k} {ch[k]}" for k in sorted(ch)) + f". Seen {d[0]} → {d[-1]}.", ", ".join(sorted(r["id"] for r in rs))
T = {
 "parser": ("shared parser reads day-first dates month first",
  "The shared date parser reads every date month first. Tenants write the day first, so their dates come out with day and month swapped (\"8 December\" becomes \"12 August\").",
  ["Tenant writes dates day first (every tenant on file does).", "Came in by app, email, or the booking-v2 form (not the booking-v3 form, see the hint ticket).", "Body names two dates with day and month swapped."],
  ["The count is the desk's view (its cause table): it includes 5 reports that are one day off instead of swapped.", "This is the fix #4471 already has queued. It does not fix the booking-v3 form hint.", "Intake's tag comes from the reporter's browser and does not match the cause; use tenant and channel."]),
 "hint": ("booking-v3 form hints MM/DD but reads DD/MM",
  "The booking-v3 form prints `MM/DD/YYYY` under its date field. People at day-first tenants type what the hint says, month first, and the form reads it their way. A different bug from the parser: fixing the parser does not fix it.",
  ["Channel is `form`.", "Tenant runs booking-v3 and writes day first: alder.physio, copper.studio, pale.harbour.", "Body names two dates with day and month swapped."],
  ["Fix is the hint text (or the form's reading), not the shared parser."]),
 "shift": ("dates move by one day across time zones",
  "The date is right but lands one day off, not day/month swapped. Reports mention only June, a client in Lisbon vs one in Toronto, and an invite that arrived before the booking. That points at time zones, not at the parser.",
  ["Date is off by exactly one day; day and month are not swapped.", "Listed in the desk's own `oneDayMove` note."],
  ["The desk's cause table also counts these 5 under `parser` (by tenant and channel) and footnotes them, so they are in both tickets.", "Cause is a lead, not proven: the reports point at time zones."]),
}
for k, (title, prob, rec, notes) in T.items():
    rs = g[k]; f, ids = facts(rs)
    body = f"**Reports covered: {len(rs)} unique reports from #4471**\n\n## Problem\n{prob}\n\n## How to recognise it\n" + "".join(f"- {x}\n" for x in rec) + f"- {f}\n\n## Notes\n" + "".join(f"- {x}\n" for x in notes) + "- The count is by unique report id, not raw export rows.\n\n" + f"## Reports (merged into #4471)\n{ids}\n"
    open(f"{out}/{k}.md", "w").write(f"{title} ({len(rs)} reports)\n\n{body}")
    print(k, len(rs), f)
