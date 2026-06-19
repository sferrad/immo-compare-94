import json
import pandas as pd
from app.data import load_dvf_94

df = load_dvf_94()

communes = sorted(df["Commune"].unique().tolist())

result = []
for commune in communes:
    data = df[df["Commune"] == commune]
    if not data.empty:
        result.append({
            "commune": commune,
            "nb_transactions": len(data),
            "prix_m2_moyen": round(data["prix_m2"].mean(), 2),
            "prix_m2_median": round(data["prix_m2"].median(), 2),
            "prix_moyen": round(data["Valeur fonciere"].mean(), 2),
        })

with open("data/stats_94.json", "w") as f:
    json.dump(result, f)

print(f"Done — {len(result)} communes")