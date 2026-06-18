from fastapi import APIRouter
from app.data import load_dvf_94

router = APIRouter()
df = load_dvf_94()

@router.get("/communes")
def get_communes():
    communes = sorted(df["Commune"].unique().tolist())
    return {"communes": communes}

@router.get("/stats/{commune}")
def get_stats(commune: str):
    data = df[df["Commune"] == commune.upper()]
    if data.empty:
        return {"error": "Commune introuvable"}
    return {
        "commune": commune,
        "nb_transactions": len(data),
        "prix_m2_moyen": round(data["prix_m2"].mean(), 2),
        "prix_m2_median": round(data["prix_m2"].median(), 2),
        "prix_moyen": round(data["Valeur fonciere"].mean(), 2),
    }

@router.get("/compare")
def compare_communes(communes: str):
    result = []
    for commune in communes.split(","):
        data = df[df["Commune"] == commune.strip().upper()]
        if not data.empty:
            result.append({
                "commune": commune.strip(),
                "nb_transactions": len(data),
                "prix_m2_moyen": round(data["prix_m2"].mean(), 2),
                "prix_m2_median": round(data["prix_m2"].median(), 2),
                "prix_moyen": round(data["Valeur fonciere"].mean(), 2),
            })
    return {"result": result}