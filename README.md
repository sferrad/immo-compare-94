# Immo Compare 94 — Comparateur immobilier du Val-de-Marne

Application full-stack permettant de **comparer les communes du Val-de-Marne (94)** à partir des
données immobilières publiques **DVF** (Demandes de Valeurs Foncières) et du **cadastre** du département.

Sélectionnez jusqu'à 5 communes et confrontez prix au m², prix médians et volumes de transactions,
le tout illustré sur une carte interactive.

## 🔗 Liens

| | URL |
|---|---|
| **Application (live)** | https://immo-compare-94.vercel.app |
| **API (live)** | https://immo-compare-94-production.up.railway.app |
| **Code source** | https://github.com/sferrad/immo-compare-94 |

> Documentation interactive de l'API disponible sur `/<api-url>/docs` (Swagger UI, fourni par FastAPI).

## ✨ Fonctionnalités

- **Sélecteur de communes** — jusqu'à 5 communes du 94 comparées simultanément.
- **Indicateurs clés** — prix au m² moyen, prix au m² médian, prix de vente moyen, nombre de transactions.
- **Carte interactive** (Leaflet) — contours réels des communes issus du cadastre, survol pour le détail.
- **Graphique comparatif** (Recharts) et **tableau détaillé triable**.

## 🧱 Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Leaflet, Recharts |
| **Backend** | Python, FastAPI, Uvicorn, pandas, shapely |
| **Données** | DVF 2024 (data.gouv.fr) · Cadastre 94 (GeoJSON) |
| **Déploiement** | Frontend → Vercel · Backend → Railway |

## 📊 Données & méthodologie

- **Source DVF** : [Demandes de valeurs foncières](https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/) (millésime 2024).
- **Cadastre** : fichier GeoJSON du département 94 fourni, agrégé par commune (`code INSEE`) côté backend.
- **Périmètre** : uniquement les ventes de type **Appartement** et **Maison**.
- **Nettoyage** : exclusion des lignes sans surface/valeur, et des prix au m² aberrants
  (conservés uniquement entre **500 €/m²** et **30 000 €/m²**).
- **Pré-calcul** : les statistiques par commune sont agrégées hors ligne via
  [`backend/generate_stats.py`](backend/generate_stats.py) et stockées dans `backend/data/stats_94.json`,
  ce qui rend l'API instantanée (pas de relecture du fichier DVF de ~450 Mo à chaque requête).

> ⚠️ Le fichier DVF brut (`ValeursFoncieres-2024.txt`, ~450 Mo) et le cadastre détaillé ne sont
> **pas versionnés** (cf. `.gitignore`). Seuls les fichiers dérivés et légers sont commités :
> `stats_94.json` et `cadastre_communes.geojson` (contours simplifiés par commune).

## 🚀 Lancer le projet en local

### Prérequis

- **Node.js** ≥ 18
- **Python** ≥ 3.10

### 1. Backend (API FastAPI)

```bash
cd backend

# Environnement virtuel
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate

# Dépendances
pip install -r requirements.txt

# Lancer l'API (port 8001)
uvicorn app.main:app --reload --port 8001
```

L'API est disponible sur **http://localhost:8001** (docs : http://localhost:8001/docs).

> Le dépôt inclut déjà `stats_94.json` et `cadastre_communes.geojson`, l'API démarre donc sans
> traitement préalable. Pour **régénérer les statistiques** à partir du fichier DVF brut, placez
> `ValeursFoncieres-2024.txt` dans `backend/data/` puis lancez :
> ```bash
> python generate_stats.py
> ```

### 2. Frontend (Next.js)

Dans un second terminal :

```bash
cd frontend

# Dépendances
npm install

# Pointer vers l'API locale
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local

# Lancer le serveur de dev
npm run dev
```

L'application est disponible sur **http://localhost:3000**.

## 📡 Endpoints de l'API

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/communes` | Liste des communes disponibles du 94. |
| `GET` | `/compare?communes=VINCENNES,CRETEIL` | Statistiques pour les communes sélectionnées (séparées par des virgules). |
| `GET` | `/cadastre` | Contours GeoJSON des communes du département. |

## 📁 Structure du projet

```
immo-compare-94/
├── backend/
│   ├── app/
│   │   ├── main.py            # App FastAPI + CORS
│   │   ├── routes.py          # Endpoints + agrégation du cadastre
│   │   └── data.py            # Chargement & nettoyage DVF (pandas)
│   ├── generate_stats.py      # Pré-calcul des stats par commune
│   ├── data/                  # Données (stats + cadastre commités, DVF brut ignoré)
│   ├── requirements.txt
│   └── Procfile               # Commande de démarrage (Railway)
└── frontend/
    └── app/
        ├── page.tsx           # Page principale
        ├── components/        # Map, CommuneSelector, CompareTable, CompareChart, StatsCards
        ├── hooks/useApi.ts    # Appels API
        └── lib/prices.ts      # Types & helpers
```

## 📄 Variables d'environnement

| Variable | Emplacement | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | URL de l'API (par défaut `http://localhost:8001`). |

---

_Données issues des demandes de valeurs foncières (DVF), publiées par la DGFiP via data.gouv.fr._
