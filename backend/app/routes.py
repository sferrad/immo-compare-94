from fastapi import APIRouter
from app.data import load_dvf_94
import json
import os
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

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

@router.get("/cadastre")
def get_cadastre():
    path = "data/cadastre_94.geojson"
    if not os.path.exists(path):
        return {"error": "Fichier cadastre introuvable"}
    with open(path, "r") as f:
        data = json.load(f)
    
    communes = {}
    for feature in data["features"]:
        code = feature["properties"]["commune"]
        geom = shape(feature["geometry"])
        if code not in communes:
            communes[code] = []
        communes[code].append(geom)
    
    features = []
    for code, geoms in communes.items():
      valid_geoms = []
      for g in geoms:
          if not g.is_valid:
              g = g.buffer(0)  # corrige les géométries invalides
          valid_geoms.append(g)
      merged = unary_union(valid_geoms)
      features.append({
          "type": "Feature",
          "properties": {"code_insee": code},
          "geometry": mapping(merged)
    })

    return {
        "type": "FeatureCollection",
        "features": features
    }
            