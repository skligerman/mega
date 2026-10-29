import json, re, sys
from datetime import date
M = {m:i+1 for i,m in enumerate("January February March April May June July August September October November December".split())}
rs = {r["id"]: r for r in json.load(open(sys.argv[1]))}.values()
v3 = {"alder.physio","copper.studio","pale.harbour"}
out = {}
for r in rs:
    ds = [(int(d), M[m]) for d,m in re.findall(r"(\d{1,2}) (" + "|".join(M) + r")", r["body"])]
    if len(ds) == 2:
        (d1,m1),(d2,m2) = ds
        if (d1,m1) == (m2,d2): k = "swap"
        elif abs((date(2026,m1,d1)-date(2026,m2,d2)).days) == 1: k = "oneday"
        else: k = "other2"
    else: k = f"dates{len(ds)}"
    form = "v3form" if (r["tenant"] in v3 and r["channel"]=="form") else "rest"
    out.setdefault((k, form), []).append(r)
for k, v in sorted(out.items()): print(k, len(v))
for k, v in sorted(out.items()):
    if k[0] != "swap":
        for r in v: print(k, r["id"], r["tenant"], r["channel"], r["meta"]["browserLocale"], r["receivedAt"][:10], "|", r["body"])
