from fastapi import APIRouter
import json
import os
from shapely.geometry import shape, mapping, Polygon, MultiPolygon
from shapely.ops import unary_union
from app.communes_94 import COMMUNES_94

router = APIRouter()


def smooth_commune(geom):
    geom = geom.buffer(0.0006).buffer(-0.0006)
    if geom.geom_type == "Polygon":
        return Polygon(geom.exterior)
    if geom.geom_type == "MultiPolygon":
        return MultiPolygon([Polygon(p.exterior) for p in geom.geoms])
    return geom


def build_cadastre():
    cache_path = "data/cadastre_communes.geojson"
    if os.path.exists(cache_path):
        with open(cache_path, "r") as f:
            return json.load(f)

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
                g = g.buffer(0)
            valid_geoms.append(g)
        merged = smooth_commune(unary_union(valid_geoms))
        features.append({
            "type": "Feature",
            "properties": {
                "code_insee": code,
                "nom": COMMUNES_94.get(code, "")
            },
            "geometry": mapping(merged)
        })

    result = {
        "type": "FeatureCollection",
        "features": features
    }
    with open(cache_path, "w") as f:
        json.dump(result, f)
    return result


cadastre_data = build_cadastre()

with open("data/stats_94.json", "r") as f:
    stats_data = json.load(f)


@router.get("/communes")
def get_communes():
    communes = sorted([s["commune"] for s in stats_data])
    return {"communes": communes}


@router.get("/compare")
def compare_communes(communes: str):
    selected = [c.strip().upper() for c in communes.split(",")]
    result = [s for s in stats_data if s["commune"] in selected]
    return {"result": result}


@router.get("/cadastre")
def get_cadastre():
    return cadastre_data