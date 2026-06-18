import pandas as pd

DATA_PATH = "data/ValeursFoncieres-2024.txt"

def load_dvf_94():
    df = pd.read_csv(DATA_PATH, sep="|", low_memory=False)
    df94 = df[df["Code departement"] == "94"]

    df94.loc[:, "Valeur fonciere"] = df94["Valeur fonciere"].str.replace(",", ".").astype(float)
    df94.loc[:, "Surface reelle bati"] = pd.to_numeric(df94["Surface reelle bati"], errors="coerce")
    df94.loc[:, "Date mutation"] = pd.to_datetime(df94["Date mutation"], format="%d/%m/%Y", errors="coerce")
    df94 = df94[df94["Type local"].isin(["Appartement", "Maison"])]
    df94 = df94.dropna(subset=["Valeur fonciere", "Surface reelle bati"])
    df94["prix_m2"] = df94["Valeur fonciere"] / df94["Surface reelle bati"]
    df94 = df94[(df94["prix_m2"] > 500) & (df94["prix_m2"] < 30000)]

    return df94