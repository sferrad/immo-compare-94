from app.data import load_dvf_94

df = load_dvf_94()
print(df.shape)
print(df.columns.tolist())